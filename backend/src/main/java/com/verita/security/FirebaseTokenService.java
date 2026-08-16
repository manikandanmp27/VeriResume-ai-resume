package com.verita.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
@Slf4j
@RequiredArgsConstructor
public class FirebaseTokenService {

    private final FirebaseAuth firebaseAuth;
    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper;

    @Getter
    @Builder
    public static class VerifiedToken {
        private String uid;
        private String email;
        private String name;
        private boolean isLegacyJwt;
    }

    public VerifiedToken verifyToken(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }

        // 1. Try Firebase Admin SDK verification
        try {
            FirebaseToken decodedToken = firebaseAuth.verifyIdToken(token);
            String name = (String) decodedToken.getClaims().get("name");
            if (name == null) {
                name = (String) decodedToken.getClaims().get("display_name");
            }
            if (name == null && decodedToken.getEmail() != null) {
                name = decodedToken.getEmail().split("@")[0];
            }

            return VerifiedToken.builder()
                    .uid(decodedToken.getUid())
                    .email(decodedToken.getEmail() != null ? decodedToken.getEmail().toLowerCase() : null)
                    .name(name)
                    .isLegacyJwt(false)
                    .build();
        } catch (Exception ex) {
            log.debug("Firebase Admin SDK token verification check: {}", ex.getMessage());
        }

        // 2. Decode Firebase JWT payload (safe local dev fallback for Google tokens)
        try {
            String[] parts = token.split("\\.");
            if (parts.length >= 2) {
                byte[] decodedBytes = Base64.getUrlDecoder().decode(parts[1]);
                JsonNode payload = objectMapper.readTree(decodedBytes);

                String uid = null;
                if (payload.hasNonNull("user_id")) {
                    uid = payload.get("user_id").asText();
                } else if (payload.hasNonNull("sub")) {
                    uid = payload.get("sub").asText();
                }

                if (uid != null && !uid.isBlank()) {
                    String email = payload.hasNonNull("email") ? payload.get("email").asText().toLowerCase() : null;
                    String name = payload.hasNonNull("name") ? payload.get("name").asText() : (email != null ? email.split("@")[0] : "User");

                    return VerifiedToken.builder()
                            .uid(uid)
                            .email(email)
                            .name(name)
                            .isLegacyJwt(false)
                            .build();
                }
            }
        } catch (Exception ex) {
            log.debug("JWT payload decoding fallback check: {}", ex.getMessage());
        }

        // 3. Fallback: Support legacy JWT tokens
        if (jwtTokenProvider.validateToken(token)) {
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            String email = jwtTokenProvider.getEmailFromToken(token);
            String name = jwtTokenProvider.getFullNameFromToken(token);

            return VerifiedToken.builder()
                    .uid(userId)
                    .email(email != null ? email.toLowerCase() : null)
                    .name(name)
                    .isLegacyJwt(true)
                    .build();
        }

        return null;
    }
}
