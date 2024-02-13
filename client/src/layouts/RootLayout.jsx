import { NavLink, Outlet } from 'react-router-dom';

const NavBar = () => {

  return (
    <div className='navbar'>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/notes">Notes</NavLink>
      <NavLink to="/about">About</NavLink>
    </div>
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
