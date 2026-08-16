package com.cloudcostx.repository;

import com.cloudcostx.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByIsReadFalseOrderByCreatedAtDesc();
    List<Alert> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Alert> findByOrderByCreatedAtDesc();
}
