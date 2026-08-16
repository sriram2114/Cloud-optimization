package com.cloudcostx.repository;

import com.cloudcostx.entity.CloudAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CloudAccountRepository extends JpaRepository<CloudAccount, String> {
}
