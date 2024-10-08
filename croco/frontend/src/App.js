import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { NotificationProvider } from './Components/NotificationContext.jsx';
import { CartContext } from './Components/Context';
import { useState } from 'react';
import './App.css';



import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import BackgroundAnimation from './Components/BackgroundAnimation';
import Home from './Components/Home';
import Products from './Components/Products';
import ProductDetail from './Components/ProductDetail';
import Categories from './Components/Categories';
import Subcategory from './Components/Subcategory';
import SubcategoryProducts from './Components/SubcategoryProducts';
import CategoryProduct from './Components/CategoryProduct';
import Cart from './Components/Cart';
import ConfirmOrder from './Components/ConfirmOrder';
import TagProducts from './Components/TagProducts';
import NewOrders from './Components/NewOrders.jsx';
import Ordersuccess from './Components/Ordersuccess';
import Orderfailure from './Components/Orderfailure';
import Register from './Components/Buyer/Register';
import Login from './Components/Buyer/Login';
import BuyerLogout from './Components/Buyer/BuyerLogout';
import Dashboard from './Components/Buyer/Dashboard';
import Orders from './Components/Buyer/Orders';
import Wishlist from './Components/Buyer/Wishlist';
import Profile from './Components/Buyer/Profile';
import Changepwd from './Components/Buyer/Changepwd';
import Addresses from './Components/Buyer/Addresses';
import Addaddress from './Components/Buyer/Addaddress';
import PasswordReset from './Components/Buyer/PasswordReset';
import PasswordChange from './Components/Buyer/PasswordChange.js';
import VendorRegister from './Components/Vendor/VendorRegister';
import VendorLogin from './Components/Vendor/VendorLogin';
import VendorLogout from './Components/Vendor/VendorLogout';
import VendorDashboard from './Components/Vendor/VendorDashboard';
import VendorProducts from './Components/Vendor/VendorProducts';
import VendorAddProduct from './Components/Vendor/AddProduct';
import EditProduct from './Components/Vendor/EditProduct';
import VendorOrders from './Components/Vendor/VendorOrders';
import Customers from './Components/Vendor/Customers';
import StoreEmployee from './Components/Vendor/StoreEmployee';
import AddEmployee from './Components/Vendor/AddEmployee';
import Reports from './Components/Vendor/Reports';
import VendorProfile from './Components/Vendor/VendorProfile';
import ChangePass from './Components/Vendor/ChangePass';
import About from './Components/About.js';
import Contact from './Components/Contact.js';
import MovingBanner from './Components/MovingBanner'; 
import CrocoNutritionProducts from './Components/CrocoNutritionProducts.jsx';
import CrocoTeamProducts from './Components/CrocoTeamProducts.js';
import CrocoWearProducts from './Components/CrocoWearProducts.js';
import StoreProducts from './Components/StoreProducts.jsx';


const checkCart = localStorage.getItem('cartData');

function App() {
    const [cartData, setCartData] = useState(JSON.parse(checkCart));
    const location = useLocation();

    return (
        <CartContext.Provider value={{ cartData, setCartData }}>
            <NotificationProvider>
                <>
                {location.pathname === '/' && <MovingBanner />}               
                    <Navbar />
                    <BackgroundAnimation>
                        <Routes>
                            {/* Main Routes */}
                            
                            <Route path='/' element={<Home />} />
                            <Route path='/Products' element={<Products />} />
                            <Route path='/Categories' element={<Categories />} />
                            <Route path='/Category/:Category_slug/:Category_id' element={<CategoryProduct />} />
                            <Route path="/Subcategory/:subcategoryId/products" element={<SubcategoryProducts />} />
                            <Route path='/Subcategory' element={<Subcategory />} />
                            <Route path='/Products/:tag' element={<TagProducts />} />
                            <Route path='/Product/:Product_slug/:Product_id' element={<ProductDetail />} />
                            <Route path='Cart' element={<Cart />} />
                            <Route path='Confirm-Order' element={<ConfirmOrder />} />
                            <Route path='/NewOrders' element={<NewOrders />} />
                            <Route path='/Order/success' element={<Ordersuccess />} />
                            <Route path='/Order/failure' element={<Orderfailure />} />
                            <Route path='/About' element={<About />} />
                            <Route path='/Contact' element={<Contact />} />
                            <Route path="/stores/1/products" element={<CrocoNutritionProducts />} />
                            <Route path="/stores/2/products" element={<CrocoWearProducts />} />
                            <Route path="/stores/3/products" element={<CrocoTeamProducts />} />
                            <Route path="/Stores/:storeId" element={<StoreProducts />} />
                            


                            {/* Buyer Routes */}
                            <Route path='/Buyer/Register' element={<Register />} />
                            <Route path='/Buyer/Login' element={<Login />} />
                            <Route path='/Buyer/Logout' element={<BuyerLogout />} />
                            <Route path='/Buyer/Dashboard' element={<Dashboard />} />
                            <Route path='/Buyer/Orders' element={<Orders />} />
                            <Route path='/Buyer/Wishlist' element={<Wishlist />} />
                            <Route path='/Buyer/Profile' element={<Profile />} />
                            <Route path='/Buyer/Changepwd' element={<Changepwd />} />
                            <Route path='/Buyer/Addresses' element={<Addresses />} />
                            <Route path='/Buyer/Addaddress' element={<Addaddress />} />
                            <Route path='/Buyer/PasswordReset' element={<PasswordReset />} />
                            <Route path='/Buyer/PasswordChange' element={<PasswordChange />} />

                            {/* Vendor Routes */}
                            <Route path='/Vendor/Register' element={<VendorRegister />} />
                            <Route path='/Vendor/Login' element={<VendorLogin />} />
                            <Route path='/Vendor/Logout' element={<VendorLogout />} />
                            <Route path='/Vendor/Dashboard' element={<VendorDashboard />} />
                            <Route path='/Vendor/Products' element={<VendorProducts />} />
                            <Route path='/Vendor/AddProduct' element={<VendorAddProduct />} />
                            <Route path='/Vendor/Orders' element={<VendorOrders />} />
                            <Route path='/Vendor/Customers' element={<Customers />} />
                            <Route path='/Vendor/StoreEmployee' element={<StoreEmployee />} />
                            <Route path='/Vendor/AddEmployee' element={<AddEmployee />} />
                            <Route path='/Vendor/EditProduct/:id' element={<EditProduct />} />
                            <Route path='/Vendor/Reports' element={<Reports />} />
                            <Route path='/Vendor/Profile' element={<VendorProfile />} />
                            <Route path='/Vendor/ChangePass' element={<ChangePass />} />
                        </Routes>
                    </BackgroundAnimation>
                    {/* Render Footer only for main routes */}
                    {['/', '/Products', '/Categories', '/Category/:Category_slug/:Category_id', '/Subcategory/:subcategoryId/products', '/Subcategory', '/Products/:tag', '/Product/:Product_slug/:Product_id', '/Confirm-Order', '/NewOrders', '/Order/success', '/Order/failure'].includes(location.pathname) && <Footer />}
                </>
            </NotificationProvider>
        </CartContext.Provider>
    );
}

export default App;