package com.pedrin.api_github_analyzer.client;

import com.pedrin.api_github_analyzer.client.response.GithubFileResponse;
import com.pedrin.api_github_analyzer.client.response.GithubRepoResponse;
import com.pedrin.api_github_analyzer.client.response.GithubUserResponse;
import com.pedrin.api_github_analyzer.config.GithubFeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@FeignClient(
        name = "github",
        url = "https://api.github.com",
        configuration = GithubFeignConfig.class
)
public interface GithubClient {

    @GetMapping("/users/{username}")
    GithubUserResponse getUser(
            @PathVariable String username
    );

    @GetMapping("/users/{username}/repos")
    List<GithubRepoResponse> getRepos(
            @PathVariable String username,
            @RequestParam("per_page") int perPage,
            @RequestParam("sort") String sort
    );

    @GetMapping("/repos/{username}/{repo}/languages")
    Map<String, Integer> getLanguages(
            @PathVariable String username,
            @PathVariable String repo
    );

    @GetMapping("/repos/{username}/{repo}/contents/{path}")
    List<GithubFileResponse> getContents(
            @PathVariable String username,
            @PathVariable String repo,
            @PathVariable String path
    );

}
