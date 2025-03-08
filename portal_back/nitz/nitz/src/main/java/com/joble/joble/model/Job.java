package com.joble.joble.model;

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
    private String profession;
    private String salary;
    private String status;  // Open, Closed, etc.
}
