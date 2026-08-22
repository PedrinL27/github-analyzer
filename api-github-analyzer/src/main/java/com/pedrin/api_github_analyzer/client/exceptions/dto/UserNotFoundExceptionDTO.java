package com.pedrin.api_github_analyzer.client.exceptions.dto;

public record UserNotFoundExceptionDTO(
        String message,
        int statusCode
) {
}
