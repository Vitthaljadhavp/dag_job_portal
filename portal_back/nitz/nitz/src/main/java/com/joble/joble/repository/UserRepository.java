package com.joble.joble.repository;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joble.joble.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    // Optional<User> findByResetToken(String resetToken);
    Optional<User> findFirstByResetToken(String resetToken);
    List<User> findByRole(String role);

}
