package com.cloudcostx.repository;

import com.cloudcostx.entity.CloudResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CloudResourceRepository extends JpaRepository<CloudResource, String>, JpaSpecificationExecutor<CloudResource> {
}
