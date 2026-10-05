package com.crni99.studentms.controller;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.crni99.studentms.model.Project;
import com.crni99.studentms.model.Student;
import com.crni99.studentms.service.StudentService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Past;

@Validated
@RestController
@RequestMapping("api/v1/student-ms/students")
public class StudentController {

	private final StudentService studentService;

	public StudentController(StudentService studentService) {
		this.studentService = studentService;
	}

	@PostMapping
	public ResponseEntity<Student> saveStudent(@Valid @RequestBody Student student) {
		Student newStudent = studentService.saveStudent(student);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newStudent.getId())
				.toUri();
		return ResponseEntity.created(location).build();
	}

	@GetMapping()
	public ResponseEntity<List<Student>> getAllStudents() {
		List<Student> students = studentService.getAllStudents();
		return ResponseEntity.ok(students);
	}

	@GetMapping("/find/id/{studentId}")
	public ResponseEntity<Student> findStudentById(@PathVariable("studentId") Long id) {
		Student student = studentService.findStudentById(id);
		return ResponseEntity.ok(student);
	}

	@GetMapping("/find/email/{studentEmail}")
	public ResponseEntity<Student> findStudentByEmail(
			@PathVariable("studentEmail") @Email(message = "{student.email.notValid}") String email) {
		Student student = studentService.findStudentByEmail(email);
		return ResponseEntity.ok(student);
	}

	@GetMapping("/find/index/{studentIndexNumber}")
	public ResponseEntity<List<Student>> findStudentsByIndexNumber(
			@PathVariable("studentIndexNumber") @Min(value = 1, message = "{student.indexNumber.maxSize}") @Max(value = 99999999, message = "{student.indexNumber.maxSize}") Integer indexNumber) {
		List<Student> students = studentService.findStudentsByIndexNumber(indexNumber);
		return ResponseEntity.ok(students);
	}

	@GetMapping("/find/date-of-birth")
	public ResponseEntity<List<Student>> getStudentsBetweenTwoDOB(
			@RequestParam("dob1") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @Past(message = "{student.dateOfBirth.past}") LocalDate dob1,
			@RequestParam("dob2") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @Past(message = "{student.dateOfBirth.past}") LocalDate dob2) {
		List<Student> students = studentService.getStudentsBetweenTwoDOB(dob1, dob2);
		return ResponseEntity.ok(students);
	}

	@PutMapping("/{studentId}")
	public ResponseEntity<Student> updateStudentById(@RequestBody Student student, @PathVariable("studentId") Long id) {
		Student updated = studentService.updateStudentById(student, id);
		return ResponseEntity.accepted().body(updated);
	}

	@DeleteMapping("/{studentId}")
	public ResponseEntity<?> deleteStudentById(@PathVariable("studentId") Long id) {
		studentService.deleteStudentById(id);
		return new ResponseEntity<>(HttpStatus.ACCEPTED);
	}

	@DeleteMapping("/delete-with-email/{studentEmail}")
	public ResponseEntity<?> deleteStudentByEmail(
			@PathVariable("studentEmail") @Email(message = "{student.email.notValid}") String email) {
		studentService.deleteStudentByEmail(email);
		return new ResponseEntity<>(HttpStatus.ACCEPTED);
	}

	@PostMapping("/{studentId}/projects")
	public ResponseEntity<List<Project>> createProjectForStudent(@PathVariable("studentId") Long id,
			@Valid @RequestBody Project project) {
		Project savedProject = studentService.createProjectForStudent(id, project);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
				.buildAndExpand(savedProject.getId()).toUri();
		return ResponseEntity.created(location).build();
	}

	@GetMapping("/{studentId}/projects")
	public ResponseEntity<List<Project>> getProjectsByIdForStudentById(@PathVariable("studentId") Long id) {
		List<Project> projects = studentService.getProjectsByIdForStudentById(id);
		return ResponseEntity.ok(projects);
	}

	@GetMapping("/{studentId}/projects/{projectId}")
	public ResponseEntity<Project> getProjectByIdForStudentById(@PathVariable("studentId") Long studentId,
			@PathVariable("projectId") Long projectId) {
		Project project = studentService.getProjectByIdForStudentById(studentId, projectId);
		return ResponseEntity.ok(project);
	}

}