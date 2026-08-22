package com.pedrin.api_github_analyzer.tools;

import com.pedrin.api_github_analyzer.client.response.GithubFileResponse;
import com.pedrin.api_github_analyzer.client.response.GithubLanguagesResponse;
import com.pedrin.api_github_analyzer.client.response.GithubUserResponse;
import com.pedrin.api_github_analyzer.service.GithubService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class GithubTools {

    private final GithubService githubService;

    @Tool(description = """
            Retorna informações públicas do perfil de um usuário do GitHub.
            Use esta ferramenta para obter dados básicos do perfil antes de analisar seus repositórios.
            """)
    public GithubUserResponse getUser(String username) {
        log.info("Acessado a tool getUser do seguinte usuario: {}", username);
        return githubService.getUser(username);
    }

    @Tool(description = """
            Retorna os 10 repositórios mais relevantes de um usuário do GitHub.
            A relevância considera atividade e popularidade do repositório.
            Cada repositório contém nome, URL, descrição, linguagens utilizadas,
            popularity score e activity score.
            Use esta ferramenta primeiro para identificar quais projetos merecem uma análise mais profunda.
            """)
    public List<GithubLanguagesResponse> getRepositories(String username) {
        log.info("Acessado a tool getRepositories do seguinte usuario: {}", username);
        return githubService.getRepos(username);
    }

    @Tool(description = """
        Explora a estrutura de arquivos de um repositório público do GitHub.
        Use esta ferramenta para analisar a organização e os arquivos de um projeto
        que tenha sido identificado como relevante.

        O parâmetro 'path' define o diretório ou arquivo que será explorado.
        Utilize um caminho vazio para consultar a estrutura principal (raiz) do repositório.
        Para aprofundar a análise, utilize o caminho de um diretório retornado anteriormente.

        A ferramenta retorna informações sobre arquivos e diretórios, permitindo identificar
        elementos como README, arquivos de configuração, código-fonte, testes e outros recursos
        importantes para compreender a estrutura do projeto.
        """)
    public List<GithubFileResponse> getRepositoryContent(
            String username,
            String repository,
            String path
    ) {
        log.info("Acessado a tool getRepositoryContent do seguinte repository {} e no seguinte caminho {}", repository, path);
        return githubService.getContent(username, repository, path);
    }
}
