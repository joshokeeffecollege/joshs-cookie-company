import {Link} from 'react-router-dom';

function Navbar() {
    return (
        <header style={{padding: '1rem', borderBottom: '1px solid #ddd'}}>
            <nav style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                <h1 style={{marginRight: '2rem'}}>Josh&apos;s Cookie Company</h1>
                <Link to="/">Home</Link>
                <Link to="/cookies">Cookies</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/login">Login</Link>
                <Link to="/regiser">Register</Link>
            </nav>
        </header>
    );
}

export default Navbar;
