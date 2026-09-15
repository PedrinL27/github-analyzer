package com.pedrin.api_github_analyzer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pedrin.api_github_analyzer.client.GithubClient;
import com.pedrin.api_github_analyzer.client.exceptions.GithubUserNotFoundException;
import com.pedrin.api_github_analyzer.client.response.GithubFileResponse;
import com.pedrin.api_github_analyzer.client.response.GithubLanguagesResponse;
import com.pedrin.api_github_analyzer.client.response.GithubRepoResponse;
import com.pedrin.api_github_analyzer.client.response.GithubUserResponse;
import feign.FeignException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GithubService {

    private final Map<String, String> cache = new HashMap<>();

    private final GithubClient client;


    @Value("classpath:mockups/default-analyses.json")
    private Resource mockupResource;

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

    public String checkMockup(String username){
        return cache.get(username);
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

    @PostConstruct
    public void loadCache() throws IOException {
        String json = StreamUtils.copyToString(mockupResource.getInputStream(), StandardCharsets.UTF_8);
        // Parse e guarda username -> JSON da resposta
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(json);
        root.fields().forEachRemaining(entry ->
                cache.put(entry.getKey(), entry.getValue().toString())
        );
    }
}
