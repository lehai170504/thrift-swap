package com.ecommerce.thriftauction.core.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
public class IpWhitelistFilter extends OncePerRequestFilter {

    @Value("${app.admin.allowed-ips}")
    private String allowedIpsString;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Chỉ kiểm tra các route dành cho admin/staff
        if (path.startsWith("/api/v1/admin") || path.startsWith("/api/v1/staff")) {
            String clientIp = getClientIp(request);
            List<String> allowedIps = Arrays.asList(allowedIpsString.split(","));

            if (!allowedIps.contains(clientIp)) {
                log.warn("Blocked access to admin route {} from unauthorized IP: {}", path, clientIp);
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\": \"Access Denied: IP address not whitelisted\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
