package com.bidbridge.controllers;

import com.bidbridge.dto.CategoryResponse;
import com.bidbridge.entities.Category;
import com.bidbridge.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponse> addCategory(@Valid @RequestBody CategoryResponse request) {
        // Manual Mapping DTO -> Entity
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());

        Category saved = categoryService.addCategory(category);

        // Manual Mapping Entity -> DTO
        CategoryResponse response = new CategoryResponse(
                saved.getCategoryId(),
                saved.getName(),
                saved.getDescription()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> responses = categoryService.getAllCategories().stream()
                .map(cat -> new CategoryResponse(cat.getCategoryId(), cat.getName(), cat.getDescription()))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
}