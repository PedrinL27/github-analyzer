package com.pedrin.api_github_analyzer.client.response;

import java.util.Map;

public record GithubRepoResponse(
    String name,
    String html_url,
    String description
) {
    public void languages(Map<String, Integer> map) {
    }
}
