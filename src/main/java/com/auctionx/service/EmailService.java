package com.auctionx.service;

public interface EmailService {
    void sendEmail(String to, String subject, String body);
    void sendPasswordResetEmail(String to, String token);
	void sendVerificationEmail(String email, String verificationToken);
}
