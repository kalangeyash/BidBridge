package com.bidbridge.controllers;

import com.bidbridge.dto.AdminTenderDTO;
import com.bidbridge.entities.Bid;
import com.bidbridge.entities.Tender;
import com.bidbridge.entities.User;
import com.bidbridge.service.BidService;
import com.bidbridge.service.TenderService;
import com.bidbridge.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserService userService;
    private final TenderService tenderService;
    private final BidService bidService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        // Users usually don't have circular loops unless linked to Bids/Tenders
        // If this 500s, apply a UserDTO here too
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/tenders")
    public ResponseEntity<List<AdminTenderDTO>> getAllPlatformTenders() {
        List<Tender> tenders = tenderService.getAllTenders();
        
        // MANUALLY MAP TO DTO - This is the fix for the 500 error
        List<AdminTenderDTO> dtos = tenders.stream().map(t -> AdminTenderDTO.builder()
                .tenderId(t.getTenderId())
                .title(t.getTitle())
                .categoryName(t.getCategory() != null ? t.getCategory().getName() : "N/A")
                .buyerOrganization(t.getBuyerProfile() != null ? t.getBuyerProfile().getOrganizationName() : "N/A")
                .status(t.getStatus() != null ? t.getStatus().name() : "UNKNOWN")
                .endDate(t.getEndDate())
                .build()
        ).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/bids")
    public ResponseEntity<List<Bid>> getAllPlatformBids() {
        // WARNING: If this tab 500s, you MUST create an AdminBidDTO 
        // returning the entity 'Bid' will likely trigger the recursion loop
        return ResponseEntity.ok(bidService.getAllBids());
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }
}