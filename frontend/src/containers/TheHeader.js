import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CLink,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react'

// routes config
import routes from '../routes'

import { 
  TheHeaderDropdown
}  from './index'

const TheHeader = () => {
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
          <CHeaderNavLink to="/abnormal">이상행위</CHeaderNavLink>
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
            <CLink className="c-subheader-nav-link"href="#">
           
            <CHeaderNavItem>HOST NAME {"&"} IP</CHeaderNavItem>
        
        <CDropdown >
          <CDropdownToggle caret>
             HOST 목록  
          </CDropdownToggle>
          <CDropdownMenu>
         
           {/* <CDropdownItem disabled>Action Disabled</CDropdownItem>*/}
            <CDropdownItem>Host Name<br/> {"&"} IP</CDropdownItem>
            <CDropdownItem divider />
            <CDropdownItem>Host Name<br/> {"&"} IP</CDropdownItem>
            <CDropdownItem divider />
            <CDropdownItem>Host Name<br/> {"&"} IP</CDropdownItem>
            <CDropdownItem divider />
            <CDropdownItem>Host Name<br/> {"&"} IP</CDropdownItem>
            
          </CDropdownMenu>
        </CDropdown>
     
            </CLink>
          </div>
      </CSubheader>
    </CHeader>
  )
}

export default TheHeader
