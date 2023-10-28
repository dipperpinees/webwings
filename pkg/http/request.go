package _http

import (
	"encoding/json"
	"io"
	"net/http"
)

type RequestOptions struct {
	Method  string
	Headers *map[string]string
	Body    string
}

func Request[T any](url string, options *RequestOptions) (*T, error) {
	req, err := http.NewRequest(options.Method, url, nil)
	if err != nil {
		return nil, err
	}
	if options.Headers != nil {
		for key, value := range *options.Headers {
			req.Header.Add(key, value)
		}
	}
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()
	responseBody, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}
	responseBodyData := new(T)
	if err := json.Unmarshal([]byte(responseBody), &responseBodyData); err != nil {
		return nil, err
	}
	return responseBodyData, nil
}
