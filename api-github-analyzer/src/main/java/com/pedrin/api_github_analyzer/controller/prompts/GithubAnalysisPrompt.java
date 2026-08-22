package com.pedrin.api_github_analyzer.controller.prompts;

import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class GithubAnalysisPrompt {

    private final PromptTemplate template;

    public GithubAnalysisPrompt(
            @Value("classpath:prompts/github-analysis-prompt.txt")
            Resource resource) {
        this.template = new PromptTemplate(resource);
    }

    public Prompt create(String username) {
        return template.create(Map.of(
                "username", username
        ));
    }
}
