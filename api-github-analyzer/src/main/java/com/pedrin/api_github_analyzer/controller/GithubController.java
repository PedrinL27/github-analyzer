package com.pedrin.api_github_analyzer.controller;

import com.pedrin.api_github_analyzer.client.exceptions.GithubUserNotFoundException;
import com.pedrin.api_github_analyzer.client.exceptions.dto.UserNotFoundExceptionDTO;
import com.pedrin.api_github_analyzer.client.response.GithubFileResponse;
import com.pedrin.api_github_analyzer.client.response.GithubLanguagesResponse;
import com.pedrin.api_github_analyzer.controller.prompts.GithubAnalysisPrompt;
import com.pedrin.api_github_analyzer.service.GithubService;
import com.pedrin.api_github_analyzer.tools.GithubTools;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/analyzer")
@RequiredArgsConstructor
@Slf4j
public class GithubController {

    private final GithubTools tools;
    private final GithubService service;
    private final GithubAnalysisPrompt analysisPrompt;
    private final ChatClient.Builder chatClientBuilder;

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@RequestParam String username){
        try {
            var dto = service.getUser(username);
            return ResponseEntity.ok(dto);
        } catch (GithubUserNotFoundException e) {
            return ResponseEntity.status(
                    HttpStatusCode.valueOf(e.getStatusCode()))
                    .body(new UserNotFoundExceptionDTO(
                            e.getMessage(),
                            e.getStatusCode()
                    ));
        }
    }

    @GetMapping("/repos")
    public ResponseEntity<List<GithubLanguagesResponse>> getRepos(@RequestParam String username){
        var dto = service.getRepos(username);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/content")
    public ResponseEntity<List<GithubFileResponse>> getContent(
            @RequestParam String username,
            @RequestParam String repo,
            @RequestParam(defaultValue = "") String path){
        return ResponseEntity.ok(service.getContent(username, repo, path));
    }

    @GetMapping(value = "/ai/{username}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> analyzeGithub(@PathVariable String username) {
        String mockup = service.checkMockup(username);
        if (mockup == null) {
            try {
                service.getUser(username);
            } catch (GithubUserNotFoundException e) {
                log.warn("GitHub user not found: {}", username);
                return ResponseEntity.status(HttpStatusCode.valueOf(e.getStatusCode()))
                        .body(new UserNotFoundExceptionDTO(e.getMessage(), e.getStatusCode()));
            }

            try {
                Prompt prompt = analysisPrompt.create(username);

                String response = chatClientBuilder.build()
                        .prompt(prompt)
                        .tools(tools)
                        .call()
                        .content();

                log.info(response);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                log.error("Error while analyzing GitHub user {}", username, e);
                return ResponseEntity.status(HttpStatusCode.valueOf(502))
                        .body(new UserNotFoundExceptionDTO(
                                "Failed to analyze user via AI: " + e.getMessage(),
                                502
                        ));
            }
        } else {
            try {
                TimeUnit.SECONDS.sleep(15); // So pra dar aquela impressao que ta fazendo algo importante
                return ResponseEntity.ok(mockup);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return ResponseEntity.badRequest().build();
            }
        }
    }


}
