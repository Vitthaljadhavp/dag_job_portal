package com.joble.joble.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);  // ✅ 587 for TLS
        mailSender.setUsername("vitthaljadhav12369@gmail.com");
        mailSender.setPassword("wlyrlugrucmsqmeu");  // ✅ Make sure this is an App Password

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");  // ✅ Correct setting for port 587
        props.put("mail.smtp.starttls.required", "true");  // ✅ Enforce StartTLS
        props.put("mail.debug", "true");  // ✅ Enables debugging logs to see what's happening

        return mailSender;
    }
}
