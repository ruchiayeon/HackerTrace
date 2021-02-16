package com.ht.ht;

import org.springframework.util.StringUtils;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class WebMvcConfig implements WebMvcConfigurer{

	private final String baseUrl;

	  public WebMvcConfig(String baseUrl) {
	    this.baseUrl = baseUrl;
	  }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");
//        registry.addResourceHandler("/webjars/**/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
    	 String baseUrl = StringUtils.trimTrailingCharacter(this.baseUrl, '/');
    	    registry.
    	        addResourceHandler(baseUrl + "/swagger-ui/**")
    	        .addResourceLocations("classpath:/META-INF/resources/webjars/springfox-swagger-ui/")
    	        .resourceChain(false);
        
    }
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
//        registry.addViewController("/swagger-ui/").setViewName("forward:/swagger-ui/index.html");
    }
}
