package com.crni99.studentms.security;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

/**
 * Small, self-contained helper responsible only for issuing and validating
 * JWTs. It does not replace or touch the existing HTTP Basic credentials
 * defined in application.properties - it simply wraps them in a token so the
 * frontend doesn't have to hold a raw username/password after login.
 */
@Component
public class JwtUtil {

	@Value("${jwt.secret}")
	private String secret;

	@Value("${jwt.expiration-ms}")
	private long expirationMs;

	private Key getSigningKey() {
		// Supports either a base64 secret or a plain string secret.
		byte[] keyBytes;
		try {
			keyBytes = Decoders.BASE64.decode(secret);
		} catch (IllegalArgumentException e) {
			keyBytes = secret.getBytes();
		}
		return Keys.hmacShaKeyFor(keyBytes.length >= 32 ? keyBytes : pad(keyBytes));
	}

	private byte[] pad(byte[] input) {
		byte[] padded = new byte[32];
		System.arraycopy(input, 0, padded, 0, Math.min(input.length, 32));
		return padded;
	}

	public String generateToken(String username) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + expirationMs);
		return Jwts.builder()
				.setSubject(username)
				.setIssuedAt(now)
				.setExpiration(expiry)
				.signWith(getSigningKey(), SignatureAlgorithm.HS256)
				.compact();
	}

	public String extractUsername(String token) {
		return parseClaims(token).getSubject();
	}

	public boolean isTokenValid(String token, String username) {
		try {
			Claims claims = parseClaims(token);
			return claims.getSubject().equals(username) && claims.getExpiration().after(new Date());
		} catch (io.jsonwebtoken.JwtException e) {
			return false;
		}
	}

	private Claims parseClaims(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(getSigningKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
	}
}
