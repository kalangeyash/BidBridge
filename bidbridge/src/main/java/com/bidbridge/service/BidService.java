package com.bidbridge.service;



import java.util.List;

import com.bidbridge.entities.Bid;

public interface BidService {

    Bid submitBid(Long tenderId, Long vendorProfileId, Bid bid);

    List<Bid> getBidsForTender(Long tenderId);

    List<Bid> getBidsByVendor(Long vendorProfileId);
}
