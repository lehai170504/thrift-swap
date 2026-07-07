package com.ecommerce.thriftauction.service;

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

    @Value("${ai.gemini.api-key}")
    private String geminiApiKey;

    @Value("${ai.gemini.url}")
    private String geminiApiUrl;

    public String generateProductDescription(String productName, String condition) {
        String prompt = String.format(
                "Đóng vai là một chuyên gia marketing bán đồ cũ (secondhand). " +
                        "Hãy viết một đoạn mô tả hấp dẫn, chuẩn SEO (khoảng 3-5 câu) cho sản phẩm sau: " +
                        "\nTên sản phẩm: %s" +
                        "\nTình trạng: %s" +
                        "\nYêu cầu: Viết tự nhiên, không dùng format markdown (không dùng **, #, -), " +
                        "tập trung vào giá trị sử dụng và khuyến khích mua hàng.",
                productName, condition);
        return callGemini(prompt);
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
        return callGemini(prompt);
    }

    @SuppressWarnings("unchecked")
    private String callGemini(String prompt) {
        try {
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt)))));

            Map<String, Object> response = restClient.post()
                    .uri(geminiApiUrl + "?key=" + geminiApiKey)
                    .header("Content-Type", "application/json")
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (!parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
            return "Không thể nhận được phản hồi từ AI lúc này.";
        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage(), e);
            return "Lỗi kết nối AI: " + e.getMessage();
        }
    }
}
