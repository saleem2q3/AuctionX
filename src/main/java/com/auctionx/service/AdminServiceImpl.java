package com.auctionx.service;

import com.auctionx.Dto.AdminLoginRequest;
import com.auctionx.model.Admin;
import com.auctionx.repository.AdminRepository;
import com.auctionx.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public Admin createAdmin(Admin admin) {
        admin.setCreatedAt(LocalDateTime.now());
        return adminRepository.save(admin);
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    @Override
    public Admin updateAdmin(Long id, Admin updatedAdmin) {
        return adminRepository.findById(id).map(admin -> {
            admin.setName(updatedAdmin.getName());
            admin.setUsername(updatedAdmin.getUsername());
            admin.setEmail(updatedAdmin.getEmail());
            admin.setPhoneNumber(updatedAdmin.getPhoneNumber());
            admin.setProfileImage(updatedAdmin.getProfileImage());
            admin.setStatus(updatedAdmin.getStatus());
            admin.setUpdatedAt(LocalDateTime.now());
            return adminRepository.save(admin);
        }).orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
    }
    @Override
    public Admin login(AdminLoginRequest request) {
        return adminRepository.findByEmail(request.getEmailOrUsername())
                .or(() -> adminRepository.findByUsername(request.getEmailOrUsername()))
                .filter(admin -> admin.getPassword().equals(request.getPassword()))
                .map(admin -> {
                    admin.setLastLogin(LocalDateTime.now());
                    return adminRepository.save(admin);  // Update last login
                })
                .orElseThrow(() -> new RuntimeException("Invalid email/username or password"));
    }
}
