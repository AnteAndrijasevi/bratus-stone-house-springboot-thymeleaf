package com.example.bratus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // omogući @Scheduled
public class BratusApplication {

    public static void main(String[] args) {
        SpringApplication.run(BratusApplication.class, args);
    }
}
