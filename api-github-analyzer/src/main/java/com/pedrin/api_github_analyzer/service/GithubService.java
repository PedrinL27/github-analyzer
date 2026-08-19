package com.pedrin.api_github_analyzer.service;

import com.pedrin.api_github_analyzer.client.GithubClient;
import com.pedrin.api_github_analyzer.client.response.GithubLanguagesResponse;
import com.pedrin.api_github_analyzer.client.response.GithubUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GithubService {

    private final GithubClient client;

    public GithubUserResponse getUser(String username){
        return client.getUser(username);
    }

    public List<GithubLanguagesResponse> getRepos(String username) {
        return client.getRepos(username, 10, "updated")
                .parallelStream()
                .map(repo -> new GithubLanguagesResponse(
                        repo.name(),
                        repo.html_url(),
                        repo.description(),
                        client.getLanguages(username, repo.name())
                ))
                .toList();
    }

    public Map<String, Integer> getLanguages(
            String username,
            String repo
    ) {
        return client.getLanguages(username, repo);
    }
}
