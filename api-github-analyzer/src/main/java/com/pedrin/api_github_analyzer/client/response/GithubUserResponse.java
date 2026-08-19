package com.pedrin.api_github_analyzer.client.response;

public record GithubUserResponse(
        String login,
        String avatar_url,
        String name,
        String email,
        String bio
) {
}
