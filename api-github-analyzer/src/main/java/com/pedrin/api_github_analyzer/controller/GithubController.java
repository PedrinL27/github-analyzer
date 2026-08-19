package com.pedrin.api_github_analyzer.controller;

import com.pedrin.api_github_analyzer.client.response.GithubLanguagesResponse;
import com.pedrin.api_github_analyzer.client.response.GithubUserResponse;
import com.pedrin.api_github_analyzer.service.GithubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/analyzer")
@RequiredArgsConstructor
public class GithubController {

    private final GithubService service;

    @GetMapping("/user")
    public ResponseEntity<GithubUserResponse> getUser(@RequestParam String username){
        var dto = service.getUser(username);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/repos")
    public ResponseEntity<List<GithubLanguagesResponse>> getRepos(@RequestParam String username){
        var dto = service.getRepos(username);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/repos/languages")
    public ResponseEntity<Map<String, Integer>> getLanguages(
            @RequestParam String username,
            @RequestParam String repo){
        var response = service.getLanguages(username, repo);
        return ResponseEntity.ok(response);
    }

}
