package com.cloudcostx.repository;

import com.cloudcostx.entity.CostTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CostTagRepository extends JpaRepository<CostTag, Long> {
    List<CostTag> findByResourceId(String resourceId);
}
