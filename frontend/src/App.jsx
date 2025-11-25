import {Routes, Route} from 'react-router-dom';

import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Account from './pages/Account.jsx';
import Users from './pages/Users.jsx';
import Cookies from './pages/Cookies.jsx';
import CookieDetail from './pages/CookieDetail.jsx';
import Cart from './pages/Cart.jsx';

function App() {
    return (
        <div className="app">
            <Navbar/>

            <main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/cookies" element={<Cookies/>}/>
                    <Route path="/cookies/:id" element={<CookieDetail/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/account" element={<Account/>}/>
                    <Route path="/debug/users" element={<Users/>}/> {/* Insecure debug page */}
                </Routes>
            </main>

            <Footer/>
        </div>
    );
}

export default App;
