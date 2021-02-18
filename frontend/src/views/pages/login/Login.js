import React, {/*useContext*/ useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from "axios"
import Context from "../../Context"
import HOSTIPNAME from "../../../config"

const Login = () => { 
  const [loginData, setLoginData] = useState({
    password: "",
    userId: ""
  })

  const { password, userId } = loginData;

  function handlerChange(e){
    const { value, name } = e.target;
    setLoginData({
    ...loginData,
    [name]:value
    });
  };

  function submitValue(){
    Loginfunc(password,userId)
  }
  const Loginfunc = async(password,userId) => {
    try{
      const response = await axios.post(
        `http://${HOSTIPNAME}/ht/login/user`,
        {
          password: password,
          userId: userId
        }
      )
      if(response.data.return_code === 0){
        return document.location.href="#/dashboard" 
      }else{
        alert("아이디또는 비밀번호가 틀렸습니다.")
      }
    }catch(e){

    }
  }


  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <Context.Provider onChange={handlerChange} value={userId} name="userId" id="userId">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Hacker Trace 로그인</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="ID" autoComplete="ID" onChange={handlerChange} name="userId" value={userId} id="userId"/>

                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" onChange={handlerChange} name="password" value={password} id="password"/>
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" onClick={()=>submitValue()} className="px-4">Login</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
     </Context.Provider>
      
    </div>
  )
}

export default Login
