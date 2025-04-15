package com.example.bratus.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index"; // Make sure this matches your template name without .html
    }

    @GetMapping("/about")
    public String about() {
        return "about"; // Make sure you have an about.html template
    }

    // Add a test endpoint to diagnose issues
    @GetMapping("/test")
    @ResponseBody
    public String test() {
        return "The application is working correctly!";
    }
}