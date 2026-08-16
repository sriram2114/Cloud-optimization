package com.cloudcostx.service;

import com.cloudcostx.entity.OptimizationRecommendation;
import java.util.List;

public interface OptimizationEngine {
    List<OptimizationRecommendation> getActiveRecommendations();
    void runOptimizationScan(); // Scan DB resources and compile recommendations
    void applyRecommendation(String id);
    void dismissRecommendation(String id);
}
