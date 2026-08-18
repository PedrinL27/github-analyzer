package com.pedrin.api_github_analyzer.client;

import com.pedrin.api_github_analyzer.client.dto.GithubListRepoDTO;
import com.pedrin.api_github_analyzer.client.dto.GithubUserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(
        name = "github",
        url = "https://api.github.com"
)
public interface GithubClient {

    @GetMapping("/users/{username}")
    GithubUserDTO getUser(
            @PathVariable String username
    );

    @GetMapping("/users/{username}/repos?per_page=10&sort=updated")
    List<GithubListRepoDTO> getRepos(
            @PathVariable String username
    );
}
