package com.bidbridge.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.bidbridge.entities.Bid;
import com.bidbridge.entities.Tender;
import com.bidbridge.entities.VendorProfile;

import java.util.List;
import java.util.Optional;

public interface BidRepository extends JpaRepository<Bid, Long> {

    // All bids for a tender (buyer sees AFTER end date)
    List<Bid> findByTender(Tender tender);

    // Vendor's bid on a tender
    Optional<Bid> findByTenderAndVendorProfile(
            Tender tender,
            VendorProfile vendorProfile
    );

    // All bids submitted by a vendor
    List<Bid> findByVendorProfile(VendorProfile vendorProfile);
}