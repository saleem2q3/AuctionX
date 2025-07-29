package com.auctionx.controller;

import com.auctionx.Dto.AdminLoginRequest;
import com.auctionx.model.Admin;
import com.auctionx.model.User;
import com.auctionx.service.AdminService;
import com.auctionx.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import jakarta.servlet.http.HttpSession; // Updated import for Jakarta EE 9+
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {
        Admin createdAdmin = adminService.createAdmin(admin);
        return new ResponseEntity<>(createdAdmin, HttpStatus.CREATED);
    }

    @GetMapping("/")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        List<Admin> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
        Admin admin = adminService.getAdminById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
        return ResponseEntity.ok(admin);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable Long id, @RequestBody Admin admin) {
        Admin updatedAdmin = adminService.updateAdmin(id, admin);
        return ResponseEntity.ok(updatedAdmin);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request, HttpSession session) {
        Admin admin = adminService.login(request);
        if (admin != null) {
            session.setAttribute("admin", admin);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin logged in successfully.");
            response.put("admin", admin);

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid credentials."));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpSession session) {
        if (session.getAttribute("admin") != null) {
            session.invalidate();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Admin logged out successfully.");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "No admin is currently logged in.");
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/user-details")
    public ResponseEntity<Map<String, Object>> getUserDetailsWithCount() {
        List<User> users = userService.getAllUsers();
        if (users == null || users.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "No users found."));
        }
        Map<String, Object> response = new HashMap<>();
        response.put("totalUsers", users.size());
        response.put("userDetails", users);
        return ResponseEntity.ok(response);
    }
}
