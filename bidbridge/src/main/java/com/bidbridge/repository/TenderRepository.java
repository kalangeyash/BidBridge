package com.bidbridge.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.bidbridge.entities.BuyerProfile;
import com.bidbridge.entities.Category;
import com.bidbridge.entities.Tender;
import com.bidbridge.entities.TenderStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface TenderRepository extends JpaRepository<Tender, Long> {

    // All tenders by buyer organization
    List<Tender> findByBuyerProfile(BuyerProfile buyerProfile);
    
    

    // All OPEN tenders
    List<Tender> findByStatus(TenderStatus status);

    // Active tenders for vendors
    List<Tender> findByStatusAndEndDateAfter(
            TenderStatus status,
            LocalDateTime now
    );

    // Category-wise tenders
    List<Tender> findByCategory(Category category);
    
    List<Tender> findByBuyerProfileBuyerProfileId(Long buyerProfileId);

}