import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavTitle',
    _children: ['대시보드']
  },
  {
    _tag: 'CSidebarNavItem',
    name: '대시보드',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['유저행위']
  },
  {
    _tag: 'CSidebarNavItem',
    name: '유저행위',
    to:'/config',
    icon: 'cil-puzzle'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['감사로그']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: '감사로그',
    route:'/abnormal/initial',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Initial Access',
        to: '/abnormal/initial',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Execution',
        to: '/abnormal/execution',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Persistence',
        to: '/abnormal/persistence',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Privilege Escalation',
        to: '/abnormal/privilege',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Defense Evasion',
        to: '/abnormal/defense',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Credential Access',
        to: '/abnormal/credential',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Discovery',
        to: '/abnormal/discovery',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Lateral Movement',
        to: '/abnormal/lateral',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Collection',
        to: '/abnormal/collection',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Command and Control',
        to: '/abnormal/command',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Exfiltration',
        to: '/abnormal/exfiltration',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Impact',
        to: '/abnormal/impact',
      }
    ],
  },
  {
    _tag: 'CSidebarNavItem',
    name: '상관분석',
    to: '/correlation',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['모니터링']
  },
  {
    _tag: 'CSidebarNavItem',
    name: '모니터링',
    to: '/monitor',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
  }
]

export default _nav
