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
  //  badge: {
   //   color: 'info',
    //  text: 'NEW',
   // }
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['형상관리']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: '형상관리',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: '/etc/',
        to: '/config',
      }
    ]
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['이상행위']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: '이상행위',
    route: '/abnormal/initial',
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
      },
      /*{
        _tag: 'CSidebarNavItem',
        name: 'Progress',
        to: '/base/progress-bar',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Switches',
        to: '/base/switches',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Tables',
        to: '/base/tables',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Tabs',
        to: '/base/tabs',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Tooltips',
        to: '/base/tooltips',
      },*/
    ],
  },
  {
    _tag: 'CSidebarNavItem',
    name: '상관분석',
    to: '/correlation',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
  //  badge: {
   //   color: 'info',
    //  text: 'NEW',
   // }
  },
  /*{
    _tag: 'CSidebarNavDropdown',
    name: 'Buttons',
    route: '/buttons',
    icon: 'cil-cursor',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Buttons',
        to: '/buttons/buttons',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Brand buttons',
        to: '/buttons/brand-buttons',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Buttons groups',
        to: '/buttons/button-groups',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Dropdowns',
        to: '/buttons/button-dropdowns',
      }
    ],
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Charts',
    to: '/charts',
    icon: 'cil-chart-pie'
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Icons',
    route: '/icons',
    icon: 'cil-star',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'CoreUI Free',
        to: '/icons/coreui-icons',
        badge: {
          color: 'success',
          text: 'NEW',
        },
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'CoreUI Flags',
        to: '/icons/flags',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'CoreUI Brands',
        to: '/icons/brands',
      },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Notifications',
    route: '/notifications',
    icon: 'cil-bell',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Alerts',
        to: '/notifications/alerts',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Badges',
        to: '/notifications/badges',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Modal',
        to: '/notifications/modals',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Toaster',
        to: '/notifications/toaster'
      }
    ]
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Widgets',
    to: '/widgets',
    icon: 'cil-calculator',
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    _tag: 'CSidebarNavDivider'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Extras'],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Pages',
    route: '/pages',
    icon: 'cil-star',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Login',
        to: '/login',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Register',
        to: '/register',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Error 404',
        to: '/404',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Disabled',
    icon: 'cil-ban',
    badge: {
      color: 'secondary',
      text: 'NEW',
    },
    addLinkClass: 'c-disabled',
    'disabled': true
  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Labels']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Label danger',
    to: '',
    icon: {
      name: 'cil-star',
      className: 'text-danger'
    },
    label: true
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Label info',
    to: '',
    icon: {
      name: 'cil-star',
      className: 'text-info'
    },
    label: true
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Label warning',
    to: '',
    icon: {
      name: 'cil-star',
      className: 'text-warning'
    },
    label: true
  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2'
  }*/
]

export default _nav
