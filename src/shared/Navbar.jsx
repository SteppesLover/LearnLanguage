import { NavLink } from 'react-router-dom';

function Navbar() {
  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#4ea8ff' : '#f5f5f5',
    textDecoration: 'none',
    fontWeight: isActive ? '600' : '400',
    transition: 'color 0.3s ease',
  });

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        padding: '1rem',
        borderBottom: '1px solid #333',
      }}
    >
      <NavLink to="/" style={linkStyle}>
        About
      </NavLink>
      <NavLink to="/repeat" style={linkStyle}>
        Repeat
      </NavLink>
      <NavLink to="/mixed" style={linkStyle}>
        Mixed
      </NavLink>
      <NavLink to="/settings" style={linkStyle}>
        Settings
      </NavLink>
    </nav>
  );
}

export default Navbar;
