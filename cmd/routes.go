package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/go-chi/chi"
)

func DevRoutes(router *chi.Mux) {
	fileServer := http.FileServer(http.Dir(filepath.Join(serverConfig.Root, "src")))
	router.Handle("/src/*", http.StripPrefix("/src/", fileServer))
	nodeModulesFileServer := http.FileServer(http.Dir(filepath.Join(serverConfig.Root, "node_modules")))
	router.Get("/node_modules/*", func(writer http.ResponseWriter, request *http.Request) {
		request.URL.RawQuery = ""
		handler := http.StripPrefix("/node_modules/", nodeModulesFileServer)
		handler.ServeHTTP(writer, request)
	})
	AdditionalRoutes(router)
}

func ProdRoutes(router *chi.Mux) {
	publicFileServer := http.FileServer(http.Dir(filepath.Join(serverConfig.Root, "dist/")))
	router.Handle("/public/*", http.StripPrefix("/public/", publicFileServer))
	assetsFileServer := http.FileServer(http.Dir(filepath.Join(serverConfig.Root, "dist/assets")))
	router.Handle("/assets/*", http.StripPrefix("/assets/", assetsFileServer))
	AdditionalRoutes(router)
}

func AdditionalRoutes(router *chi.Mux) {
	router.Get("/s3/*", func(writer http.ResponseWriter, request *http.Request) {
		key := request.URL.Path[len("/s3/"):]

		var redirectURL string
		temp, ok := memoryCache.Get(fmt.Sprintf("s3-%s", key))
		if ok {
			redirectURL = temp.(string)
			log.Print("Reusing presigned s3 link")
		} else {
			redirectURL = presignS3Link(key)
			memoryCache.Set(fmt.Sprintf("s3-%s", key), redirectURL)
		}
		h := http.RedirectHandler(redirectURL, http.StatusFound)
		h.ServeHTTP(writer, request)
	})

	router.Get("/*", func(writer http.ResponseWriter, request *http.Request) {
		var chunks map[string]Record

		manifestFile, err := os.ReadFile(filepath.Join(serverConfig.Root, "dist/.vite/manifest.json"))
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
			Deploy: serverConfig.DeployEnv,
			Links:  allLinks,
		}
		indexTemplate, _ := template.ParseFiles(filepath.Join(serverConfig.Root, "index.html"))
		err = indexTemplate.Execute(writer, data)
		if err != nil {
			log.Fatal(err)
		}
	})
}
