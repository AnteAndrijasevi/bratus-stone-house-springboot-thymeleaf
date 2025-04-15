package com.example.bratus.controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    @ResponseBody
    public String handleError(HttpServletRequest request, Model model) {
        StringBuilder errorInfo = new StringBuilder();
        errorInfo.append("<h1>Error Page</h1>");

        // Get error details
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object message = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
        Object exception = request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);

        errorInfo.append("<p>Status: ").append(status != null ? status : "Unknown").append("</p>");
        errorInfo.append("<p>Message: ").append(message != null ? message : "No message available").append("</p>");
        errorInfo.append("<p>Exception: ").append(exception != null ? exception : "No exception info available").append("</p>");

        // Add request information
        errorInfo.append("<h2>Request Information</h2>");
        errorInfo.append("<p>Request URI: ").append(request.getRequestURI()).append("</p>");
        errorInfo.append("<p>Method: ").append(request.getMethod()).append("</p>");
        errorInfo.append("<p>Query String: ").append(request.getQueryString() != null ? request.getQueryString() : "None").append("</p>");

        // Add debugging info - what templates are available?
        errorInfo.append("<h2>Debug Information</h2>");
        errorInfo.append("<p>Requested Template: ").append(request.getAttribute(RequestDispatcher.FORWARD_SERVLET_PATH)).append("</p>");

        return errorInfo.toString();
    }
}