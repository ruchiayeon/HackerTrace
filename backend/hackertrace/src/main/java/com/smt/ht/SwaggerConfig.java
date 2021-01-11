package com.smt.ht;

import java.nio.charset.Charset;

import javax.servlet.Filter;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.filter.CharacterEncodingFilter;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.oas.annotations.EnableOpenApi;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
@EnableAutoConfiguration
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
				  .description("Hacker Trace Manager API 문서입니다.")
				  .contact(new Contact("", "", "seonhak@smtechnology.kr"))
				  .version("1.0.0")
				  .build();
	}
	
	

    @Bean
    public HttpMessageConverter<String> responseBodyConverter() {
        return new StringHttpMessageConverter(Charset.forName("UTF-8"));
    }
 

}
