package com.bidbridge.controllers;

import com.bidbridge.entities.Tender;
import com.bidbridge.service.TenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tenders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TenderController {
 
    private final TenderService tenderService;

    // 1. For Vendors: See all active/open tenders
    @GetMapping("/active")
    public ResponseEntity<List<Tender>> getActiveTenders() {
        return ResponseEntity.ok(tenderService.getAllOpenTenders());
    }

    // 2. Get specific tender details
    @GetMapping("/{id}")
    public ResponseEntity<Tender> getTenderById(@PathVariable Long id) {
        return ResponseEntity.ok(tenderService.getTenderById(id));
    }

    // 3. For Admins: See everything
    @GetMapping("/all")
    public ResponseEntity<List<Tender>> getAllTenders() {
        return ResponseEntity.ok(tenderService.getAllTenders());
    }
}