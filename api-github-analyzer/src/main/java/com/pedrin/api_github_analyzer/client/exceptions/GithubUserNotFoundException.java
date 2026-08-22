package com.pedrin.api_github_analyzer.client.exceptions;

import lombok.Getter;

@Getter
public class GithubUserNotFoundException extends RuntimeException {

  private final int statusCode;

  public GithubUserNotFoundException(String message, int statusCode) {
    super("Usuario do Github nao encontrado: " + message);
    this.statusCode = statusCode;
  }
}
