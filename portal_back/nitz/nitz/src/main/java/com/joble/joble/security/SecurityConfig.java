package com.joble.joble.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtTokenFilter jwtTokenFilter;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults()) // ✅ Explicitly allow CORS before security rules
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public Endpoints
                .requestMatchers("/api/users/register", "/api/users/login", "/api/users/forgot-password", "/api/users/reset-password").permitAll()
                .requestMatchers("/oauth2/**", "/login/**", "/auth/user").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/api/users/job_seekers").permitAll()
                .requestMatchers("/api/users").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users/forgot-password").permitAll()
                
                // Job Seeker Profile Endpoints (Authenticated Only)
                .requestMatchers(HttpMethod.POST, "/api/job-seeker/**").authenticated() 
                .requestMatchers(HttpMethod.PUT, "/api/job-seeker/**").authenticated() 
                .requestMatchers(HttpMethod.PUT, "/api/users/update-profile-status/**").authenticated() // ✅ Ensured authentication
                
                // Public Job Listings
                .requestMatchers(HttpMethod.GET, "/api/jobs/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/jobs/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/jobs/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/jobs/**").permitAll()

                // Public Job Listings
                .requestMatchers(HttpMethod.GET, "/api/applied-jobs/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/applied-jobs/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/applied-jobs/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/applied-jobs/**").permitAll()


                // Any other requests require authentication
                .anyRequest().authenticated()
            )

            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // ✅ Enforce stateless sessions

            .oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(endpoint -> endpoint.baseUri("/oauth2/authorization"))
                .redirectionEndpoint(endpoint -> endpoint.baseUri("/login/oauth2/code/github"))
                .defaultSuccessUrl("http://localhost:3000/dashboard", true)
            )
            
            .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class); // ✅ Ensure JWT authentication

        return http.build();
    }

    // ✅ CORS Configuration to Allow Frontend Requests
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost:3000")); // ✅ Allow React frontend
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true); // ✅ Allow credentials (for cookies/sessions)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
