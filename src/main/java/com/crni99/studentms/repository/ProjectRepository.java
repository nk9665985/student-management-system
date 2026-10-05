package com.crni99.studentms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crni99.studentms.model.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

}
