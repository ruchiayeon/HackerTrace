package com.smt.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.smt.vo.ResultVO;

@RestControllerAdvice
public class ApiAdviceController {

//    @ExceptionHandler(Exception.class) 
//    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
//    protected ResultVO defaultException(HttpServletRequest request, Exception e) {
//    	ResultVO vo = new ResultVO();
//    	vo.setErrCode(-100);
//    	vo.setMsg("서버 에러가 발생하였습니다.");
//        return vo;
//    }
//    
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

}
