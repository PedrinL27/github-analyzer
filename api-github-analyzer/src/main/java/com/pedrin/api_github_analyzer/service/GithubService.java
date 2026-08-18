package com.pedrin.api_github_analyzer.service;

import com.pedrin.api_github_analyzer.client.GithubClient;
import com.pedrin.api_github_analyzer.client.dto.GithubUserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GithubService {

    private final GithubClient client;

    public GithubUserDTO getUser(String username){
        return client.getUser(username);
    }
}
