package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func presignS3Link(key string) string {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatal(err)
	}

	bucket := os.Getenv("S3_BUCKET")
	client := s3.NewFromConfig(cfg)
	presignClient := s3.NewPresignClient(client)

	presignOptions := func(o *s3.PresignOptions) {
		o.Expires = 3 * time.Hour
	}
	req, err := presignClient.PresignGetObject(context.TODO(),
		&s3.GetObjectInput{
			Bucket: aws.String(bucket),
			Key:    aws.String(key),
		},
		presignOptions)
	if err != nil {
		log.Fatal(err)
	}
	return req.URL
}
