package com.crni99.studentms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * The frontend is a React single-page app (built by Vite into
 * src/main/resources/static). React Router handles navigation client-side,
 * but a hard refresh or a direct link to e.g. /students is a real HTTP GET
 * that Spring Boot would otherwise 404 on, since no such static file exists.
 * This just forwards those known frontend routes back to index.html so the
 * SPA can boot and take over routing itself.
 */
@Controller
public class SpaForwardController {

	@GetMapping({ "/login", "/signup", "/students", "/search", "/students/{studentId}/projects" })
	public String forwardToApp() {
		return "forward:/index.html";
	}
}
