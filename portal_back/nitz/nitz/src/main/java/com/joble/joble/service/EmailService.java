package com.joble.joble.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private static final Logger logger=LoggerFactory.getLogger(EmailService.class);

// Method to send email
public void sendEmail(String to, String subject, String body) {
    try {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromEmail);  // Your email
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);  // 'true' enables HTML content

        mailSender.send(message);
        logger.info("Email sent successfully to {}" , to);
    } catch (Exception e) {
        logger.error("Email sending failed to {}: {}", to, e.getMessage(), e);
        throw new RuntimeException("Failed to send email", e);
    }
}

    // ✅ Method to send password reset email
    public void sendResetEmail(String to, String resetToken) {
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
        String subject = "Password Reset Request";
        String body = "Click the link below to reset your password:\n" + resetLink +
                      "\n\nIf you did not request this, please ignore this email.";

        sendEmail(to, subject, body);
    }
}
