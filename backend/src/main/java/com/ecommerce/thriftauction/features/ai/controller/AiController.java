package com.ecommerce.thriftauction.features.ai.controller;

import com.ecommerce.thriftauction.features.ai.dto.request.AiRequest;
import com.ecommerce.thriftauction.features.ai.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/generate-description")
    public ResponseEntity<Map<String, String>> generateDescription(@RequestBody AiRequest request) {
        String description = aiService.generateProductDescription(request.getProductName(), request.getCondition());
        return ResponseEntity.ok(Map.of("data", description));
    }

    @PostMapping("/suggest-price")
    public ResponseEntity<Map<String, String>> suggestPrice(@RequestBody AiRequest request) {
        String priceSuggestion = aiService.suggestStartingPrice(request.getProductName(), request.getCondition());
        return ResponseEntity.ok(Map.of("data", priceSuggestion));
    }
}
