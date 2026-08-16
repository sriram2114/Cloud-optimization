package com.cloudcostx.repository;

import com.cloudcostx.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByReadFalseOrderByCreatedAtDesc();
    List<Notification> findByOrderByCreatedAtDesc();
}
