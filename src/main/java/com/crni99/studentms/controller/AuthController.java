package com.crni99.studentms.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crni99.studentms.model.User;
import com.crni99.studentms.repository.UserRepository;
import com.crni99.studentms.security.JwtUtil;

/**
 * Login checks the "users" table (real, registered accounts, passwords
 * hashed with BCrypt) and falls back to the single admin account already
 * defined in application.properties (spring.security.user.name/.password)
 * so the original crni99/student credentials keep working even though
 * that account was never inserted into the users table.
 */
@RestController
@RequestMapping("api/v1/auth")
public class AuthController {

	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Value("${spring.security.user.name}")
	private String legacyUsername;

	@Value("${spring.security.user.password}")
	private String legacyPassword;

	public AuthController(JwtUtil jwtUtil, UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.jwtUtil = jwtUtil;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public record LoginRequest(String username, String password) {
	}

	public record RegisterRequest(String username, String password) {
	}

	public record AuthResponse(String token, String username) {
	}

	public record AuthError(String message) {
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request) {
		if (request == null || isBlank(request.username()) || isBlank(request.password())) {
			return ResponseEntity.badRequest().body(new AuthError("Username and password are required."));
		}

		boolean valid = userRepository.findByUsername(request.username())
				.map(user -> passwordEncoder.matches(request.password(), user.getPassword()))
				.orElseGet(() -> legacyUsername.equals(request.username()) && legacyPassword.equals(request.password()));

		if (!valid) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthError("Invalid username or password."));
		}

		String token = jwtUtil.generateToken(request.username());
		return ResponseEntity.ok(new AuthResponse(token, request.username()));
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
		if (request == null || isBlank(request.username()) || isBlank(request.password())) {
			return ResponseEntity.badRequest().body(new AuthError("Username and password are required."));
		}
		if (request.username().length() < 3) {
			return ResponseEntity.badRequest().body(new AuthError("Username must be at least 3 characters."));
		}
		if (request.password().length() < 4) {
			return ResponseEntity.badRequest().body(new AuthError("Password must be at least 4 characters."));
		}
		if (legacyUsername.equals(request.username()) || userRepository.existsByUsername(request.username())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(new AuthError("That username is already taken."));
		}

		User user = new User(request.username(), passwordEncoder.encode(request.password()));
		userRepository.save(user);

		// Log the new user straight in so they land in the app immediately,
		// same as a returning user would after /login.
		String token = jwtUtil.generateToken(user.getUsername());
		return ResponseEntity.ok(new AuthResponse(token, user.getUsername()));
	}

	private boolean isBlank(String value) {
		return value == null || value.trim().isEmpty();
	}
}
