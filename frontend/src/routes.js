import React from 'react';

const Toaster = React.lazy(() => import('./views/notifications/toaster/Toaster'));
const Tables = React.lazy(() => import('./views/base/tables/Tables'));

const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/base/cards/Cards'));
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'));
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'));
const BasicForms = React.lazy(() => import('./views/base/forms/BasicForms'));

const Jumbotrons = React.lazy(() => import('./views/base/jumbotrons/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'));
const Navbars = React.lazy(() => import('./views/base/navbars/Navbars'));
const Navs = React.lazy(() => import('./views/base/navs/Navs'));
const Paginations = React.lazy(() => import('./views/base/paginations/Pagnations'));
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'));
const ProgressBar = React.lazy(() => import('./views/base/progress-bar/ProgressBar'));
const Switches = React.lazy(() => import('./views/base/switches/Switches'));

const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'));
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/buttons/brand-buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/buttons/button-dropdowns/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'));
const Charts = React.lazy(() => import('./views/charts/Charts'));

const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/icons/flags/Flags'));
const Brands = React.lazy(() => import('./views/icons/brands/Brands'));
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'));
const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
const Typography = React.lazy(() => import('./views/theme/typography/Typography'));
const Widgets = React.lazy(() => import('./views/widgets/Widgets'));
const Users = React.lazy(() => import('./views/users/Users'));
const User = React.lazy(() => import('./views/users/User'));

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
const Loading = React.lazy(() => import('../src/views/pages/Loading/Loading'));

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
  







  { path: '/loading', name: 'Theme', component: Loading, exact: true },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', name: 'Base', component: Cards, exact: true },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/forms', name: 'Forms', component: BasicForms },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', name: 'Buttons', component: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/brands', name: 'Brands', component: Brands },
  { path: '/notifications', name: 'Notifications', component: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/notifications/toaster', name: 'Toaster', component: Toaster },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User }
];

export default routes;
