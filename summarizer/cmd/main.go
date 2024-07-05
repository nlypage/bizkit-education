package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

var (
	MaxLimit     = 8192 // Telegram one message character limit
	ENDPOINT     = "https://300.ya.ru/api/generation"
	MaxRetries   = 100
	YandexOauth  = "YANDEX_OAUTH"
	YandexCookie = "YANDEX_COOKIE"
)

type MessageBuffer struct {
	Messages []string
	Current  *int
}

func NewMessageBuffer() *MessageBuffer {
	return &MessageBuffer{Messages: []string{""}, Current: nil}
}

type Summarize300Client struct {
	Headers map[string]string
	Buffer  *MessageBuffer
}

func NewSummarize300Client(yandexOauthToken, yandexCookie string) *Summarize300Client {
	headers := map[string]string{
		"Authorization":   "OAuth " + yandexOauthToken,
		"Cookie":          yandexCookie,
		"Content-Type":    "application/json",
		"User-Agent":      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.967 YaBrowser/23.9.1.967 Yowser/2.5 Safari/537.36",
		"Referer":         "https://300.ya.ru/summary",
		"Origin":          "https://300.ya.ru",
		"Pragma":          "no-cache",
		"Cache-Control":   "no-cache",
		"Accept":          "*/*",
		"Accept-Encoding": "gzip, deflate, br",
		"Accept-Language": "en,ru;q=0.9,tr;q=0.8",
	}
	return &Summarize300Client{Headers: headers, Buffer: NewMessageBuffer()}
}

func (mb *MessageBuffer) Add(message string) {
	if mb.Current == nil {
		mb.Current = new(int)
	}
	if len(mb.Messages[*mb.Current])+len(message) > MaxLimit {
		mb.Messages = append(mb.Messages, "")
		*mb.Current++
	}
	mb.Messages[*mb.Current] += message
}

func (client *Summarize300Client) sendRequest(jsonPayload map[string]interface{}) (*http.Response, error) {
	jsonData, err := json.Marshal(jsonPayload)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequest("POST", ENDPOINT, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	for key, value := range client.Headers {
		req.Header.Set(key, value)
	}

	httpClient := &http.Client{}

	return httpClient.Do(req)
}

func (client *Summarize300Client) parseArticleSummarizationJson(url string, data map[string]interface{}) error {
	thesis, ok := data["thesis"]
	if !ok {
		return fmt.Errorf("%s: there's no 'thesis' in response body", url)
	}
	client.Buffer.Add(fmt.Sprintf("%s\n\n", data["title"]))
	for _, keypoint := range thesis.([]interface{}) {
		point := keypoint.(map[string]interface{})
		client.Buffer.Add(fmt.Sprintf("\t• %s", point["content"]))
		if link, ok := point["link"]; ok {
			client.Buffer.Add(fmt.Sprintf("<a href=\"%s\">Link</a>", link))
		}
		client.Buffer.Add("\n")
	}
	client.Buffer.Add("\n")
	return nil
}

func (client *Summarize300Client) parseVideoSummarizationJson(url string, data map[string]interface{}) error {
	if errorCode, ok := data["error_code"]; ok {
		msg := fmt.Sprintf("%s is not supported, Yandex API returned error_code %v", url, errorCode)
		log.Println(msg)
		client.Buffer.Add(msg)
		return nil
	}
	keypoints, ok := data["keypoints"]
	if !ok {
		return fmt.Errorf("%s: there's no 'keypoints' in response", url)
	}
	client.Buffer.Add(fmt.Sprintf("%s\n", data["title"]))
	for _, keypoint := range keypoints.([]interface{}) {
		point := keypoint.(map[string]interface{})
		startTime := point["start_time"].(float64)
		client.Buffer.Add(fmt.Sprintf("<a href=\"%s&t=%f\">%02d:%02d:%02d</a> %s\n", url, startTime, int(startTime)/3600, int(startTime)%3600/60, int(startTime)%60, point["content"]))
		for _, thesis := range point["theses"].([]interface{}) {
			client.Buffer.Add(fmt.Sprintf("\t• %s\n", thesis.(map[string]interface{})["content"]))
		}
		client.Buffer.Add("\n")
	}
	return nil
}

func (client *Summarize300Client) parseTextSummarizationJson(url string, data map[string]interface{}) error {
	thesis, ok := data["thesis"]
	if !ok {
		return fmt.Errorf("%s: there's no 'thesis' in response body", url)
	}
	client.Buffer.Add(fmt.Sprintf("%s\n\n", data["title"]))
	for _, keypoint := range thesis.([]interface{}) {
		point := keypoint.(map[string]interface{})
		client.Buffer.Add(fmt.Sprintf("\t• %s", point["content"]))
	}
	client.Buffer.Add("\n")
	return nil
}

func (client *Summarize300Client) SummarizeUrl(url string) (*MessageBuffer, error) {
	jsonPayload := make(map[string]interface{})
	var parseSelector func(string, map[string]interface{}) error

	if strings.Contains(url, "youtu") {
		jsonPayload["video_url"] = url
		parseSelector = client.parseVideoSummarizationJson
	} else {
		jsonPayload["article_url"] = url
		parseSelector = client.parseArticleSummarizationJson
	}

	if len(url) > 300 {
		jsonPayload["text"] = url
		parseSelector = client.parseTextSummarizationJson
	}

	counter := 0
	var (
		statusCode   int
		responseJson map[string]interface{}
	)
	for (statusCode != 0 && statusCode != 2) && counter < MaxRetries {
		counter++
		response, err := client.sendRequest(jsonPayload)
		if err != nil {
			return nil, err
		}
		defer response.Body.Close()
		body, err := io.ReadAll(response.Body)
		if err != nil {
			return nil, err
		}

		err = json.Unmarshal(body, &responseJson)
		if err != nil {
			return nil, err
		}

		log.Println(responseJson)

		if sc, ok := responseJson["status_code"]; ok {
			statusCode = int(sc.(float64))
		} else {
			log.Printf("%s backend error: %v", url, responseJson)
			client.Buffer.Add("Yandex API is not available, try again later")
			return client.Buffer, nil
		}

		if statusCode >= 3 {
			log.Printf("%s returned status_code > 2", url)
			client.Buffer.Add(fmt.Sprintf("Yandex API returned status_code %d when processing %s, the link is not supported by Yandex backend", statusCode, url))
			return client.Buffer, nil
		}

		if pollIntervalMs, ok := responseJson["poll_interval_ms"]; ok {
			time.Sleep(time.Duration(pollIntervalMs.(float64)) * time.Millisecond)
		}

		if sessionId, ok := responseJson["session_id"]; ok {
			jsonPayload["session_id"] = sessionId
		}
	}

	err := parseSelector(url, responseJson)
	if err != nil {
		return nil, err
	}

	return client.Buffer, nil
}

func main() {
	fiberApp := fiber.New()

	fiberApp.Post("/generate", func(c *fiber.Ctx) error {
		var data map[string]interface{}

		if err := c.BodyParser(&data); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status": false,
				"body":   err.Error(),
			})
		}

		url, ok := data["content"].(string)
		if !ok {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status": false,
				"body":   "Invalid content",
			})
		}

		urls := strings.Split(url, " ")
		if len(url) <= 300 {
			urls = []string{url}
		}

		for _, match := range urls[:1] {
			log.Printf("Processing URL: %s", match)
			summarizer := NewSummarize300Client(os.Getenv(YandexOauth), os.Getenv(YandexCookie))
			buffer, err := summarizer.SummarizeUrl(match)
			if err != nil {
				log.Printf("500 Internal server error: %v", err)
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"status": false,
					"body":   err.Error(),
				})
			}

			for _, message := range buffer.Messages {
				log.Printf("Will be sending to len %d: %s", len(message), message)
			}

			return c.Status(fiber.StatusOK).JSON(fiber.Map{
				"status": true,
				"body":   buffer.Messages[0],
			})
		}
		return nil
	})

	if err := fiberApp.ListenTLS(":5000", "fullchain.pem", "privkey.pem"); err != nil {
		panic(err)
	}
}
