package com.smt.util;

public enum KillChainPhases {

	    Reconnaissance("reconnaissance"),
	    ResourceDevelopment("resource-development"),
		InitialAccess("initial-access"),
		Execution("execution"),
		Persistence("persistence"),
		PrivilegeEscalation("privilege-escalation"),
		DefenseEvasion("defense-evasion"),
		CredentialAccess("credential-access"),
		Discovery("discovery"),
		LateralMovement("lateral-movement"),
		Collection("collection"),
		Exfiltration("exfiltration"),
		CommandAndControl("command-and-control"),
		Impact("impact");
		
		final private String name;
		
		private KillChainPhases(String name) { 
			this.name = name; 
		}
		
		public String getName() { 
			return name; 
		}

}
