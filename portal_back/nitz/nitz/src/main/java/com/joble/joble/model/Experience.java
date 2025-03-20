package com.joble.joble.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
@Table(name = "experience")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String role;
    private Date startDate;
    private Date endDate;
    private String jobType; // Internship/Full-time
    private String mode; // Remote/In-Office/Hybrid

    @ManyToOne
    @JoinColumn(name = "job_seeker_id")
    private JobSeekerProfile jobSeekerProfile;
}
