package com.ecommerce.thriftauction.features.product.controller;

import com.ecommerce.thriftauction.features.product.entity.Category;

import com.ecommerce.thriftauction.features.product.dto.CategoryDto;
import com.ecommerce.thriftauction.features.product.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@io.swagger.v3.oas.annotations.tags.Tag(name = "Category")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto request) {
        return ResponseEntity.ok(categoryService.createCategory(request));
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
}

