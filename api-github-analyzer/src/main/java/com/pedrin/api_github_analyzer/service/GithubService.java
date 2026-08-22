package com.pedrin.api_github_analyzer.service;

import com.pedrin.api_github_analyzer.client.GithubClient;
import com.pedrin.api_github_analyzer.client.exceptions.GithubUserNotFoundException;
import com.pedrin.api_github_analyzer.client.response.GithubFileResponse;
import com.pedrin.api_github_analyzer.client.response.GithubLanguagesResponse;
import com.pedrin.api_github_analyzer.client.response.GithubRepoResponse;
import com.pedrin.api_github_analyzer.client.response.GithubUserResponse;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GithubService {

    private final GithubClient client;

    public GithubUserResponse getUser(String username){
        try {
            return client.getUser(username);
        } catch (FeignException.NotFound e) {
            throw new GithubUserNotFoundException(username, e.status());
        }

    }

    public List<GithubLanguagesResponse> getRepos(String username) {
        return client.getRepos(username, 20, "updated")
                .parallelStream()
                .sorted(Comparator.comparingDouble(this::getOverallScore).reversed())
                .limit(10)
                .map(repo -> new GithubLanguagesResponse(
                        repo.name(),
                        repo.html_url(),
                        repo.description(),
                        client.getLanguages(username, repo.name()),
                        getPopularityScore(repo),
                        getActivityScore(repo)
                ))
                .toList();
    }

    public List<GithubFileResponse> getContent(String username, String repo, String path){
        return client.getContents(username, repo, path);
    }


    private int getPopularityScore(GithubRepoResponse repo) {
        return repo.stargazersCount() * 5
                + repo.forksCount() * 3
                + repo.watchersCount();
    }

    private double getActivityScore(GithubRepoResponse repo) {

        long pushedDays = ChronoUnit.DAYS.between(
                repo.pushedAt().toLocalDate(),
                LocalDate.now()
        );

        long updatedDays = ChronoUnit.DAYS.between(
                repo.updatedAt().toLocalDate(),
                LocalDate.now()
        );
        double pushedScore = 10.0 * Math.exp(-pushedDays / 180.0);
        double updatedScore = 10.0 * Math.exp(-updatedDays / 180.0);
        return Math.round((pushedScore * 0.4 + updatedScore * 0.6) * 100.0) / 100.0;
    }

    private double getOverallScore(GithubRepoResponse repo) {
        return getActivityScore(repo) + getPopularityScore(repo);
    }
}
