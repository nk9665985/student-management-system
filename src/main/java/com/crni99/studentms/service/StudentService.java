package com.crni99.studentms.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crni99.studentms.exception.EmailInUseException;
import com.crni99.studentms.exception.EmptyInputException;
import com.crni99.studentms.exception.ProjectNotFoundException;
import com.crni99.studentms.exception.StudentNotFoundException;
import com.crni99.studentms.model.Project;
import com.crni99.studentms.model.Student;
import com.crni99.studentms.repository.ProjectRepository;
import com.crni99.studentms.repository.StudentRepository;

@Service
public class StudentService {

	private final StudentRepository studentRepository;
	private final ProjectRepository projectRepository;

	public StudentService(StudentRepository studentRepository, ProjectRepository projectRepository) {
		this.studentRepository = studentRepository;
		this.projectRepository = projectRepository;
	}

	public Student saveStudent(Student student) {
		Student checkIfStudentWithEmailExist = studentRepository.findStudentByEmail(student.getEmail());
		if (checkIfStudentWithEmailExist != null) {
			throw new EmailInUseException("Email already in use.");
		}
		return studentRepository.save(student);
	}

	public List<Student> getAllStudents() {
		List<Student> students = (List<Student>) studentRepository.findAll();
		if (students.isEmpty()) {
			throw new StudentNotFoundException("Students not found.");
		}
		return students;
	}

	public Student findStudentById(Long id) {
		return studentRepository.findStudentById(id)
				.orElseThrow(() -> new StudentNotFoundException("Student with id: " + id + " does not exist."));
	}

	public Student findStudentByEmail(String email) {
		if (StringUtils.isBlank(email)) {
			throw new EmptyInputException("Email not valid.");
		}
		Student checkIfStudentWithEmailExist = studentRepository.findStudentByEmail(email);
		if (checkIfStudentWithEmailExist == null) {
			throw new StudentNotFoundException("Student with email: " + email + " does not exist.");
		}
		return checkIfStudentWithEmailExist;
	}

	public List<Student> findStudentsByIndexNumber(Integer indexNumber) {
		if (indexNumber == null || indexNumber == 0) {
			throw new EmptyInputException(
					"You need to provide index number of student to be searched. ID can not be 0.");
		}
		List<Student> students = studentRepository.findStudentsByIndexNumber(indexNumber);
		if (students.isEmpty()) {
			throw new StudentNotFoundException("Students with index: " + indexNumber + " does not exist.");
		}
		return students;
	}

	public List<Student> getStudentsBetweenTwoDOB(LocalDate dob1, LocalDate dob2) {
		List<Student> students = studentRepository.findBetweenTwoDOB(dob1, dob2);
		if (students.isEmpty()) {
			throw new StudentNotFoundException("Students do not exist in this dates of birth: " + dob1 + " - " + dob2);
		}
		return students;
	}

	@Transactional
	public Student updateStudentById(Student student, Long id) {
		Student updateStudent = new Student();

		Optional<Student> studentDB = studentRepository.findStudentById(id);
		if (studentDB.isEmpty()) {
			throw new StudentNotFoundException("Student with id: " + id + " does not exist.");
		}
		if (StringUtils.isNotBlank(student.getFirstName())
				&& !Objects.equals(student.getFirstName(), studentDB.get().getFirstName())) {
			updateStudent.setFirstName(student.getFirstName());
		} else {
			updateStudent.setFirstName(studentDB.get().getFirstName());
		}
		if (StringUtils.isNotBlank(student.getLastName())
				&& !Objects.equals(student.getLastName(), studentDB.get().getLastName())) {
			updateStudent.setLastName(student.getLastName());
		} else {
			updateStudent.setLastName(studentDB.get().getLastName());
		}
		if (student.getDateOfBirth() != null
				&& !Objects.equals(student.getDateOfBirth(), studentDB.get().getDateOfBirth())) {
			updateStudent.setDateOfBirth(student.getDateOfBirth());
		} else {
			updateStudent.setDateOfBirth(studentDB.get().getDateOfBirth());
		}
		if (StringUtils.isNotBlank(student.getEmail())
				&& !Objects.equals(student.getEmail(), studentDB.get().getEmail())) {

			Student checkIfStudentWithEmailExist = studentRepository.findStudentByEmail(student.getEmail());
			if (checkIfStudentWithEmailExist != null) {
				throw new EmailInUseException("Email already in use.");
			}
			updateStudent.setEmail(student.getEmail());
		} else {
			updateStudent.setEmail(studentDB.get().getEmail());
		}
		String indexNumberLength = String.valueOf(student.getIndexNumber());
		if (student.getIndexNumber() != null && indexNumberLength.length() > 0
				&& !Objects.equals(student.getIndexNumber(), studentDB.get().getIndexNumber())) {
			updateStudent.setIndexNumber(student.getIndexNumber());
		} else {
			updateStudent.setIndexNumber(studentDB.get().getIndexNumber());
		}
		if (student.getIsOnBudget() != null
				&& !Objects.equals(student.getIsOnBudget(), studentDB.get().getIsOnBudget())) {
			updateStudent.setIsOnBudget(student.getIsOnBudget());
		} else {
			updateStudent.setIsOnBudget(studentDB.get().getIsOnBudget());
		}
		updateStudent.setId(id);
		return studentRepository.save(updateStudent);
	}

	public void deleteStudentById(Long id) {
		if (id == 0) {
			throw new EmptyInputException("You need to provide ID of student to be deleted. ID can not be 0.");
		}
		Optional<Student> checkIfStudentWithIdExist = studentRepository.findById(id);
		if (checkIfStudentWithIdExist.isEmpty()) {
			throw new StudentNotFoundException(
					"Student can not be deleted because student with id: " + id + " does not exist.");
		}
		studentRepository.deleteById(id);
	}

	@Transactional
	public void deleteStudentByEmail(String email) {
		if (StringUtils.isBlank(email)) {
			throw new EmptyInputException("Email not valid.");
		}
		Student checkIfStudentWithEmailExist = studentRepository.findStudentByEmail(email);
		if (checkIfStudentWithEmailExist == null) {
			throw new StudentNotFoundException(
					"Student can not be deleted because student with email: " + email + " does not exist.");
		}
		studentRepository.deleteStudentByEmail(email);
	}

	public Project createProjectForStudent(Long id, Project project) {
		Optional<Student> student = studentRepository.findStudentById(id);
		if (student.isEmpty()) {
			throw new StudentNotFoundException("Student with id: " + id + " does not exist.");
		}
		project.setStudent(student.get());
		Project savedProject = projectRepository.save(project);
		return savedProject;
	}

	public List<Project> getProjectsByIdForStudentById(Long id) {
		Optional<Student> student = studentRepository.findStudentById(id);
		if (student.isEmpty()) {
			throw new StudentNotFoundException("Student with id: " + id + " does not exist.");
		}
		return student.get().getProjects();
	}

	public Project getProjectByIdForStudentById(Long studentId, Long projectId) {
		Optional<Student> student = studentRepository.findStudentById(studentId);
		if (student.isEmpty()) {
			throw new StudentNotFoundException("Student with id: " + studentId + " does not exist.");
		}
		List<Project> projects = student.get().getProjects();
		for (Project p : projects) {
			if (p.getId() == projectId) {
				return p;
			}
		}
		throw new ProjectNotFoundException("Project with id: " + projectId + " does not exist.");
	}

}