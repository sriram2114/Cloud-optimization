package com.cloudcostx.repository;

import com.cloudcostx.entity.OptimizationRecommendation;
import com.cloudcostx.entity.RecommendationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OptimizationRecommendationRepository extends JpaRepository<OptimizationRecommendation, String> {
    List<OptimizationRecommendation> findByStatus(RecommendationStatus status);
}
