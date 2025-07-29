package com.auctionx.service;

import java.util.List;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;
import com.auctionx.model.User;

public interface UserService {

    String userRegistration(User user);
    User checkUserLogin(String email, String password);
    boolean checkByEmail(String email);
    User getUserById(Long id);
    void updateUser(User user, Map<String, String> updates);
    void saveUser(User user);
    void updateUserImages(User user, MultipartFile profileImage, MultipartFile coverImage);
    String generateResetToken(String email);
    boolean resetPassword(String token, String newPassword);
    String generateVerificationToken(User user);
    boolean verifyEmail(String token);
	List<User> getAllUsers();
}
