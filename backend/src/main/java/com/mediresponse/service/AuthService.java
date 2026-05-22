package com.mediresponse.service;

import com.mediresponse.dto.LoginRequest;
import com.mediresponse.dto.LoginResponse;
import com.mediresponse.dto.SignupRequest;
import com.mediresponse.model.User;
import com.mediresponse.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse authenticate(LoginRequest request) {
        LoginResponse response = new LoginResponse();
        Optional<User> userOpt = userRepository.findByEmployeeId(request.getEmployeeId().toUpperCase());

        if (userOpt.isEmpty()) {
            response.setSuccess(false);
            response.setError("Employee ID not found in system.");
            return response;
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            response.setSuccess(false);
            response.setError("Incorrect password. Please try again.");
            return response;
        }

        return buildSuccess(user);
    }

    public LoginResponse register(SignupRequest request) {
        LoginResponse response = new LoginResponse();
        String empId = request.getEmployeeId().toUpperCase();

        if (userRepository.findByEmployeeId(empId).isPresent()) {
            response.setSuccess(false);
            response.setError("Employee ID already registered.");
            return response;
        }

        User user = new User();
        user.setEmployeeId(empId);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setDepartment(request.getDepartment());
        try {
            user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            response.setSuccess(false);
            response.setError("Invalid role: " + request.getRole());
            return response;
        }
        userRepository.save(user);
        return buildSuccess(user);
    }

    private LoginResponse buildSuccess(User user) {
        LoginResponse response = new LoginResponse();
        response.setSuccess(true);
        response.setToken(jwtService.generateToken(user.getEmployeeId()));
        response.setName(user.getName());
        response.setRole(user.getRole().name());
        response.setEmployeeId(user.getEmployeeId());
        response.setDepartment(user.getDepartment());
        return response;
    }
}
