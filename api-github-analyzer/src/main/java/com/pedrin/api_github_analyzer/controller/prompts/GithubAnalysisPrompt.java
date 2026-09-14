package com.pedrin.api_github_analyzer.controller.prompts;

import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class GithubAnalysisPrompt {

    private final String template;

    public GithubAnalysisPrompt(
            @Value("classpath:prompts/github-analysis-prompt.txt")
            Resource resource) throws IOException {

        this.template = new String(
                resource.getInputStream().readAllBytes(),
                StandardCharsets.UTF_8
        );
    }

    public Prompt create(String username) {

        String prompt = template.replace(
                "{username}",
                username
        );

        return new Prompt(prompt);
    }
}
