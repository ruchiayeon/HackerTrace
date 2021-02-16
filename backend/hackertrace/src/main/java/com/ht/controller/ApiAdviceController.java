package com.ht.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ht.vo.ResultVO;

@RestControllerAdvice
public class ApiAdviceController {
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResultVO handleValidationExceptions(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getAllErrors().forEach(c -> errors.put(((FieldError) c).getField(), c.getDefaultMessage()));
		
		ResultVO vo = new ResultVO();
		vo.setReturn_code(-1);
		vo.setMsg(String.valueOf(errors));
		vo.setData("");
		
		return vo;
	}


//    @ExceptionHandler(Exception.class) 
//    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
//    protected ResultVO defaultException(HttpServletRequest request, Exception e) {
//    	ResultVO vo = new ResultVO();
//    	vo.setErrCode(-100);
//    	vo.setMsg("���� ������ �߻��Ͽ����ϴ�.");
//        return vo;
//    }
//    

}
