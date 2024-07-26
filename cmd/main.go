package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-co-op/gocron/v2"
	"istio.io/pkg/cache"
)

const defaultPort string = "3000"
const defaultEnv string = "DEVELOPMENT"
const defaultRoot string = "./web/"
const defaultThemeRoot string = "./web/themes"

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

type Config struct {
	Port      string
	DeployEnv string
	Root      string
	ThemeRoot string
}

var serverConfig Config

var memoryCache cache.ExpiringCache

func setServerConfigs() Config {
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

	themeRoot := os.Getenv("THEME_ROOT")
	if themeRoot == "" {
		themeRoot = defaultThemeRoot
	}

	return Config{
		Port:      port,
		Root:      root,
		DeployEnv: deployEnv,
		ThemeRoot: themeRoot,
	}
}

func main() {
	serverConfig = setServerConfigs()

	memoryCache = cache.NewTTL(4*time.Minute,
		5*time.Second)

	router := chi.NewRouter()
	router.Use(middleware.Logger)
	if serverConfig.DeployEnv == "PRODUCTION" {
		ProdRoutes(router)
	} else {
		DevRoutes(router)
	}

	updateS3Link()
	s, err := gocron.NewScheduler()
	if err != nil {
		log.Fatal(err)
	}

	_, err = s.NewJob(
		gocron.DurationJob(2*time.Hour),
		gocron.NewTask(updateS3Link),
	)
	if err != nil {
		log.Fatal(err)
	}
	s.Start()
	log.Print("Starting server")
	http.ListenAndServe(fmt.Sprintf(":%s", serverConfig.Port), router)
}

func updateS3Link() {
	key := "tmoss/resume.pdf"
	memoryCache.Set(fmt.Sprintf("s3-%s", key), presignS3Link(key))
}
