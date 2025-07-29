package com.auctionx.service;

import com.auctionx.Dto.AdminLoginRequest;
import com.auctionx.model.Admin;
import java.util.List;
import java.util.Optional;

public interface AdminService {
    Admin createAdmin(Admin admin);
    List<Admin> getAllAdmins();
    Optional<Admin> getAdminById(Long id);
    Admin updateAdmin(Long id, Admin admin);
    Admin login(AdminLoginRequest request); 
}
