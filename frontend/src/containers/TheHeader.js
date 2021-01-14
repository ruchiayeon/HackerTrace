import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CFormGroup,
  CSelect,
  CCol
} from '@coreui/react'

// routes config
import routes from '../routes'

import {TheHeaderDropdown}  from './index'

function TheHeader() {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  //host Ip받아오는 부분
  const [hostDatas, setHostDatas] = useState(null);

  useEffect(()=>{
    const hostResData = async() => {
    try{
      setLoading(true);
      //axios를 이용하여 해당 url에서 갑을 받아온다.
      const response = await axios.get(
          'http://210.114.18.175:8080/ht/host/list'
      )
      //받아온 값을 setMiterData에 넣어준다.
      
      setHostDatas(response.data.data);
      //console.log(response.data);

    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e);
      console.log(e)
    }
      //로딩 실패시 flag를 달아서 이동
      setLoading(false);
    };
    hostResData();
  }, []);
  if(loading) return <div>로딩중</div>;
  if(error) return <div>에러</div>;
  if(!hostDatas) return <div>일치하는 데이터가 없습니다.</div>;

  function submitValue() {
    alert(`${hostDatas}`)
  }



  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
       {/* <CIcon name="logo" height="48" alt="Logo"/>*/}
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-3" >
          <CHeaderNavLink to="/dashboard">대시보드</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem  className="px-3">
          <CHeaderNavLink to="/config">형상관리</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/abnormal/initial">이상행위</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/correlation">상관분석</CHeaderNavLink>
        </CHeaderNavItem>
      </CHeaderNav>

      <CHeaderNav className="px-3">
        <TheHeaderDropdown/>
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
      <CBreadcrumbRouter 
        className="border-0 c-subheader-nav m-0 px-0 px-md-3" 
        routes={routes} 
      />
        <div className="d-md-down-none mfe-2 c-subheader-nav">
          <CCol md="12">
            <CFormGroup>
              <CSelect custom name="hostIpAName" id="hostIpAName">
                {hostDatas.map((item, index) => {
                  return <option key={index} value={item.hostIp} onClick={submitValue}>{item.hostName}({item.hostIp})</option>
                })}
              </CSelect>
            </CFormGroup>
          </CCol>
        </div>
      </CSubheader>
    </CHeader>
  )
}

export default TheHeader
