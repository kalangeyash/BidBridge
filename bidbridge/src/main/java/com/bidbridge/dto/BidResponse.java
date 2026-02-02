package com.bidbridge.dto;

import com.bidbridge.entities.BidStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor // This solves: The constructor BidResponse(...) is undefined
public class BidResponse {
    private Long bidId;
    private Long tenderId;
    private String vendorCompanyName;
    private Double bidAmount;
    private BidStatus status;
    private LocalDateTime submittedAt;
}