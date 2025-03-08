package com.joble.joble.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String mobileNo;
    private String workStatus;
    private String role;
    private String token;
}