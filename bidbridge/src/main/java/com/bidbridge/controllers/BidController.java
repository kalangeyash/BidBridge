package com.bidbridge.controllers;


import com.bidbridge.dto.BidRequest;
import com.bidbridge.dto.BidResponse;
import com.bidbridge.entities.Bid;
import com.bidbridge.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
public class BidController {
    private final BidService bidService;

    @PostMapping("/tender/{tenderId}/vendor/{vendorId}")
    public ResponseEntity<BidResponse> submitBid(
            @PathVariable Long tenderId, 
            @PathVariable Long vendorId, 
            @Valid @RequestBody BidRequest req) {
        
        Bid bid = new Bid();
        bid.setBidAmount(req.getBidAmount());
        bid.setProposalDocument(req.getProposalDocument());
            
        Bid saved = bidService.submitBid(tenderId, vendorId, bid);
        
        // This now works because of @AllArgsConstructor in BidResponse
        BidResponse resp = new BidResponse(
            saved.getBidId(),
            saved.getTender().getTenderId(),
            saved.getVendorProfile().getCompanyName(),
            saved.getBidAmount(),
            saved.getStatus(),
            saved.getSubmittedAt()
        );

        return new ResponseEntity<>(resp, HttpStatus.CREATED);
    }
}