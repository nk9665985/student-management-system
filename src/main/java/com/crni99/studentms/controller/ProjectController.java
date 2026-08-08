package com.crni99.studentms.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.crni99.studentms.model.Project;
import com.crni99.studentms.service.ProjectService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/v1/student-ms/projects")
public class ProjectController {

	private final ProjectService projectService;

	public ProjectController(ProjectService projectService) {
		this.projectService = projectService;
	}

	@PostMapping
	public ResponseEntity<Project> saveSubject(@Valid @RequestBody Project project) {
		Project newProject = projectService.saveProject(project);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newProject.getId())
				.toUri();
		return ResponseEntity.created(location).build();
	}

	@GetMapping()
	public ResponseEntity<List<Project>> getAllProjects() {
		List<Project> projects = projectService.getAllProjects();
		return ResponseEntity.ok(projects);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteProjectById(@PathVariable("id") Long id) {
		projectService.deleteProjectById(id);
		return new ResponseEntity<>(HttpStatus.ACCEPTED);
	}

}
