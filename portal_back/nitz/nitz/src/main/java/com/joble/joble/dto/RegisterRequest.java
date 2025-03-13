package com.joble.joble.dto;

import lombok.Data;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class RegisterRequest {
    
    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Mobile number cannot be blank")
    private String mobileNo;   
    
    @NotBlank(message = "Work status cannot be blank")
    private String workStatus; 
    
    @NotBlank(message = "Role cannot be blank")
    private String role; // "EMPLOYER" or "JOB_SEEKER"
}
