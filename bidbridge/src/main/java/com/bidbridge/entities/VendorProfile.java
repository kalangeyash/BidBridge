package com.bidbridge.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vendor_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vendorProfileId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String companyName;
    
    @Column(unique = true)
    private String gstNumber;

    private String address;

    private Double rating;
}
