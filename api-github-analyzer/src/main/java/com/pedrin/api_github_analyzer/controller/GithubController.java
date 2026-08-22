package com.pedrin.api_github_analyzer.controller;

import com.pedrin.api_github_analyzer.client.response.GithubFileResponse;
import com.pedrin.api_github_analyzer.client.response.GithubLanguagesResponse;
import com.pedrin.api_github_analyzer.client.response.GithubUserResponse;
import com.pedrin.api_github_analyzer.service.GithubService;
import com.pedrin.api_github_analyzer.tools.GithubTools;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/analyzer")
@RequiredArgsConstructor
public class GithubController {

    private final GithubTools tools;
    private final GithubService service;
    private final ChatModel chatModel;

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

    @GetMapping("/content")
    public ResponseEntity<List<GithubFileResponse>> getContent(
            @RequestParam String username,
            @RequestParam String repo,
            @RequestParam(defaultValue = "") String path){
        return ResponseEntity.ok(service.getContent(username, repo, path));
    }

    @GetMapping("/ai/{username}")
    String analyzeGithub(@PathVariable String username) {

        PromptTemplate template = new PromptTemplate("""
        Analise o perfil do GitHub do usuário {username}.

        Utilize as ferramentas disponíveis para coletar informações sobre o perfil
        e seus 10 repositórios mais relevantes.

        Analise o perfil considerando:
        - As principais linguagens de programação e tecnologias utilizadas.
        - O Activity Score dos repositórios.
        - O Popularity Score dos repositórios.
        - As descrições e objetivos dos projetos.
        - A organização e estrutura dos repositórios mais relevantes.
        - Evidências de evolução técnica e consistência.
        - Pontos fortes e possíveis pontos de desenvolvimento.

        Considere as seguintes regras:

        - Um Popularity Score baixo NÃO significa baixa capacidade técnica.
        - Desenvolvedores iniciantes naturalmente podem possuir poucos stars,
          forks e seguidores.
        - Activity Score e Popularity Score representam características diferentes
          e devem ser analisados separadamente.
        - Não invente informações que não estejam disponíveis através das ferramentas.
        - Diferencie fatos observáveis de interpretações.
        - Não avalie a capacidade profissional de uma pessoa somente pela quantidade
          de repositórios, stars ou seguidores.
        - Quando um repositório parecer particularmente relevante, utilize a
          ferramenta de exploração de arquivos para investigar sua estrutura.
        - Comece a exploração pela raiz do repositório e aprofunde a análise somente
          quando encontrar arquivos ou diretórios relevantes.
        - Considere o possível estágio de carreira do desenvolvedor ao interpretar
          os resultados.
        - Não compare injustamente um perfil iniciante com perfis de desenvolvedores
          muito mais experientes.

        Organize a análise da seguinte forma:

        ## Visão geral do perfil

        Apresente uma visão geral do perfil analisado.

        ## Principais tecnologias

        Identifique as principais linguagens, frameworks e tecnologias encontradas.

        ## Projetos relevantes

        Identifique os projetos que mais se destacam e explique por que são relevantes.

        ## Análise de atividade

        Analise o Activity Score e os sinais de atividade encontrados nos projetos.

        ## Análise de popularidade

        Analise o Popularity Score, deixando claro que popularidade não representa
        diretamente capacidade técnica.

        ## Perfil técnico

        Descreva o foco técnico aparente, os tipos de projetos desenvolvidos e
        possíveis sinais de evolução técnica.

        ## Pontos positivos

        Identifique características positivas com base nas evidências encontradas.

        ## Pontos de desenvolvimento

        Aponte possíveis áreas de desenvolvimento com base exclusivamente nas
        informações disponíveis.

        ## Conclusão
        Apresente uma conclusão equilibrada sobre o perfil.
        Utilize tabelas, listas e quebras de linha quando melhorarem a legibilidade.
        """);
        Prompt prompt = template.create(Map.of(
                "username", username
        ));

        return ChatClient.create(chatModel)
                .prompt(prompt)
                .tools(tools)
                .call()
                .content();
    }

}
