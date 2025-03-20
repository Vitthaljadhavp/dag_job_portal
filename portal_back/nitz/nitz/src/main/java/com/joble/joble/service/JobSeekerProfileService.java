package com.joble.joble.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.joble.joble.model.JobSeekerProfile;
import com.joble.joble.repository.JobSeekerProfileRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class JobSeekerProfileService {

    private final JobSeekerProfileRepository profileRepository;

    @Value("${upload.directory}") // Define in application.properties
    private String uploadDirectory;

    public JobSeekerProfileService(JobSeekerProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    // Save or update job seeker profile with resume
    public JobSeekerProfile saveProfile(JobSeekerProfile profile, MultipartFile profilePicture, MultipartFile resume) {
        try {
            if (profilePicture != null && !profilePicture.isEmpty()) {
                String imageUrl = saveFile(profilePicture, "profile_pictures");
                profile.setProfilePictureUrl(imageUrl);
            }

            if (resume != null && !resume.isEmpty()) {
                String resumeUrl = saveFile(resume, "resumes"); // ✅ Save resume properly
                profile.setResumeUrl(resumeUrl);
            }

            return profileRepository.save(profile);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store files", e);
        }
    }

    // Fetch all profiles
    public List<JobSeekerProfile> getAllProfiles() {
        return profileRepository.findAll();
    }

    // Fetch profile by ID
    public Optional<JobSeekerProfile> getProfileById(Long id) {
        return profileRepository.findById(id);
    }

    // Delete profile
    public void deleteProfile(Long id) {
        profileRepository.deleteById(id);
    }

    // Save files (both profile picture & resume)
    private String saveFile(MultipartFile file, String subDirectory) throws IOException {
        String folderPath = uploadDirectory + File.separator + subDirectory;
        File directory = new File(folderPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        File destinationFile = new File(folderPath + File.separator + filename);
        file.transferTo(destinationFile);

        return "/uploads/" + subDirectory + "/" + filename; // ✅ Return correct URL
    }
}
