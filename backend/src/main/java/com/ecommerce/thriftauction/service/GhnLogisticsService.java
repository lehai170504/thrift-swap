package com.ecommerce.thriftauction.service;

import com.ecommerce.thriftauction.entity.Order;
import com.ecommerce.thriftauction.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GhnLogisticsService {

    @Value("${ghn.api.url:https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create}")
    private String ghnCreateOrderUrl;

    @Value("${ghn.token:fake-token}")
    private String ghnToken;

    @Value("${ghn.shop-id:12345}")
    private String ghnShopId;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> createShippingOrder(Order order) {
        User buyer = order.getBuyer();
        User seller = order.getSeller();

        // 1. Setup Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Token", ghnToken);
        headers.set("ShopId", ghnShopId);

        // 2. Setup Request Body
        Map<String, Object> body = new HashMap<>();
        body.put("payment_type_id", 1); // 1 = Seller pays shipping, 2 = Buyer pays
        body.put("note", "ThriftSwap order " + order.getId());
        body.put("required_note", "CHOTHUHANG");

        // Return address (Seller)
        body.put("return_name", seller.getFullName() != null ? seller.getFullName() : seller.getUsername());
        body.put("return_phone", seller.getPhone() != null ? seller.getPhone() : "0987654321");
        body.put("return_address", seller.getAddress() != null ? seller.getAddress() : "123 Street");

        // Destination address (Buyer)
        body.put("to_name", buyer.getFullName() != null ? buyer.getFullName() : buyer.getUsername());
        body.put("to_phone", buyer.getPhone() != null ? buyer.getPhone() : "0987654321");
        body.put("to_address", buyer.getAddress() != null ? buyer.getAddress() : "123 Street");
        body.put("to_ward_code", "20109");
        body.put("to_district_id", 1442);
        body.put("weight", 500); // 500 grams
        body.put("length", 15);
        body.put("width", 15);
        body.put("height", 15);
        body.put("service_type_id", 2); // 2 = Standard shipping

        // Items array
        Map<String, Object> item = new HashMap<>();
        item.put("name", order.getProduct().getTitle());
        item.put("quantity", order.getQuantity());
        item.put("price", order.getTotalAmount().intValue());

        body.put("items", List.of(item));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(ghnCreateOrderUrl, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseData = (Map<String, Object>) response.getBody().get("data");
                if (responseData != null) {
                    String orderCode = (String) responseData.get("order_code");
                    Integer totalFee = (Integer) responseData.get("total_fee");

                    Map<String, Object> result = new HashMap<>();
                    result.put("trackingCode", orderCode);
                    result.put("shippingFee", totalFee != null ? new BigDecimal(totalFee) : BigDecimal.ZERO);
                    return result;
                }
            }
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            System.err.println("GHN API Error Status: " + e.getStatusCode());
            System.err.println("GHN API Error Body: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            System.err.println("GHN Error: " + e.getMessage());
        }

        // Fallback for demonstration if API fails or keys are missing
        Map<String, Object> mockResult = new HashMap<>();
        mockResult.put("trackingCode", "GHN_MOCK_" + System.currentTimeMillis());
        mockResult.put("shippingFee", new BigDecimal("35000"));
        return mockResult;
    }
}
