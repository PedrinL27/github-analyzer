package com.pedrin.api_github_analyzer.config;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class GithubFeignConfig {

    @Value("${github.api.token}")
    private String token;

    @Bean
    public RequestInterceptor githubRequestInterceptor() {
        return requestTemplate -> {
            requestTemplate.header(
                    "Authorization",
                    "Bearer " + token
            );

            requestTemplate.header(
                    "Accept",
                    "application/vnd.github+json"
            );
        };
    }
}
