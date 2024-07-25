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

	"github.com/go-chi/chi"
)

type Theme struct {
	Name        string
	Description string
	System      string
	Version     string
	Colors      map[string]string
}

type ThemeRequest struct {
	*Theme
}

func (tR *ThemeRequest) Bind(request *http.Request) error {
	log.Print(tR)
	if tR.Theme == nil {
		return errors.New("Missing theme")
	}

	tR.Theme.System = "false"
	return nil
}

//var ErrNotFound = &ErrResponse{HTTPStatusCode: 404, StatusText: "Resource not found."}

func ThemeCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		var theme Theme
		var err error

		if themeName := chi.URLParam(request, "theme"); themeName != "" {
			themeFile, err := os.ReadFile(filepath.Join(serverConfig.ThemeRoot, fmt.Sprintf("%s.json", themeName)))
			if err != nil {
				log.Print("Failed reading theme file", err)
				//render.Render(writer, request, ErrNotFound)
			}
			err = json.Unmarshal(themeFile, &theme)
			if err != nil {
				log.Print("Failed to unmarshal theme file", err)
			}
		} else {
			//render.Render(writer, request, ErrNotFound)
			return
		}
		if err != nil {
			//render.Render(w, r, ErrNotFound)
			return
		}

		ctx := context.WithValue(request.Context(), "theme", theme)
		next.ServeHTTP(writer, request.WithContext(ctx))
	})
}

func (t *Theme) save() error {
	filename := filepath.Join(serverConfig.ThemeRoot, t.Name+".json")
	byteArray, err := json.Marshal(t)
	if err != nil {
		log.Fatal("Unable to marshal data: ", err)
	}
	return os.WriteFile(filename, byteArray, 0600)
}

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
	RestRoutes(router)
}

func ProdRoutes(router *chi.Mux) {
	publicFileServer := http.FileServer(http.Dir(filepath.Join(serverConfig.Root, "dist/")))
	router.Handle("/public/*", http.StripPrefix("/public/", publicFileServer))
	assetsFileServer := http.FileServer(http.Dir(filepath.Join(serverConfig.Root, "dist/assets")))
	router.Handle("/assets/*", http.StripPrefix("/assets/", assetsFileServer))
	AdditionalRoutes(router)
	RestRoutes(router)
}

func RestRoutes(router *chi.Mux) {
	router.Route("/themes", func(r chi.Router) {
		r.Get("/", getThemes)
		r.Post("/", saveNewTheme)

		r.Route("/{theme}", func(r chi.Router) {
			r.Use(ThemeCtx)
			r.Get("/", getTheme)
			r.Put("/", updateTheme)
			r.Delete("/", deleteTheme)
		})
	})
	// REST: /themes
	// List, create, update, download or delete themes
	// /themes GET, POST
	// /themes/:id GET, PUT, DELETE

	// REST: /graphs
}

func getThemes(writer http.ResponseWriter, request *http.Request) {
	foundFiles, err := filepath.Glob(filepath.Join(serverConfig.ThemeRoot, "*.json"))
	if err != nil {
		log.Fatal("Error trying to glob themes directory: ", err)
	}
	var response []string
	for _, x := range foundFiles {
		shortened, err := filepath.Rel(serverConfig.ThemeRoot, x)
		if err != nil {
			log.Fatal("Error getting relative path: ", err)
		}
		response = append(response, shortened)
	}
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(response)
}

func getTheme(writer http.ResponseWriter, request *http.Request) {
	theme := request.Context().Value("theme").(Theme)
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(theme)
}

func updateTheme(writer http.ResponseWriter, request *http.Request) {
	theme := request.Context().Value("theme").(Theme)
	if theme.System == "true" {
		log.Print("Can't edit a system theme")
		writer.WriteHeader(http.StatusForbidden)
		fmt.Fprintf(writer, "Cannot edit a system theme")
	}

	var data Theme
	decoder := json.NewDecoder(request.Body)
	err := decoder.Decode(&data)
	if err != nil {
		log.Fatal(err)
	}
	theme.Colors = data.Colors
	theme.save()
	writer.WriteHeader(http.StatusOK)
	fmt.Fprintf(writer, "OK")
}

func deleteTheme(writer http.ResponseWriter, request *http.Request) {
	writer.WriteHeader(http.StatusNotImplemented)
	fmt.Fprintf(writer, "Not Implemented Yet")
}

func saveNewTheme(writer http.ResponseWriter, request *http.Request) {
	var data Theme
	decoder := json.NewDecoder(request.Body)
	err := decoder.Decode(&data)
	if err != nil {
		log.Fatal(err)
	}

	theme := data

	theme.System = "false"

	theme.save()
	writer.WriteHeader(http.StatusOK)
	fmt.Fprintf(writer, "OK")
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
			log.Fatal("Failed reading manifest.json: ", err)
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
