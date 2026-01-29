package com.bidbridge.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tenders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tender {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tenderId;

    @Column(nullable = false)
    private String title;

    @Column(length = 3000)
    private String description;
    
 // Category of the tender
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    // Buyer organization that published the tender
    @ManyToOne
    @JoinColumn(name = "buyer_profile_id", nullable = false)
    private BuyerProfile buyerProfile;

    private Double budgetMin;
    private Double budgetMax;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;
    
    @Enumerated(EnumType.STRING)
    private TenderStatus status = TenderStatus.OPEN;

    private LocalDateTime createdAt = LocalDateTime.now();
}