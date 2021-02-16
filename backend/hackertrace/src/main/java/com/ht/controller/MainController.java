package com.ht.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ht.util.APIUtil;
import com.ht.vo.ResultVO;

import io.swagger.annotations.Api;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Api(value = "MainController", description = "테스트 API")
public class MainController {
	
	/**
	 * {"message":"Tue Jan 26 19:26:36 2021 Normal: Calling rsync with filter-list of new/modified files/dirs"}
		{"message":"/td-agent/td-agent.conf"}
		{"message":"/td-agent/"}
		{"message":"/"}
		{"message":"Tue Jan 26 19:26:37 2021 Normal: Finished a list after exitcode: 0"}
		{"message":"Tue Jan 26 19:26:38 2021 Normal: Calling rsync with filter-list of new/modified files/dirs"}
		{"message":"/td-agent/td-agent.conf"}
		{"message":"/td-agent/"}
		{"message":"/"}
		{"message":"Tue Jan 26 19:26:38 2021 Normal: Finished a list after exitcode: 0"}
	 * @param hostIp
	 * @param req
	 * @return
	 */

	@RequestMapping(value = "/index", method = RequestMethod.POST, produces = "application/json", consumes = MediaType.ALL_VALUE)
	public ResultVO main(@RequestParam("host_ip") String hostIp, @RequestBody String req) {
		
	    
		System.out.println("index()");
		System.out.println(hostIp);
		System.out.println(req);
		
		return APIUtil.resResult(0, "success", "");
	}
	
}
