package com.example.febackendproject.Controller;

import com.example.febackendproject.Service.FilterService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@AllArgsConstructor
@RestController
@RestControllerAdvice
@Validated
@RequestMapping("/filter")
public class FilterController {
    
    private final FilterService filterService;
    
    @GetMapping("/measures")
    public ResponseEntity<?> getMeasures() {
        return ResponseEntity.ok(filterService.getMeasure());
    }
    
    @GetMapping("/prices")
    public ResponseEntity<?> getPrices() {
        return ResponseEntity.ok(filterService.getPrices());
    }
    
}
