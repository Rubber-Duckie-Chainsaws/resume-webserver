package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

const defaultPort string = "3000"
const defaultEnv string = "DEVELOPMENT"
const defaultRoot string = "./web/"

type Record struct {
	Name           string
	File           string
	Src            string
	Imports        []string
	DynamicImports []string
	Css            []string
	IsEntry        bool
	IsDynamicEntry bool
}

func main() {

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	deployEnv := os.Getenv("DEPLOY_ENV")
	if deployEnv == "" {
		deployEnv = defaultEnv
	}

	root := os.Getenv("ROOT")
	if root == "" {
		root = defaultRoot
	}

	router := chi.NewRouter()
	router.Use(middleware.Logger)

	// These routes are only needed for vite dev
	fileServer := http.FileServer(http.Dir(filepath.Join(root, "src")))
	router.Handle("/src/*", http.StripPrefix("/src/", fileServer))
	nodeModulesFileServer := http.FileServer(http.Dir(filepath.Join(root, "node_modules")))
	router.Get("/node_modules/*", func(writer http.ResponseWriter, request *http.Request) {
		request.URL.RawQuery = ""
		handler := http.StripPrefix("/node_modules/", nodeModulesFileServer)
		handler.ServeHTTP(writer, request)
	})
	router.Get("/static/*", func(writer http.ResponseWriter, request *http.Request) {
		cfg, err := config.LoadDefaultConfig(context.TODO())
		if err != nil {
			log.Fatal(err)
		}

		bucket := os.Getenv("S3_BUCKET")
		key := request.URL.Path[len("/static/"):]
		client := s3.NewFromConfig(cfg)
		presignClient := s3.NewPresignClient(client)

		req, err := presignClient.PresignGetObject(context.TODO(), &s3.GetObjectInput{
			Bucket: aws.String(bucket),
			Key:    aws.String(key),
		})

		h := http.RedirectHandler(req.URL, http.StatusFound)
		h.ServeHTTP(writer, request)
	})

	publicFileServer := http.FileServer(http.Dir(filepath.Join(root, "dist/")))
	router.Handle("/public/*", http.StripPrefix("/public/", publicFileServer))
	assetsFileServer := http.FileServer(http.Dir(filepath.Join(root, "dist/assets")))
	router.Handle("/assets/*", http.StripPrefix("/assets/", assetsFileServer))
	router.Get("/*", func(writer http.ResponseWriter, request *http.Request) {
		var chunks map[string]Record

		manifestFile, err := os.ReadFile(filepath.Join(root, "/dist/.vite/manifest.json"))
		if err != nil {
			log.Fatal("Failed reading manifest.json", err)
		}
		err = json.Unmarshal(manifestFile, &chunks)

		var entries []string
		for k, v := range chunks {
			if v.IsEntry {
				entries = append(entries, k)
			}
		}

		var allLinks []template.HTML
		for _, entryName := range entries {
			links := prepEntryPoint(entryName, chunks)
			allLinks = append(allLinks, links...)
		}
		data := struct {
			Deploy string
			Links  []template.HTML
		}{
			Deploy: deployEnv,
			Links:  allLinks,
		}
		indexTemplate, _ := template.ParseFiles(filepath.Join(root, "index.html"))
		err = indexTemplate.Execute(writer, data)
		if err != nil {
			log.Fatal(err)
		}
	})
	http.ListenAndServe(fmt.Sprintf(":%s", port), router)
}

func prepEntryPoint(entryPoint string, manifest map[string]Record) []template.HTML {
	entry := manifest[entryPoint]
	var links []template.HTML
	for _, css := range entry.Css {
		links = append(links, template.HTML(fmt.Sprintf("<link rel=\"stylesheet\" href=\"/%s\" />", css)))
	}

	children := getChildren(entryPoint, manifest)
	for _, childName := range children {
		for _, childCss := range manifest[childName].Css {
			links = append(links, template.HTML(fmt.Sprintf("<link rel=\"stylesheet\" href=\"/%s\" />", childCss)))
		}
	}

	isJS, err := checkFiletype(entry.File)
	if err != nil {
		log.Fatal(err)
	}
	if isJS {
		links = append(links, template.HTML(fmt.Sprintf("<script type=\"module\" src=\"/%s\"></script>", entry.File)))
	} else {
		links = append(links, template.HTML(fmt.Sprintf("<link rel=\"stylesheet\" href=\"/%s\" />", entry.File)))
	}

	for _, childName := range children {
		links = append(links, template.HTML(fmt.Sprintf("<link rel=\"modulepreload\" href=\"/%s\" />", manifest[childName].File)))
	}
	return links
}

func getChildren(name string, manifest map[string]Record) []string {
	var children []string
	fetching := true
	inquiry := []string{name}
	for fetching {
		var newChildren []string
		for _, lookup := range inquiry {
			newChildren = append(newChildren, manifest[lookup].Imports...)
		}
		if len(newChildren) == 0 {
			fetching = false
		} else {
			children = append(children, newChildren...)
			inquiry = newChildren
		}
	}
	return children
}

func checkFiletype(name string) (bool, error) {
	lastDot := strings.LastIndex(name, ".")
	if lastDot == -1 {
		return false, errors.New("No . in given filename")
	}
	subString := name[lastDot+1:]
	if subString == "js" {
		return true, nil
	} else if subString == "css" {
		return false, nil
	} else {
		return false, errors.New("Neither js nor css file passed in")
	}
}
