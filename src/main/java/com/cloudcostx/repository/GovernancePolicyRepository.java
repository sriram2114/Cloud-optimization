package com.cloudcostx.repository;

import com.cloudcostx.entity.GovernancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GovernancePolicyRepository extends JpaRepository<GovernancePolicy, String> {
}
