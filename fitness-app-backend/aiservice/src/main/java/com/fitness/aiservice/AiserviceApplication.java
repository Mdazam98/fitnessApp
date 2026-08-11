package com.fitness.aiservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
public class AiserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiserviceApplication.class, args);
	}

	@Bean
	public WebClient.Builder webClientBuilder() {
		reactor.netty.http.client.HttpClient httpClient = reactor.netty.http.client.HttpClient.newConnection()
				.resolver(io.netty.resolver.DefaultAddressResolverGroup.INSTANCE);
		return WebClient.builder()
				.clientConnector(new org.springframework.http.client.reactive.ReactorClientHttpConnector(httpClient));
	}


}
