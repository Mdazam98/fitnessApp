package com.fitness.aiservice.service;


import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityAIService aiService;
    private final RecommendationRepository recommendationRepository;

    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void processActivity(Activity activity){

        log.info("Received activity for processing: {}",activity.getId());
        try {
            //log.info("Generated Recomendation: {}",aiService.generateRecomendation(activity));
            Recommendation recommendation= aiService.generateRecomendation(activity);

            recommendationRepository.save(recommendation);

        } catch (Exception e) {
            log.error("Error processing activity recommendation for {}:", activity.getId(), e.getMessage(), e);
        }
    }

}
