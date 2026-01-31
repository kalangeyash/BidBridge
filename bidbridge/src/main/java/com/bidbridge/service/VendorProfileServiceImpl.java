package com.bidbridge.service;


import com.bidbridge.custom_exceptions.DuplicateResourceException;
import com.bidbridge.entities.Role;
import com.bidbridge.entities.User;
import com.bidbridge.entities.VendorProfile;
import com.bidbridge.repository.UserRepository;
import com.bidbridge.repository.VendorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class VendorProfileServiceImpl implements VendorProfileService {
	private final UserRepository userRepository;
    private final VendorProfileRepository vendorProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
   
    public VendorProfile registerVendor(
            VendorProfile vendorProfile,
            String rawPassword
    ) {

        String email = vendorProfile.getUser().getEmail();

        // Duplicate email check
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException(
                    "User already exists with email: " + email
            );
        }

        // Create User
        User user = vendorProfile.getUser();
        user.setRole(Role.VENDOR);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setActive(true);
        
        User savedUser = userRepository.save(user);

        // Link profile
        vendorProfile.setUser(savedUser);

        return vendorProfileRepository.save(vendorProfile);
    }
}