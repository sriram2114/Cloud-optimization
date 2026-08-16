package com.cloudcostx.repository;

import com.cloudcostx.entity.PolicyViolation;
import com.cloudcostx.entity.ViolationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PolicyViolationRepository extends JpaRepository<PolicyViolation, String> {
    List<PolicyViolation> findByStatus(ViolationStatus status);
    boolean existsByPolicyIdAndResourceIdAndStatus(String policyId, String resourceId, ViolationStatus status);
}
