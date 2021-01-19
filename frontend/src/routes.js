import React from 'react';

//Custom routes
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const ConfigManage = React.lazy(() => import('./views/configMange/ConfigManage'));
const Correlation = React.lazy(() => import('./views/Correlation/Correlation'));
const LoginPage = React.lazy(() => import('./views/pages/login/Login'));

//Abnormal Sub Page

const InitialAccess = React.lazy(() => import('./views/Abnormal/subPages/InitialAccess'));
const Execution = React.lazy(() => import('./views/Abnormal/subPages/Execution'));
const Persistence = React.lazy(() => import('./views/Abnormal/subPages/Persistence'));
const PrivilegeEscalation = React.lazy(() => import('./views/Abnormal/subPages/PrivilegeEscalation'));
const DefenseEvasion = React.lazy(() => import('./views/Abnormal/subPages/DefenseEvasion'));
const CredentialAccess = React.lazy(() => import('./views/Abnormal/subPages/CredentialAccess'));
const Discovery = React.lazy(() => import('./views/Abnormal/subPages/Discovery'));
const LateralMovement = React.lazy(() => import('./views/Abnormal/subPages/LateralMovement'));
const Collection = React.lazy(() => import('./views/Abnormal/subPages/Collection'));
const CommandAndControl = React.lazy(() => import('./views/Abnormal/subPages/CommandAndControl'));
const Exfiltration = React.lazy(() => import('./views/Abnormal/subPages/Exfiltration'));
const Impact = React.lazy(() => import('./views/Abnormal/subPages/Impact'));


const routes = [
  //MainPage 
  { path: '/', exact: true, name: 'HOME' },
  { path: '/dashboard', name: '대시보드', component: Dashboard },
  { path: '/config', name: '형상관리 / etc', component: ConfigManage },
  
  { path: '/correlation', name: '상관분석', component: Correlation },
  
  //User Login & Setting
  { path: '/loginPage', name: 'LoginPage', component: LoginPage },
  { path: '/logoutPage', name: 'LogoutPage', component: LoginPage },

  //subPage
  { path: '/abnormal/initial', name: '이상행위 / Initial Access', component: InitialAccess },
  { path: '/abnormal/execution', name: '이상행위 / Execution', component: Execution },
  { path: '/abnormal/persistence', name: '이상행위 / Persistence', component: Persistence },
  { path: '/abnormal/privilege', name: '이상행위 / Privilege Escalation', component: PrivilegeEscalation },
  { path: '/abnormal/defense', name: '이상행위 / Defense Evasion', component: DefenseEvasion },
  { path: '/abnormal/credential', name: '이상행위 / Credential Access', component: CredentialAccess },
  { path: '/abnormal/discovery', name: '이상행위 / Discovery', component: Discovery },
  { path: '/abnormal/lateral', name: '이상행위 / Lateral Movement', component: LateralMovement },
  { path: '/abnormal/collection', name: '이상행위 / Collection', component: Collection },
  { path: '/abnormal/command', name: '이상행위 / Command And Control', component: CommandAndControl },
  { path: '/abnormal/exfiltration', name: '이상행위 / Exfiltration', component: Exfiltration },
  { path: '/abnormal/impact', name: '이상행위 / Impact', component: Impact },
];

export default routes;
