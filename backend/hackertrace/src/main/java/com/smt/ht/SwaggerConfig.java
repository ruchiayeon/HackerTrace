package com.smt.ht;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.oas.annotations.EnableOpenApi;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
@EnableOpenApi
public class SwaggerConfig {
	
	@Bean
    public Docket api() {
		return new Docket(DocumentationType.SWAGGER_2)
				  .select()                                  
				  .apis(RequestHandlerSelectors.basePackage("com.smt.controller"))
		          .paths(PathSelectors.any())                          
		          .build()
		          .apiInfo(getApiInfo()); 
    }
	
	private ApiInfo getApiInfo() {
		return new ApiInfoBuilder()
				  .title("Hacker Trace API")
				  .description("Hacker Trace Manager API¿‘¥œ¥Ÿ.")
				  .contact(new Contact("", "", "seonhak@smtechnology.kr"))
				  .version("1.0.0")
				  .build();
	}


}
