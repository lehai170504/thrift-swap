package com.ecommerce.thriftauction.features.ai.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class AiService {

    private final RestClient restClient = RestClient.create();

    @Value("${ai.openai.api-key}")
    private String aiApiKey;

    @Value("${ai.openai.url}")
    private String aiApiUrl;

    @Value("${ai.openai.model}")
    private String aiModel;

    public String generateProductDescription(String productName, String condition) {
        String prompt = String.format(
                "Đóng vai là một chuyên gia marketing bán đồ cũ (secondhand). " +
                        "Hãy viết một đoạn mô tả hấp dẫn, chuẩn SEO (khoảng 3-5 câu) cho sản phẩm sau: " +
                        "\nTên sản phẩm: %s" +
                        "\nTình trạng: %s" +
                        "\nYêu cầu: Viết tự nhiên, không dùng format markdown (không dùng **, #, -), " +
                        "tập trung vào giá trị sử dụng và khuyến khích mua hàng.",
                productName, condition);
        return callAi(prompt);
    }

    public String suggestStartingPrice(String productName, String condition) {
        String prompt = String.format(
                "Đóng vai là một chuyên gia định giá đồ cũ tại Việt Nam. " +
                        "Hãy ước lượng mức giá khởi điểm hợp lý để đưa lên sàn đấu giá cho sản phẩm sau: " +
                        "\nTên sản phẩm: %s" +
                        "\nTình trạng: %s" +
                        "\nYêu cầu: Chỉ trả về một câu ngắn gọn chứa khoảng giá (ví dụ: 'Khoảng 100.000 VNĐ - 200.000 VNĐ') "
                        +
                        "và một câu giải thích ngắn lý do.",
                productName, condition);
        return callAi(prompt);
    }

    @SuppressWarnings("unchecked")
    private String callAi(String prompt) {
        try {
            Map<String, Object> requestBody = Map.of(
                    "model", aiModel,
                    "messages", List.of(
                            Map.of("role", "user", "content", prompt)),
                    "temperature", 0.7);

            Map<String, Object> response = restClient.post()
                    .uri(aiApiUrl)
                    .header("Authorization", "Bearer " + aiApiKey)
                    .header("Content-Type", "application/json")
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    if (message != null && message.containsKey("content")) {
                        return (String) message.get("content");
                    }
                }
            }
            return "Không thể nhận được phản hồi từ AI lúc này.";
        } catch (Exception e) {
            log.error("Error calling AI API: {}", e.getMessage(), e);
            return "Lỗi kết nối AI: " + e.getMessage();
        }
    }
}
