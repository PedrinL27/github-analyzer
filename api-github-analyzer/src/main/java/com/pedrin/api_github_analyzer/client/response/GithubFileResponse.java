package com.pedrin.api_github_analyzer.client.response;

public record GithubFileResponse(
        String name,
        String type,
        Long size) {
}
