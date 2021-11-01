import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';

import Link from 'next/link';
import Router from 'next/router';
import nProgress from 'nprogress';

import { APP_NAME } from '../config';
import { signOut, isAuth } from '../actions/auth';
import Search from './blog/Search';
import HeaderDrawer from './header/header';

Router.onRouteChangeStart = url => nProgress.start();
Router.onRouteChangeComplete = url => nProgress.done();
Router.onRouteChangeError = url => nProgress.done();

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isSticky, setIsSticky] = useState(false);

  const handleStateChange = (status) => {
    if (status.status === Sticky.STATUS_FIXED) {
      setIsSticky(true);
    } else if (status.status === Sticky.STATUS_ORIGINAL) {
      setIsSticky(false);
    }
  };

  const toggle = () => setIsOpen(!isOpen);

  return (
    <React.Fragment>
      <Navbar color="light" light expand="md">
        <Link href="/">
            <NavbarBrand className="font-weight-bold" >{APP_NAME}</NavbarBrand>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav  className="ml-auto" navbar>
            <React.Fragment>
                <NavItem>
                    <Link href="/blogs">
                        <NavLink >Blogs</NavLink>
                    </Link>
                </NavItem>
                <NavItem>
                    <Link href="/contact">
                        <NavLink >Contact</NavLink>
                    </Link>
                </NavItem>
            </React.Fragment>

            {!isAuth() && (
                <React.Fragment>
                <NavItem>
                    <Link href="/signin">
                        <NavLink >SingIn</NavLink>
                    </Link>
                </NavItem>
                <NavItem>
                    <Link href="/signup">
                        <NavLink >SingUp</NavLink>
                    </Link>
                </NavItem>
                </React.Fragment>
            )}
            {isAuth() && (
                <React.Fragment>
                    <NavItem>
                        <NavLink style={{
                            cursor: 'pointer'
                        }} onClick = {() => {
                            if (isAuth() && isAuth().role === 1) {
                                Router.push('/admin');
                            } else {
                                Router.push('/user');
                            }
                        }}> {`${isAuth().name}'s DashBoard`}</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink style={{
                            cursor: 'pointer'
                        }} onClick = {() => signOut(() => Router.replace('/signin'))}>SingOut</NavLink>
                    </NavItem>
                </React.Fragment>
            )}
            <NavItem>
                    <a href="/user/crud/blog" className="btn btn-primary font-light" >Write a blog</a>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </React.Fragment>
  );
}

export default Header;