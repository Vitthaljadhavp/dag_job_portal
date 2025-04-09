package com.joble.joble.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.joble.joble.model.AppliedJobs;
import com.joble.joble.model.User;
import com.joble.joble.model.Job;
import java.util.List;

@Repository
public interface AppliedJobsRepo extends JpaRepository<AppliedJobs, Long> {
    List<AppliedJobs> findByUser(User user);
    List<AppliedJobs> findByJob(Job job);
    boolean existsByUserAndJob(User user, Job job);
}

