package com.pedrin.api_github_analyzer.service;

import com.pedrin.api_github_analyzer.client.GithubClient;
import com.pedrin.api_github_analyzer.client.response.GithubLanguagesResponse;
import com.pedrin.api_github_analyzer.client.response.GithubRepoResponse;
import com.pedrin.api_github_analyzer.client.response.GithubUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
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
        return client.getRepos(username, 20, "updated")
                .parallelStream()
                .sorted(Comparator.comparingInt(this::calculateScore).reversed())
                .limit(10)
                .map(repo -> new GithubLanguagesResponse(
                        repo.name(),
                        repo.html_url(),
                        repo.description(),
                        client.getLanguages(username, repo.name()),
                        calculateScore(repo)
                ))
                .toList();
    }


    private int calculateScore(GithubRepoResponse repo) {
        return repo.stargazers_count() * 5
                + repo.forks_count() * 3
                + repo.watchers_count();
    }
}
