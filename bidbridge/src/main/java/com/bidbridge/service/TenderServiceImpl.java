package com.bidbridge.service;


import com.bidbridge.custom_exceptions.BadRequestException;
import com.bidbridge.custom_exceptions.ResourceNotFoundException;
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
}