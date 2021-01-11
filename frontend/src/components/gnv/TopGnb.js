//Components Link
import React, { Component } from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom' 
import {Navbar,Nav,Form,NavDropdown}from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

//page Link
import Dashboard from '../dashboard/Dashboard'
import ConfigManage from '../configmanage/ConfigManage'
import Abnormal from '../abnormal/Abnomal'
import Correlation from '../correlation/Correlation'
import NotFound from '../error/NotFound'

//image Link 
import logo from '../../images/logo.png'

export class TopGnb extends Component {
    render() {
        return (
            <>
            <Router>
            <Navbar bg="bold" expand="lg">
                <Navbar.Brand href="/">
                  <img
                    src={logo}
                    width="30"
                    heigh="30"
                    alt='logo' 
                  />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                    <Nav.Link href="/configmanage">형상관리</Nav.Link>
                    <Nav.Link href="/abnormal">이상행위</Nav.Link>
                    <Nav.Link href="/correlation">상관분석</Nav.Link> 
                    </Nav>
                    <Form inline>
                    
                        <NavDropdown title="사용자 이름" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/">My profile</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/">Sign out</NavDropdown.Item>
                        </NavDropdown>
                    </Form>
                </Navbar.Collapse>
                </Navbar>

            <main>
                <Switch>
                    <Route exact path="/" component={Dashboard}/>
                    <Route exact path="/dashboard" component={Dashboard}/>
                    <Route exact path="/configmanage" component={ConfigManage}/>
                    <Route exact path="/abnormal" component={Abnormal}/>
                    <Route exact path="/correlation" component={Correlation}/>
                    <Route component={NotFound}/>
                </Switch>

            </main>
            </Router>  

            </>
        )
    }
}








export default TopGnb
