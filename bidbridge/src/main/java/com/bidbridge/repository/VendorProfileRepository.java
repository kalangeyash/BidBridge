package com.bidbridge.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.bidbridge.entities.User;
import com.bidbridge.entities.VendorProfile;

import java.util.Optional;

public interface VendorProfileRepository extends JpaRepository<VendorProfile, Long> {

    Optional<VendorProfile> findByUser(User user);

    boolean existsByUser(User user);
}
