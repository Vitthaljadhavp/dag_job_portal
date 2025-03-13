package com.joble.joble.model;

import jakarta.persistence.*;
import lombok.Data;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password should be at least 8 characters")
    private String password;

    @NotBlank(message = "Mobile number cannot be blank")
    private String mobileNo;

    @NotBlank(message = "Work status cannot be blank")
    private String workStatus; // "Experienced" or "Fresher"

    private String role; // "EMPLOYER" or "JOB_SEEKER"

    @Column(unique = true)
    private String resetToken;
    private Date tokenExpiry;
}
