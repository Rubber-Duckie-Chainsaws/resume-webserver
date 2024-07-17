package main

import (
	"errors"
	"fmt"
	"html/template"
	"log"
	"strings"
)

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
