.PHONY: build
build:
	go build -o bin/webserver cmd/main.go

webserver:
	cd web; npm run build

clean:
	rm -rf bin/webserver web/dist/*

all: build webserver
