package com.pedrin.api_github_analyzer.client.response;

import java.util.Map;

public record GithubLanguagesResponse(
        String name,
        String html_url,
        String description,
        Map<String, Integer> languages,
        Integer popularityScore,
        Double activityScore
) {
}
