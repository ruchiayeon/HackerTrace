import React,{ createContext, useState } from "react"

const Context = createContext({
	state: {userId: "admin"},
	action: {
		setadmin: () => {}
	}
});

const ContextProvider = () => {
	const [userId, setUserId] = useState("admin");

	const value = {
		state: {userId},
		action:{setUserId}
	}

	return(
		<Context.Provider value={value}/>
	)
}

const {Consumer: ContextConsumer} = Context

export {ContextProvider, ContextConsumer};

export default Context;
