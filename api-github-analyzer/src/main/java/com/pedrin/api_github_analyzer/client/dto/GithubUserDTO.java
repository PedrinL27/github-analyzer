package com.pedrin.api_github_analyzer.client.dto;

public record GithubUserDTO(
        String login,
        String avatar_url,
        String name,
        String email,
        String bio
) {
}
