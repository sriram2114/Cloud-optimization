package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.entity.Notification;
import com.cloudcostx.exception.ResourceNotFoundException;
import com.cloudcostx.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications() {
        List<Notification> list = notificationRepository.findByOrderByCreatedAtDesc();
        return ResponseEntity.ok(ApiResponse.success(list, "Notifications list retrieved"));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<ApiResponse<String>> markAsRead(@PathVariable String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + id));

        notification.setRead(true);
        notificationRepository.save(notification);

        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", "Notification updated"));
    }
}
