package com.auctionx.service;

import com.auctionx.service.OTPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OTPServiceImpl implements OTPService {

    private final ConcurrentHashMap<String, String> otpStorage = new ConcurrentHashMap<>();

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public String generateOTP(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(email, otp);
        sendOTP(email, otp);
        return otp;
    }

    @Override
    public void sendOTP(String email, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setTo(email);
            helper.setSubject("Your OTP Code");
            helper.setText("Your OTP for AuctionX is: " + otp);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    @Override
    public boolean verifyOTP(String email, String userOtp) {
        String storedOtp = otpStorage.get(email);
        return storedOtp != null && storedOtp.equals(userOtp);
    }
}
