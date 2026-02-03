package com.bidbridge.service;

import com.bidbridge.entities.BuyerProfile;

public interface BuyerProfileService {

	BuyerProfile registerBuyer(BuyerProfile buyerProfile, String rawPassword);
	BuyerProfile getProfileByUserId(Long userId);
}