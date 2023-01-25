package com.appleparty.ssily;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class SsilyApplication {

	public static void main(String[] args) {
		SpringApplication.run(SsilyApplication.class, args);
	}

}
