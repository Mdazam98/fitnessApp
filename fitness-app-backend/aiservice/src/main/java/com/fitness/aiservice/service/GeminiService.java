package com.fitness.aiservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApikey;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String getAnswer(String question) {
        // Corrected the payload structure to match Gemini API requirements
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", question) // Must be "text", not "question"
                        })
                }
        );

        return webClient.post()
                // Make sure your geminiApiUrl property ends with "?key=" so this concatenation works!
                .uri(geminiApiUrl + geminiApikey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .retryWhen(reactor.util.retry.Retry.backoff(3, java.time.Duration.ofSeconds(1))
                        .filter(throwable -> {
                            if (throwable instanceof org.springframework.web.reactive.function.client.WebClientResponseException) {
                                org.springframework.web.reactive.function.client.WebClientResponseException we =
                                        (org.springframework.web.reactive.function.client.WebClientResponseException) throwable;
                                int status = we.getStatusCode().value();
                                return status == 503 || status == 504 || status == 429;
                            }
                            return throwable instanceof java.io.IOException;
                        }))
                .block();
    }
}