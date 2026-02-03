package com.bidbridge.service;

import com.bidbridge.dto.VendorProfileRequest;
import com.bidbridge.dto.VendorUpdateDTO;
import com.bidbridge.entities.VendorProfile;

public interface VendorProfileService {

    VendorProfile registerVendor(VendorProfile vendorProfile, String rawPassword);
    VendorProfile getProfileByUserId(Long userId);
//     VendorProfile updateVendor(Long vendorId, VendorProfileRequest req);
    public VendorProfile updateProfile(Long vendorId, VendorUpdateDTO dto);
    VendorProfile getVendorById(Long vendorId); 
    
}
