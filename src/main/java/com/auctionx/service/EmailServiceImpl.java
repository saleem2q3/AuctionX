package com.auctionx.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Override
    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Override
    public void sendPasswordResetEmail(String to, String token) {
        String resetLink = "http://localhost:5173/reset?token=" + token;
        Context context = new Context();
        context.setVariable("resetLink", resetLink);
        String htmlContent = templateEngine.process("password-reset-email", context);
        sendEmail(to, "Password Reset Request - AuctionX", htmlContent);
    }

    @Override
    public void sendVerificationEmail(String to, String verificationToken) {
        String verificationLink = "http://localhost:5173/verify?token=" + verificationToken;
        Context context = new Context();
        context.setVariable("verificationLink", verificationLink);
        String htmlContent = templateEngine.process("email-verification", context);
        sendEmail(to, "Email Verification - AuctionX", htmlContent);
    }
}
