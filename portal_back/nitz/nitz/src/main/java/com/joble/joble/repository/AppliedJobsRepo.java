package com.joble.joble.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.joble.joble.model.AppliedJobs;
import com.joble.joble.model.User;
import com.joble.joble.model.Job;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppliedJobsRepo extends JpaRepository<AppliedJobs, Long> {
    List<AppliedJobs> findByUser(User user);
    List<AppliedJobs> findByJob(Job job);
    List<AppliedJobs> findByUserId(Long userId);
    List<AppliedJobs> findByJobId(Long jobId);

    // Optional: To prevent multiple applications for the same job by the same user
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
    boolean existsByUserAndJob(User user, Job job);
    
    
}

