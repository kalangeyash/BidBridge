package com.bidbridge.service;

import com.bidbridge.entities.VendorProfile;

public interface VendorProfileService {

    VendorProfile registerVendor(VendorProfile vendorProfile, String rawPassword);
    VendorProfile getProfileByUserId(Long userId);
}
