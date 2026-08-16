package com.cloudcostx.repository;

import com.cloudcostx.entity.CostRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface CostRecordRepository extends JpaRepository<CostRecord, Long>, JpaSpecificationExecutor<CostRecord> {

    List<CostRecord> findByCostDateBetween(LocalDate startDate, LocalDate endDate);

    @Query(value = "SELECT provider as name, SUM(amount) as cost FROM cost_records GROUP BY provider", nativeQuery = true)
    List<CostAggregation> getCostByProvider();

    @Query(value = "SELECT service_name as name, SUM(amount) as cost FROM cost_records GROUP BY service_name", nativeQuery = true)
    List<CostAggregation> getCostByService();

    @Query(value = "SELECT department as name, SUM(amount) as cost FROM cost_records GROUP BY department", nativeQuery = true)
    List<CostAggregation> getCostByDepartment();

    @Query(value = "SELECT project as name, SUM(amount) as cost FROM cost_records GROUP BY project", nativeQuery = true)
    List<CostAggregation> getCostByProject();

    @Query(value = "SELECT DATE_FORMAT(cost_date, '%b') as name, SUM(amount) as cost FROM cost_records GROUP BY DATE_FORMAT(cost_date, '%b'), DATE_FORMAT(cost_date, '%Y-%m') ORDER BY DATE_FORMAT(cost_date, '%Y-%m') ASC", nativeQuery = true)
    List<CostAggregation> getMonthlyCostTrend();
}
