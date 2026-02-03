package com.bidbridge.service;


import com.bidbridge.custom_exceptions.BadRequestException;
import com.bidbridge.custom_exceptions.ResourceNotFoundException;
import com.bidbridge.dto.TenderUpdateDTO;
import com.bidbridge.entities.BuyerProfile;
import com.bidbridge.entities.Category;
import com.bidbridge.entities.Tender;
import com.bidbridge.entities.TenderStatus;
import com.bidbridge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class TenderServiceImpl implements TenderService {

    private final TenderRepository tenderRepository;
    private final BuyerProfileRepository buyerProfileRepository;
    private final CategoryRepository categoryRepository;
    private final BidRepository bidRepository;

    @Override
    public Tender createTender(Tender tender) {

        // Business validation
        if (tender.getStartDate() == null || tender.getEndDate() == null) {
            throw new BadRequestException("Start date and end date are required");
        }

        if (tender.getEndDate().isBefore(tender.getStartDate())) {
            throw new BadRequestException("End date must be after start date");
        }

        // Ensure buyer exists
        BuyerProfile buyerProfile = buyerProfileRepository
                .findById(tender.getBuyerProfile().getBuyerProfileId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Buyer profile not found")
                );
        
        // Ensure category exists
        Category category = categoryRepository
                .findById(tender.getCategory().getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found")
                );

        tender.setBuyerProfile(buyerProfile);
        tender.setCategory(category);
        tender.setStatus(TenderStatus.OPEN);
        tender.setCreatedAt(LocalDateTime.now());

        return tenderRepository.save(tender);
    }

    @Override
    public List<Tender> getTendersByBuyer(Long buyerProfileId) {

        BuyerProfile buyerProfile = buyerProfileRepository.findById(buyerProfileId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Buyer profile not found")
                );

        return tenderRepository.findByBuyerProfile(buyerProfile);
    }

    @Override
    public List<Tender> getActiveTenders() {
        return tenderRepository.findByStatusAndEndDateAfter(
                TenderStatus.OPEN,
                LocalDateTime.now()
        		   );
    }
    @Override
    public List<Tender> getTendersByBuyerId(Long buyerProfileId) {

        // Optional validation (recommended)
        if (!buyerProfileRepository.existsById(buyerProfileId)) {
            throw new ResourceNotFoundException("Buyer profile not found");
        }

        return tenderRepository.findByBuyerProfileBuyerProfileId(buyerProfileId);
    }
    @Override
    @Transactional
    public void deleteTender(Long tenderId) {
        // 1. Clear bids first to satisfy the DB schema constraints
        bidRepository.deleteByTenderId(tenderId);
        
        // 2. Now safe to delete the tender
        tenderRepository.deleteById(tenderId);
    }
    
    @Override
    public List<Tender> getAllOpenTenders() {
        // Correct: Passing the Enum constant
        return tenderRepository.findByStatus(TenderStatus.OPEN); 
    }

//    @Override
//    public Tender getTenderById(Long id) {
//        return tenderRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Tender not found"));
//    }
    @Override
    public Tender getTenderById(Long tenderId) {
        return tenderRepository.findById(tenderId)
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found with id: " + tenderId));
    }
    @Override
    @Transactional
    public Tender updateTender(Long tenderId, TenderUpdateDTO dto) {
        Tender tender = tenderRepository.findById(tenderId)
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found"));

        // Update only the allowed fields
        tender.setTitle(dto.getTitle());
        tender.setEndDate(dto.getEndDate());

        // Update Category by ID
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        tender.setCategory(category);

        return tenderRepository.save(tender);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Tender> getAllTenders() {
        return tenderRepository.findAll();
    }

    @Override
    @Transactional
    public Tender adminUpdateStatus(Long tenderId, String status) {
        Tender tender = tenderRepository.findById(tenderId)
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found"));
        
        try {
            tender.setStatus(TenderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid Status: " + status);
        }
        
        return tenderRepository.save(tender);
    }

}