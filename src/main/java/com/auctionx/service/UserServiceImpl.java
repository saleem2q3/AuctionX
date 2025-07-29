package com.auctionx.service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.auctionx.model.User;
import com.auctionx.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public String userRegistration(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return null;
        }
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setVerificationTokenExpiry(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000));
        user.setEmailVerified(false);
        userRepository.save(user);
        return token;
    }

    @Override
    public User checkUserLogin(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password))
                .orElse(null);
    }

    @Override
    public boolean checkByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public void updateUser(User user, Map<String, String> updates) {
        updates.forEach((key, value) -> {
            if (value != null && !value.trim().isEmpty()) {
                switch (key) {
                    case "name" -> user.setName(value);
                    case "username" -> user.setUsername(value);
                    case "password" -> user.setPassword(value);
                    case "phno" -> user.setPhno(value);
                }
            }
        });
        userRepository.save(user);
    }

    @Override
    public void saveUser(User user) {
        userRepository.save(user);
    }

    @Override
    public String generateResetToken(String email) {
        return userRepository.findByEmail(email).map(user -> {
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiry(new Date(System.currentTimeMillis() + 15 * 60 * 1000));
            userRepository.save(user);
            return token;
        }).orElse(null);
    }

    @Override
    public boolean resetPassword(String token, String newPassword) {
        return userRepository.findByResetToken(token).map(user -> {
            if (user.getResetTokenExpiry() != null && new Date().before(user.getResetTokenExpiry())) {
                user.setPassword(newPassword);
                user.setResetToken(null);
                user.setResetTokenExpiry(null);
                userRepository.save(user);
                return true;
            }
            return false;
        }).orElse(false);
    }

    @Override
    public void updateUserImages(User user, MultipartFile profileImage, MultipartFile coverImage) {
        try {
            if (profileImage != null && !profileImage.isEmpty()) {
                user.setProfileImage(profileImage.getBytes());
            }
            if (coverImage != null && !coverImage.isEmpty()) {
                user.setCoverImage(coverImage.getBytes());
            }
            userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update images", e);
        }
    }

    @Override
    public String generateVerificationToken(User user) {
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setVerificationTokenExpiry(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000));
        userRepository.save(user);
        return token;
    }

    @Override
    public boolean verifyEmail(String token) {
        return userRepository.findByVerificationToken(token).map(user -> {
            if (user.getVerificationTokenExpiry() != null && new Date().before(user.getVerificationTokenExpiry())) {
                user.setEmailVerified(true);
                user.setVerificationToken(null);
                user.setVerificationTokenExpiry(null);
                userRepository.save(user);
                return true;
            }
            return false;
        }).orElse(false);
    }

    @Override
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            throw new RuntimeException("No users found in the system.");
        }
        return users;
    }
}
