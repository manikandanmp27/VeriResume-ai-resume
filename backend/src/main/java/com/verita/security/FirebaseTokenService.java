package com.verita.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class FirebaseTokenService {

    private final FirebaseAuth firebaseAuth;
    private final JwtTokenProvider jwtTokenProvider;

    @Getter
    @Builder
    public static class VerifiedToken {
        private String uid;
        private String email;
        private String name;
        private boolean isLegacyJwt;
    }

    public VerifiedToken verifyToken(String token) {
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
            log.debug("Firebase token verification failed, checking for development/legacy JWT: {}", ex.getMessage());
        }

        // 2. Fallback: Support legacy JWT tokens or mock tokens in dev/test
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
