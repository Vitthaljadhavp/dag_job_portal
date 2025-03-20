package com.joble.joble.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "education")
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String collegeUniversity;
    private String degree;
    private String branchSpecialization;
    private String percentageCgpa;
    private int passingYear;

    @ManyToOne
    @JoinColumn(name = "job_seeker_id")
    private JobSeekerProfile jobSeekerProfile;
}
