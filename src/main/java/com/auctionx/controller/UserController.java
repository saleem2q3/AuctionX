package com.auctionx.controller;

import com.auctionx.model.User;
import com.auctionx.service.EmailService;
import com.auctionx.service.OTPService;
import com.auctionx.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Controller
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OTPService otpService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            String verificationToken = userService.userRegistration(user);
            if (verificationToken != null) {
                emailService.sendVerificationEmail(user.getEmail(), verificationToken);
                return ResponseEntity.ok("Registration successful. Verification link sent to your email.");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed. Email or username may already exist.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during registration: " + e.getMessage());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        try {
            boolean isVerified = userService.verifyEmail(token);
            return isVerified ? 
                ResponseEntity.ok("Email verified successfully.") : 
                ResponseEntity.badRequest().body("Invalid or expired verification token.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying email: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> checkUserLogin(@RequestBody Map<String, String> userLoginData, HttpSession session) {
        String email = userLoginData.get("email");
        String password = userLoginData.get("password");
        User user = userService.checkUserLogin(email, password);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        if (!user.isEmailVerified()) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Please verify your email before logging in.");
        session.setAttribute("user", user);
        session.setAttribute("userEmail", user.getEmail());
        session.setMaxInactiveInterval(1800);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/generate-otp")
    public ResponseEntity<String> generateOTP(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        otpService.generateOTP(email);
        return ResponseEntity.ok("OTP sent to " + email);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOTP(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        return otpService.verifyOTP(email, otp) ?
            ResponseEntity.ok("OTP verified successfully.") :
            ResponseEntity.badRequest().body("Invalid OTP.");
    }

    @GetMapping("/details")
    public ResponseEntity<?> getUserDetails(HttpSession session) {
        User user = (User) session.getAttribute("user");
        return user == null ? 
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in.") : 
            ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully.");
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(
        HttpSession session,
        @RequestParam Map<String, String> updates,
        @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
        @RequestParam(value = "coverImage", required = false) MultipartFile coverImage
    ) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized.");
        Map<String, String> errors = new HashMap<>();
        if (updates.containsKey("name") && updates.get("name").trim().isEmpty()) errors.put("name", "Name cannot be empty.");
        if (updates.containsKey("username") && updates.get("username").length() < 3) errors.put("username", "Username must be at least 3 characters.");
        if (updates.containsKey("password") && updates.get("password").length() < 6) errors.put("password", "Password must be at least 6 characters.");
        if (updates.containsKey("phno") && !updates.get("phno").matches("\\d{10}")) errors.put("phno", "Phone number must be 10 digits.");
        if (!errors.isEmpty()) return ResponseEntity.badRequest().body(errors);
        userService.updateUser(user, updates);
        try {
            if (profileImage != null && !profileImage.isEmpty()) {
                user.setProfileImage(profileImage.getBytes());
                userService.saveUser(user);
            }
            if (coverImage != null && !coverImage.isEmpty()) {
                user.setCoverImage(coverImage.getBytes());
                userService.saveUser(user);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed.");
        }
        session.setAttribute("user", userService.getUserById(user.getId()));
        return ResponseEntity.ok("Profile updated successfully.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        try {
            String token = userService.generateResetToken(email);
            if (token != null) {
                emailService.sendPasswordResetEmail(email, token);
                return ResponseEntity.ok("Password reset instructions sent.");
            }
            return ResponseEntity.badRequest().body("Email not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating reset token: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        try {
            boolean isReset = userService.resetPassword(token, newPassword);
            return isReset ?
                ResponseEntity.ok("Password updated successfully.") :
                ResponseEntity.badRequest().body("Invalid or expired token.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error resetting password: " + e.getMessage());
        }
    }
}
