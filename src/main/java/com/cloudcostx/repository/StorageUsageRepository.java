package com.cloudcostx.repository;

import com.cloudcostx.entity.StorageUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StorageUsageRepository extends JpaRepository<StorageUsage, String> {
}
