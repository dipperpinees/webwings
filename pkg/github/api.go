package github

import (
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/dipperpinees/ci/configs"
	"github.com/dipperpinees/ci/pkg/constant"
	_http "github.com/dipperpinees/ci/pkg/http"
)

type GithubUser struct {
	Login      string `json:"login"`
	ID         int32  `json:"id"`
	Node_id    string `json:"node_id"`
	Avatar_url string `json:"avatar_url"`
	Url        string `json:"url"`
	Html_url   string `json:"html_url"`
	Name       string `json:"name"`
	Email      string `json:"email"`
}

type TokenResponse struct {
	AccessToken string `json:"access_token"`
	Scope       string `json:"scope"`
	TokenType   string `json:"token_type"`
}

type RepositoryOwner struct {
	Login string `json:"login"`
}

type Repository struct {
	ID              int32           `json:"id"`
	Name            string          `json:"name"`
	FullName        string          `json:"full_name"`
	Private         bool            `json:"private"`
	HtmlUrl         string          `json:"html_url"`
	Description     string          `json:"description"`
	Url             string          `json:"url"`
	GitUrl          string          `json:"git_url"`
	SSHUrl          string          `json:"ssh_url"`
	CloneUrl        string          `json:"clone_url"`
	Language        string          `json:"language"`
	DefaultBranch   string          `json:"default_branch"`
	Archived        bool            `json:"archived"`
	StargazersCount int32           `json:"stargazers_count"`
	CreatedAt       string          `json:"created_at"`
	UpdatedAt       string          `json:"updated_at"`
	Owner           RepositoryOwner `json:"owner"`
}

type Branch struct {
	Name      string `json:"name"`
	Protected bool   `json:"protected"`
}

func GetAccessToken(code string) (string, error) {
	requestUrl := fmt.Sprintf(
		`%s?client_id=%s&client_secret=%s&code=%s`,
		constant.REQUEST_GITHUB_ACCESS_TOKEN_URL,
		configs.GetConfigs().GITHUB_OAUTH_CLIENT_ID,
		configs.GetConfigs().GITHUB_OAUTH_SECRET_KEY,
		code,
	)
	req, err := http.NewRequest("POST", requestUrl, nil)
	if err != nil {
		return "", err
	}
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()
	responseBody, err := io.ReadAll(response.Body)
	if err != nil {
		return "", err
	}
	queryParams, err := url.ParseQuery(string(responseBody))
	if err != nil {
		return "", err
	}
	return queryParams.Get("access_token"), nil
}

func GetUserData(accessToken string) (*GithubUser, error) {
	requestUrl := constant.GITHUB_REST_API_ENDPOINT + "/user"
	header := map[string]string{
		"Accept":        "application/vnd.github+json",
		"Authorization": "Bearer " + accessToken,
	}

	body, err := _http.Request[GithubUser](requestUrl, &_http.RequestOptions{Method: "GET", Headers: &header})
	return body, err
}

func GetUserRepositories(accessToken string) (*[]Repository, error) {
	requestUrl := constant.GITHUB_REST_API_ENDPOINT + "/user/repos?sort=updated"
	header := map[string]string{
		"Accept":        "application/json",
		"Authorization": "Bearer " + accessToken,
	}

	body, err := _http.Request[[]Repository](requestUrl, &_http.RequestOptions{Method: "GET", Headers: &header})
	return body, err
}

func GetBranchesList(accessToken string, username string, repo string) (*[]Branch, error) {
	requestUrl := fmt.Sprintf("%s/repos/%s/%s/branches", constant.GITHUB_REST_API_ENDPOINT, username, repo)
	header := map[string]string{
		"Accept":        "application/json",
		"Authorization": "Bearer " + accessToken,
	}

	body, err := _http.Request[[]Branch](requestUrl, &_http.RequestOptions{Method: "GET", Headers: &header})
	return body, err
}
