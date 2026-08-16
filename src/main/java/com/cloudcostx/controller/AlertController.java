package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.entity.Alert;
import com.cloudcostx.exception.ResourceNotFoundException;
import com.cloudcostx.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    private AlertRepository alertRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Alert>>> getAlerts() {
        List<Alert> list = alertRepository.findByOrderByCreatedAtDesc();
        return ResponseEntity.ok(ApiResponse.success(list, "Alerts logs retrieved successfully"));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<ApiResponse<String>> markAsRead(@PathVariable Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert record not found with ID: " + id));

        alert.setIsRead(true);
        alertRepository.save(alert);

        return ResponseEntity.ok(ApiResponse.success("Alert marked as read", "Alert logs updated"));
    }
}
