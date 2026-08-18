package com.pedrin.api_github_analyzer.client.dto;

public record GithubListRepoDTO(
    String name,
    String html_url,
    String description,
    String language
) {
}
