package com.pedrin.api_github_analyzer.client.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;


public record GithubRepoResponse(
    String name,
    String html_url,
    String description,
    @JsonProperty("forks_count")
    Integer forksCount,
    @JsonProperty("stargazers_count")
    Integer stargazersCount,
    @JsonProperty("watchers_count")
    Integer watchersCount,
    @JsonProperty("pushed_at")
    LocalDateTime pushedAt,
    @JsonProperty("updated_at")
    LocalDateTime updatedAt
) {
}
