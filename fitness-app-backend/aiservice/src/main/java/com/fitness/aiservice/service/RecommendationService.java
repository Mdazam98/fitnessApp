package com.fitness.aiservice.service;


import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;

    public List<Recommendation> getUserRecommendation(String userId) {

        return recommendationRepository.findByUserId(userId);
    }

    public java.util.Optional<Recommendation> getActivityRecommendation(String activityId) {
        return recommendationRepository.findByActivityId(activityId);
    }

    public void deleteRecommendationByActivityId(String activityId) {
        recommendationRepository.findByActivityId(activityId)
                .ifPresent(recommendationRepository::delete);
    }
}
