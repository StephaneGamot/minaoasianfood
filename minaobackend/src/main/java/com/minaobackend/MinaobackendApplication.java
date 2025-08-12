package com.minaobackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;


@SpringBootApplication
@ConfigurationPropertiesScan(basePackages = "com.minaobackend.config")

public class MinaobackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MinaobackendApplication.class, args);
	}

}

