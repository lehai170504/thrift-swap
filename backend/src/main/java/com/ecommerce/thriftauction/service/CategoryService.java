package com.ecommerce.thriftauction.service;

import com.ecommerce.thriftauction.dto.CategoryDto;
import com.ecommerce.thriftauction.entity.Category;
import com.ecommerce.thriftauction.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryDto createCategory(CategoryDto request) {
        Category parent = null;
        if (request.getParentId() != null) {
            parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .parent(parent)
                .build();

        return mapToDto(categoryRepository.save(category));
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findByParentIsNull().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CategoryDto mapToDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .icon(category.getIcon())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .subCategories(category.getSubCategories() != null
                        ? category.getSubCategories().stream().map(this::mapToDto).collect(Collectors.toList())
                        : null)
                .build();
    }
}
