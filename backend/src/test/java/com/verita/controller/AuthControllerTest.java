package com.verita.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.verita.dto.auth.AuthResponse;
import com.verita.dto.auth.LoginRequest;
import com.verita.dto.auth.RegisterRequest;
import com.verita.dto.auth.UserDto;
import com.verita.entity.enums.Role;
import com.verita.security.JwtAuthenticationFilter;
import com.verita.security.JwtTokenProvider;
import com.verita.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    @DisplayName("POST /api/auth/register should return 201 Created and JWT token")
    void register_ReturnsCreated() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("user@example.com")
                .password("password123")
                .fullName("John Doe")
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .token("jwt-test-token")
                .tokenType("Bearer")
                .user(UserDto.builder()
                        .id("user-1")
                        .email("user@example.com")
                        .fullName("John Doe")
                        .role(Role.ROLE_USER)
                        .createdAt(LocalDateTime.now())
                        .build())
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("jwt-test-token"))
                .andExpect(jsonPath("$.user.email").value("user@example.com"));
    }

    @Test
    @DisplayName("POST /api/auth/login should return 200 OK and JWT token")
    void login_ReturnsOk() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("user@example.com")
                .password("password123")
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .token("jwt-test-token")
                .tokenType("Bearer")
                .user(UserDto.builder()
                        .id("user-1")
                        .email("user@example.com")
                        .fullName("John Doe")
                        .role(Role.ROLE_USER)
                        .build())
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-test-token"));
    }
}
