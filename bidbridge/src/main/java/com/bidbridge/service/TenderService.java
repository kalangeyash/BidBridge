package com.bidbridge.service;



import java.util.List;

import com.bidbridge.entities.Tender;


public interface TenderService {

    Tender createTender(Tender tender);

    List<Tender> getTendersByBuyer(Long buyerProfileId);

    List<Tender> getActiveTenders();
    
    List<Tender> getTendersByBuyerId(Long buyerProfileId);
}