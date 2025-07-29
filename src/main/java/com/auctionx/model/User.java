package com.auctionx.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "username", nullable = false, length = 50, unique = true)
    private String username;

    @Column(name = "email", nullable = false, length = 100, unique = true)
    private String email;

    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Column(name = "phno", nullable = false, length = 15, unique = true)
    private String phno;

    @Lob
    @Column(name = "profile_image", columnDefinition = "MEDIUMBLOB")
    private byte[] profileImage;

    @Lob
    @Column(name = "cover_image", columnDefinition = "MEDIUMBLOB")
    private byte[] coverImage;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "verification_token", length = 100, unique = true)
    private String verificationToken;

    @Column(name = "verification_token_expiry")
    private Date verificationTokenExpiry;

    @Column(name = "reset_token", length = 100, unique = true)
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private Date resetTokenExpiry;

    // Constructors
    public User() {}

    public User(String name, String username, String email, String password, String phno) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.phno = phno;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhno() { return phno; }
    public void setPhno(String phno) { this.phno = phno; }

    public byte[] getProfileImage() { return profileImage; }
    public void setProfileImage(byte[] profileImage) { this.profileImage = profileImage; }

    public byte[] getCoverImage() { return coverImage; }
    public void setCoverImage(byte[] coverImage) { this.coverImage = coverImage; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public String getVerificationToken() { return verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }

    public Date getVerificationTokenExpiry() { return verificationTokenExpiry; }
    public void setVerificationTokenExpiry(Date verificationTokenExpiry) { this.verificationTokenExpiry = verificationTokenExpiry; }

    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }

    public Date getResetTokenExpiry() { return resetTokenExpiry; }
    public void setResetTokenExpiry(Date resetTokenExpiry) { this.resetTokenExpiry = resetTokenExpiry; }

    // Utility Methods
    public void generateVerificationToken() {
        this.verificationToken = UUID.randomUUID().toString();
        this.verificationTokenExpiry = new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000); // 24 hours expiry
    }

    public void clearVerificationToken() {
        this.verificationToken = null;
        this.verificationTokenExpiry = null;
    }
}