package com.bidbridge.controllers;


import com.bidbridge.dto.AuthResponse;
import com.bidbridge.dto.LoginRequest;
import com.bidbridge.security.CustomUserDetails;
import com.bidbridge.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    // 1. Keep @Valid for safety
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        
        // 2. Authenticate
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // 3. Use the principal for type safety
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        // 4. Generate token
        String token = jwtUtil.generateToken(userDetails.getUsername());

        // 5. Clean role extraction (gets the first role without brackets)
        String role = userDetails.getAuthorities().isEmpty() ? "" : 
                      userDetails.getAuthorities().iterator().next().getAuthority();

        // 6. Return response
        AuthResponse response = new AuthResponse(
                token,
                userDetails.getUsername(),
                role,
                "Login successful"
        );

        return ResponseEntity.ok(response);
    }
}