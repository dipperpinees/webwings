package google

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type GoogleProfile struct {
	Name    string `json:"name"`
	Picture string `json:"picture"`
	Email   string `json:"email"`
}

func GetUser(accessToken string) (GoogleProfile, error) {
	urlRequest := fmt.Sprintf("https://www.googleapis.com/oauth2/v3/userinfo?access_token=%s", accessToken)
	resp, err := http.Get(urlRequest)
	profile := GoogleProfile{}

	if err != nil {
		return profile, err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return profile, err
	}

	err = json.Unmarshal([]byte(string(body)), &profile)
	if err != nil {
		return profile, err
	}
	return profile, err
}
