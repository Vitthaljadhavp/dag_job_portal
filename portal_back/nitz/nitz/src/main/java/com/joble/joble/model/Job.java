package com.joble.joble.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    private User employer;  // Assuming you already have a User entity for employers

    private String title;
    private String company;
    private String location;
    private String jobType; // Full-time, Internship
    private String jobMode; // Remote, Hybrid, In-company
    private String profession;
    private String salary;
    private List<String> skills;
    private LocalDate postedDate; // Use LocalDate to store posting date
    private String status;  // Open, Closed, etc.
    // @ManyToOne
    // private Employer employer; // Job posted by an employer
}
