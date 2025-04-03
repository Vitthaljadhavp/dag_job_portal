package com.joble.joble.model;

import java.sql.Date;
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

    // @ManyToOne
    // @JoinColumn(name = "employer_id", nullable = false)
    // private User employer;  // Assuming you already have a User entity for employers

    private String title;
    private String company;
    private String location;
    private String type; // Full-time, Internship
    private String mode; // Remote, Hybrid, In-company
    private int salary;

    @ElementCollection
    private List<String> skills;
    private String description ; 
    private String deadline ;
    private String status;  // Open, Closed, etc.
    // @ManyToOne
    // private Employer employer; // Job posted by an employer
}
