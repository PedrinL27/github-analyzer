package com.pedrin.api_github_analyzer.client.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GithubUserResponse(
        String login,
        @JsonProperty("avatarUrl")
        String avatarUrl,
        String name,
        String email,
        String bio
) {
}
