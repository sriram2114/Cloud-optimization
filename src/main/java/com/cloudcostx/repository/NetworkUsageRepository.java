package com.cloudcostx.repository;

import com.cloudcostx.entity.NetworkUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NetworkUsageRepository extends JpaRepository<NetworkUsage, String> {
}
