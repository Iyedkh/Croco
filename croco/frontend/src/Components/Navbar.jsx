import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { UserContext, CartContext } from './Context';

function Navbar() {
    const userContext = useContext(UserContext);
    const { cartData } = useContext(CartContext);
    const [isScrolled, setIsScrolled] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false); // For mobile menu toggle
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            setIsScrolled(scrollTop > 50);
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/Categories/');
                const data = await response.json();
                setCategories(data.results);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        window.addEventListener('scroll', handleScroll);
        fetchCategories();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const cartItems = cartData ? cartData.length : 0;

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Search term:', searchTerm);
    };

    return (
        <nav className={`navbar navbar-expand-lg ${location.pathname === '/' ? 'navbar-home' : 'navbar-other'} ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container">
                
                <Link className="navbar-brand" to="/">
                    <img src="/CROCO-2.png" alt="Logo" className="navbar-logo" />
                </Link>

                <div className={`search-bar ${open ? 'show-search' : ''}`}>
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search for your product"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>
                </div>
                
                <button className="navbar-toggler " type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
                    <span className="fa fa-bars"style={{ color: 'white' }}></span>
                </button>

                <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/">Accueil</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Catégories
                            </a>
                            <ul className="dropdown-menu">
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <Link className="dropdown-item" to={`/Category/${category.title}/${category.id}`}>
                                            {category.title}
                                        </Link>
                                        <ul className="dropdown-submenu">
                                            {category.subcategories.map((subcategory) => (
                                                <li key={subcategory.id}>
                                                    <Link className="dropdown-item" to={`/Category/${category.title}/${subcategory.title}/${subcategory.id}`}>
                                                        {subcategory.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Shops
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/Stores/1">Croco Nutrition</Link></li>
                                <li><Link className="dropdown-item" to="/Stores/2">Croco Wear</Link></li>
                                <li><Link className="dropdown-item" to="/Stores/3">Croco Team</Link></li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Buyer Panel
                            </a>
                            <ul className="dropdown-menu">
                                {!userContext &&
                                    <>
                                        <li><Link className="dropdown-item" to="/Buyer/Register">Register</Link></li>
                                        <li><Link className="dropdown-item" to="/Buyer/Login">Login</Link></li>
                                    </>
                                }
                                {userContext &&
                                    <>
                                        <li><Link className="dropdown-item" to="/Buyer/Dashboard">Account</Link></li>
                                        <li><Link className="dropdown-item" to="/Buyer/Logout">Logout</Link></li>
                                    </>
                                }
                            </ul>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/Cart">
                                <i className="fa-solid fa-cart-shopping"></i> {cartItems}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
