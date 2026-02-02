package com.bidbridge.dto;


import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BidRequest {
    @NotNull(message = "Bid amount is required")
    @Positive(message = "Bid amount must be greater than zero")
    private Double bidAmount;

    @NotBlank(message = "Proposal link or text is required")
    private String proposalDocument;
}