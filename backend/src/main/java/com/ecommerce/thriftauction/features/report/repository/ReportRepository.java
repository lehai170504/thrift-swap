package com.ecommerce.thriftauction.features.report.repository;

import com.ecommerce.thriftauction.features.report.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, String> {
    Optional<Report> findByReporterIdAndReportedProductId(String reporterId, String reportedProductId);
}
