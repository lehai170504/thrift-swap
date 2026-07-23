package com.ecommerce.thriftauction.features.report.service;

import com.ecommerce.thriftauction.features.auth.entity.User;
import com.ecommerce.thriftauction.features.auth.repository.UserRepository;
import com.ecommerce.thriftauction.features.product.entity.Product;
import com.ecommerce.thriftauction.features.product.repository.ProductRepository;
import com.ecommerce.thriftauction.features.product.entity.ProductStatus;
import com.ecommerce.thriftauction.features.report.dto.ReportRequest;
import com.ecommerce.thriftauction.features.report.dto.ReportResponse;
import com.ecommerce.thriftauction.features.report.entity.Report;
import com.ecommerce.thriftauction.features.report.entity.ReportStatus;
import com.ecommerce.thriftauction.features.report.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public ReportResponse submitReport(String username, ReportRequest request) {
        User reporter = userRepository.findByEmail(username)
                .or(() -> userRepository.findByUsername(username))
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (reportRepository.findByReporterIdAndReportedProductId(reporter.getId(), product.getId()).isPresent()) {
            throw new RuntimeException("Bạn đã tố cáo sản phẩm này rồi, vui lòng đợi Admin xử lý.");
        }

        Report report = Report.builder()
                .reporter(reporter)
                .reportedProduct(product)
                .reason(request.getReason())
                .build();

        report = reportRepository.save(report);
        return mapToResponse(report);
    }

    public Page<ReportResponse> getAllReports(Pageable pageable) {
        return reportRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional
    public ReportResponse updateReportStatus(String reportId, ReportStatus status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(status);
        
        if (status == ReportStatus.RESOLVED) {
            Product product = report.getReportedProduct();
            product.setIsHidden(true);
            product.setStatus(ProductStatus.HIDDEN);
            productRepository.save(product);
        }
        
        report = reportRepository.save(report);
        return mapToResponse(report);
    }

    private ReportResponse mapToResponse(Report report) {
        return ReportResponse.builder()
                .id(report.getId())
                .reporterId(report.getReporter().getId())
                .reporterUsername(report.getReporter().getUsername())
                .reportedProductId(report.getReportedProduct().getId())
                .reportedProductTitle(report.getReportedProduct().getTitle())
                .reason(report.getReason())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
