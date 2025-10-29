import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <NavLink to="/" style={({ isActive }) => ({ color: isActive ? 'blue' : 'black' })}>
        About
      </NavLink>
      <NavLink to="/repeat" style={({ isActive }) => ({ color: isActive ? 'blue' : 'black' })}>
        Repeat
      </NavLink>
      <NavLink to="/mixed" style={({ isActive }) => ({ color: isActive ? 'blue' : 'black' })}>
        Mixed
      </NavLink>
      <NavLink to="/settings" style={({ isActive }) => ({ color: isActive ? 'blue' : 'black' })}>
        Settings
      </NavLink>
    </nav>
  );
}

export default Navbar;

