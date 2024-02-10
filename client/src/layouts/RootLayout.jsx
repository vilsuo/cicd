import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const NavBar = () => {

  return (
    <React.Fragment>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
    </React.Fragment>
  );
};

const RootLayout = () => {
  return (
    <div className="root-layout">
      <header>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
