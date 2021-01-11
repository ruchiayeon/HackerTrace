package com.smt.vo;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuditLogVO {

	private String type;
	private String node;
	private String msg;
	private String time;
	private String arch;
	private Integer syscall;
	private String success;
	private Integer exit; 
	private List<String> arguments; //a0 ~ aN°³ 
	private Integer items; 
	private Integer ppid; 
	private Integer pid; 
	private Integer auid;
	private Integer uid; 
	private Integer gid; 
	private Integer euid; 
	private Integer suid; 
	private Integer fsuid; 
	private Integer egid; 
	private Integer sgid;
	private Integer fsgind; 
	private String tty; 
	private Integer ses; 
	private String comm; 
	private String exe; 
	private String subj; 
	private String key;
	private String proctitle;
	private String name;
	
}
