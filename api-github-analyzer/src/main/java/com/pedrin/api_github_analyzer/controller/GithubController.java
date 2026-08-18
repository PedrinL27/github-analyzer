package com.pedrin.api_github_analyzer.controller;

import com.pedrin.api_github_analyzer.client.dto.GithubUserDTO;
import com.pedrin.api_github_analyzer.service.GithubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analyzer")
@RequiredArgsConstructor
public class GithubController {

    private final GithubService service;

    @GetMapping("/user")
    public ResponseEntity<GithubUserDTO> getUser(@RequestParam String username){
        var dto = service.getUser(username);
        return ResponseEntity.ok(dto);
    }
}
