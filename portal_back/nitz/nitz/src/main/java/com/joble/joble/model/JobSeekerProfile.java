package com.joble.joble.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Entity
@Data
@Table(name = "job_seeker_profile")
public class JobSeekerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String mobileNumber;
    private String address;
    private Date dateOfBirth;
    private String gender;

    // Store only the file path or URL instead of binary data
    private String profilePictureUrl;
    private String resumeUrl; // ✅ Store resume file URL instead of just name

    private String aboutMe;

    @OneToMany(mappedBy = "jobSeekerProfile", cascade = CascadeType.ALL)
    private List<Education> educationList;

    @ElementCollection
    private List<String> skills;

    @OneToMany(mappedBy = "jobSeekerProfile", cascade = CascadeType.ALL)
    private List<Experience> experienceList;
}
