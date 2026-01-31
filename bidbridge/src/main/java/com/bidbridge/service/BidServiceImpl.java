package com.bidbridge.service;


import com.bidbridge.custom_exceptions.DuplicateResourceException;
import com.bidbridge.custom_exceptions.InvalidOperationException;
import com.bidbridge.custom_exceptions.ResourceNotFoundException;
import com.bidbridge.entities.Bid;
import com.bidbridge.entities.BidStatus;
import com.bidbridge.entities.Tender;
import com.bidbridge.entities.VendorProfile;
import com.bidbridge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BidServiceImpl implements BidService {

    private final BidRepository bidRepository;
    private final TenderRepository tenderRepository;
    private final VendorProfileRepository vendorProfileRepository;
    
    @Override
    public Bid submitBid(Long tenderId, Long vendorProfileId, Bid bid) {

        Tender tender = tenderRepository.findById(tenderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Tender not found")
                );

        //  Cannot bid after end date
        if (LocalDateTime.now().isAfter(tender.getEndDate())) {
            throw new InvalidOperationException("Tender is closed for bidding");
        }

        VendorProfile vendorProfile = vendorProfileRepository.findById(vendorProfileId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vendor profile not found")
                );
        
     //  Prevent duplicate bid
        bidRepository.findByTenderAndVendorProfile(tender, vendorProfile)
                .ifPresent(existing -> {
                    throw new DuplicateResourceException(
                            "Bid already submitted for this tender"
                    );
                });

        bid.setTender(tender);
        bid.setVendorProfile(vendorProfile);
        bid.setStatus(BidStatus.SUBMITTED);
        bid.setSubmittedAt(LocalDateTime.now());

        return bidRepository.save(bid);
    }
    
    /**
     * BIDDING RULE
     * Buyer can see bids ONLY after tender end date
     */
    @Override
    public List<Bid> getBidsForTender(Long tenderId) {

        Tender tender = tenderRepository.findById(tenderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Tender not found")
                );

        if (LocalDateTime.now().isBefore(tender.getEndDate())) {
            throw new InvalidOperationException(
                    "Bids are sealed until tender end date"
            );
        }
        
        return bidRepository.findByTender(tender);
    }

    @Override
    public List<Bid> getBidsByVendor(Long vendorProfileId) {

        VendorProfile vendorProfile = vendorProfileRepository.findById(vendorProfileId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vendor profile not found")
                );

        return bidRepository.findByVendorProfile(vendorProfile);
    }
}
