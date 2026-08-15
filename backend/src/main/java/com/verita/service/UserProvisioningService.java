package com.verita.service;

import com.verita.entity.Profile;
import com.verita.entity.User;
import com.verita.entity.enums.Role;
import com.verita.repository.ProfileRepository;
import com.verita.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserProvisioningService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    @Transactional
    public User getOrCreateFirebaseUser(String firebaseUid, String email, String fullName) {
        String cleanEmail = (email != null) ? email.toLowerCase().trim() : null;
        String cleanName = (fullName != null && !fullName.isBlank()) ? fullName.trim() : (cleanEmail != null ? cleanEmail.split("@")[0] : "User");

        // 1. Look up by firebaseUid
        if (firebaseUid != null) {
            var existingByUid = userRepository.findByFirebaseUid(firebaseUid);
            if (existingByUid.isPresent()) {
                User user = existingByUid.get();
                // Sync name if updated
                if (cleanName != null && !cleanName.equalsIgnoreCase("User") && (user.getFullName() == null || user.getFullName().isBlank())) {
                    user.setFullName(cleanName);
                    return userRepository.save(user);
                }
                return user;
            }
        }

        // 2. Look up by email (e.g. pre-existing account before Firebase migration)
        if (cleanEmail != null) {
            var existingByEmail = userRepository.findByEmail(cleanEmail);
            if (existingByEmail.isPresent()) {
                User user = existingByEmail.get();
                if (firebaseUid != null && user.getFirebaseUid() == null) {
                    user.setFirebaseUid(firebaseUid);
                    log.info("Linked existing user {} with Firebase UID {}", cleanEmail, firebaseUid);
                    return userRepository.save(user);
                }
                return user;
            }
        }

        // 3. Provision new User
        log.info("Auto-provisioning new PostgreSQL user for Firebase UID {} (email: {})", firebaseUid, cleanEmail);
        User newUser = User.builder()
                .email(cleanEmail != null ? cleanEmail : (firebaseUid + "@firebase.user"))
                .firebaseUid(firebaseUid)
                .fullName(cleanName)
                .role(Role.ROLE_USER)
                .build();

        User savedUser = userRepository.save(newUser);

        // Auto-create initial Profile
        Profile profile = Profile.builder()
                .user(savedUser)
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .build();
        profileRepository.save(profile);

        return savedUser;
    }
}
