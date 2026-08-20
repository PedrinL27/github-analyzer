package com.pedrin.api_github_analyzer.client.response;

import lombok.NonNull;

import java.util.Map;

public record GithubRepoResponse(
    String name,
    String html_url,
    String description,
    Integer forks_count,
    Integer stargazers_count,
    Integer watchers_count
) {
}
