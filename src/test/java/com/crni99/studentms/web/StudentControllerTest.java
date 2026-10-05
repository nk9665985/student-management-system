package com.crni99.studentms.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.crni99.studentms.controller.StudentController;
import com.crni99.studentms.model.Student;
import com.crni99.studentms.service.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(StudentController.class)
class StudentControllerTest {

	private static final Long ID_1 = 1L;
	private static final String FIRST_NAME_1 = "Ognjen";
	private static final String LAST_NAME_1 = "Andjelic";
	private static final LocalDate DOB_1 = LocalDate.of(1999, 12, 01);
	private static final String EMAIL_1 = "andjelicb.ognjen@gmail.com";
	private static final Integer INDEX_1 = 183;
	private static final Boolean IS_ON_BUDGET_1 = true;

	private static final Long ID_2 = 2L;
	private static final String FIRST_NAME_2 = "Nikola";
	private static final String LAST_NAME_2 = "Petrovic";
	private static final LocalDate DOB_2 = LocalDate.of(1999, 8, 25);
	private static final String EMAIL_2 = "nikola@gmail.com";
	private static final Integer INDEX_2 = 169;
	private static final Boolean IS_ON_BUDGET_2 = false;

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockBean
	private StudentService studentService;

	private StudentController studentController;

	@BeforeEach
	void setUp() {
		studentController = new StudentController(studentService);
	}

	@Test
	void testStudentController() {
	}

	@Test
	void shouldSaveStudent() {
		Student student = new Student(ID_1, FIRST_NAME_1, LAST_NAME_1, DOB_1, EMAIL_1, INDEX_1, IS_ON_BUDGET_1);
		studentController.saveStudent(student);

		ArgumentCaptor<Student> studentArgumentCaptor = ArgumentCaptor.forClass(Student.class);
		verify(studentService).saveStudent(studentArgumentCaptor.capture());

		Student capturetStudent = studentArgumentCaptor.getValue();
		assertThat(capturetStudent).isEqualTo(student);
	}

	@Test
	void shouldGetAllStudents() throws Exception {
		List<Student> students = new ArrayList<>();
		students.add(new Student(ID_1, FIRST_NAME_1, LAST_NAME_1, DOB_1, EMAIL_1, INDEX_1, IS_ON_BUDGET_1));
		students.add(new Student(ID_2, FIRST_NAME_2, LAST_NAME_2, DOB_2, EMAIL_2, INDEX_2, IS_ON_BUDGET_2));

		when(studentService.getAllStudents()).thenReturn(students);

		String url = "/api/v1/student-ms/all";
		MvcResult mvcResult = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();
		String actualResponse = mvcResult.getResponse().getContentAsString();

		String expectedResponse = objectMapper.writeValueAsString(students);

		assertThat(actualResponse).isEqualTo(expectedResponse);
	}

	@Test
	void shouldFindStudentById() throws Exception {
		Student student = new Student(ID_1, FIRST_NAME_1, LAST_NAME_1, DOB_1, EMAIL_1, INDEX_1, IS_ON_BUDGET_1);

		when(studentService.findStudentById(ID_1)).thenReturn(student);
		String url = "/api/v1/student-ms/find/1";

		MvcResult mvcResult = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();
		String actualResponse = mvcResult.getResponse().getContentAsString();

		String expectedResponse = objectMapper.writeValueAsString(student);

		assertThat(actualResponse).isEqualTo(expectedResponse);
	}

	@Test
	void shouldFindStudentByEmail() throws Exception {
		Student student = new Student(ID_1, FIRST_NAME_1, LAST_NAME_1, DOB_1, EMAIL_1, INDEX_1, IS_ON_BUDGET_1);

		when(studentService.findStudentByEmail(EMAIL_1)).thenReturn(student);
		String url = "/api/v1/student-ms/email/andjelicb.ognjen@gmail.com";

		MvcResult mvcResult = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();
		String actualResponse = mvcResult.getResponse().getContentAsString();

		String expectedResponse = objectMapper.writeValueAsString(student);

		assertThat(actualResponse).isEqualTo(expectedResponse);
	}

	@Test
	void shouldFindStudentByIndexNumber() throws Exception {
		List<Student> students = new ArrayList<>();
		Student student1 = new Student(ID_1, FIRST_NAME_1, LAST_NAME_1, DOB_1, EMAIL_1, INDEX_1, IS_ON_BUDGET_1);
		Student student2 = new Student(ID_2, FIRST_NAME_2, LAST_NAME_2, DOB_2, EMAIL_2, INDEX_2, IS_ON_BUDGET_2);
		students.add(student1);
		students.add(student2);

		when(studentService.findStudentsByIndexNumber(INDEX_1)).thenReturn(students);
		String url = "/api/v1/student-ms/index/183";

		MvcResult mvcResult = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();
		String actualResponse = mvcResult.getResponse().getContentAsString();

		String expectedResponse = objectMapper.writeValueAsString(students);

		assertThat(actualResponse).isEqualTo(expectedResponse);
	}

	@Test
	void shouldGetStudentsBetweenTwoDOB() throws Exception {
		LocalDate date1 = LocalDate.of(1998, 8, 25);
		LocalDate date2 = LocalDate.of(2000, 12, 01);

		List<Student> students = new ArrayList<>();
		students.add(new Student(ID_1, FIRST_NAME_1, LAST_NAME_1, DOB_1, EMAIL_1, INDEX_1, IS_ON_BUDGET_1));
		students.add(new Student(ID_2, FIRST_NAME_2, LAST_NAME_2, DOB_2, EMAIL_2, INDEX_2, IS_ON_BUDGET_2));

		when(studentService.getStudentsBetweenTwoDOB(date1, date2)).thenReturn(students);

		String url = "/api/v1/student-ms/date-of-birth?dob1=1998-08-25&dob2=2000-12-01";
		MvcResult mvcResult = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();
		String actualResponse = mvcResult.getResponse().getContentAsString();

		String expectedResponse = objectMapper.writeValueAsString(students);

		assertThat(actualResponse).isEqualTo(expectedResponse);
	}

	@Test
	void shouldUpdateStudentById() throws Exception {
		Student student = new Student();
		student.setId(1L);
		student.setFirstName("John");

		when(studentService.updateStudentById(ArgumentMatchers.any(), ArgumentMatchers.any()))
				.thenReturn(student);
		String json = objectMapper.writeValueAsString(student);

		String url = "/api/v1/student-ms/update/1";
		mockMvc.perform(put(url).contentType(MediaType.APPLICATION_JSON).characterEncoding("utf-8").content(json)
				.accept(MediaType.APPLICATION_JSON)).andExpect(status().isAccepted())
				.andExpect(jsonPath("$.id", Matchers.equalTo(1)))
				.andExpect(jsonPath("$.firstName", Matchers.equalTo("John")));
	}

	@Test
	void shouldDeleteStudentById() throws Exception {
		doNothing().when(studentService).deleteStudentById(ID_1);

		String url = "/api/v1/student-ms/delete/1";
		mockMvc.perform(delete(url)).andExpect(status().isAccepted());

		verify(studentService, times(1)).deleteStudentById(ID_1);
	}

	@Test
	void shouldDeleteStudentByEmail() throws Exception {
		doNothing().when(studentService).deleteStudentByEmail(EMAIL_1);

		String url = "/api/v1/student-ms/delete-with-email//andjelicb.ognjen@gmail.com";
		mockMvc.perform(delete(url)).andExpect(status().isAccepted());

		verify(studentService, times(1)).deleteStudentByEmail(EMAIL_1);
	}

}
