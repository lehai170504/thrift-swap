package com.ecommerce.thriftauction.features.admin.service;

import com.ecommerce.thriftauction.features.common.dto.ChartDataResponse;
import com.ecommerce.thriftauction.features.order.entity.Order;
import com.ecommerce.thriftauction.features.order.entity.OrderStatus;
import com.ecommerce.thriftauction.features.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.YearMonth;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public List<ChartDataResponse> get6MonthChartData() {
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(5).withDayOfMonth(1).withHour(0).withMinute(0)
                .withSecond(0);

        // Find orders completed in the last 6 months
        List<Order> orders = orderRepository.findByStatusAndCreatedAtGreaterThanEqual(OrderStatus.COMPLETED,
                sixMonthsAgo);

        // Group by YearMonth
        Map<YearMonth, List<Order>> ordersByMonth = orders.stream()
                .collect(Collectors.groupingBy(o -> YearMonth.from(o.getCreatedAt())));

        List<ChartDataResponse> chartData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("'Tháng' M");

        YearMonth currentMonth = YearMonth.now().minusMonths(5);
        for (int i = 0; i < 6; i++) {
            List<Order> monthOrders = ordersByMonth.getOrDefault(currentMonth, new ArrayList<>());
            long orderCount = monthOrders.size();
            BigDecimal revenue = monthOrders.stream()
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            chartData.add(ChartDataResponse.builder()
                    .name(currentMonth.format(formatter))
                    .orders(orderCount)
                    .revenue(revenue)
                    .build());

            currentMonth = currentMonth.plusMonths(1);
        }

        return chartData;
    }
}
