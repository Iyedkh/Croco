import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CartContext } from './Context'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const randomImages = [
    '/kkkl.webp', 
    '/111.webp',
    '/qq.jpg',
    '/ww.jfif'
];

function Home() {
    const [stores, setStores] = useState([]);
    const [products, setProducts] = useState([]);
    const { setCartData } = useContext(CartContext); 
    const [wishlistData, setWishlistData] = useState([]);

    useEffect(() => {
        const fetchStores = fetch('http://localhost:8000/Stores/');
        const fetchProducts = fetch('http://127.0.0.1:8000/Products/?fetch_limit=8');

        Promise.all([fetchStores, fetchProducts])
            .then(async ([storesResponse, productsResponse]) => {
                const storesData = await storesResponse.json();
                const productsData = await productsResponse.json();
                setStores(storesData.results || []);
                setProducts(productsData.results || []);
            })
            .catch(error => console.error('Error fetching data:', error));

        const storedWishlist = JSON.parse(localStorage.getItem('wishlistData')) || [];
        setWishlistData(storedWishlist);

        const storedCart = JSON.parse(localStorage.getItem('cartData')) || [];
        setCartData(storedCart);
    }, [setCartData]);

    const cartAddButtonHandler = (product) => {
        const previousCart = JSON.parse(localStorage.getItem('cartData')) || [];
        const cartData = {
            product: {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
            },
            quantity: 1,
            user: { id: 1 },
        };
        const updatedCartJson = [...previousCart, cartData];
        localStorage.setItem('cartData', JSON.stringify(updatedCartJson));
        setCartData(updatedCartJson);
    };

    const addToWishlistHandler = (product) => {
        const updatedWishlist = [...wishlistData, product];
        setWishlistData(updatedWishlist);
        localStorage.setItem('wishlistData', JSON.stringify(updatedWishlist));
    };

    const swiperSettings = {
        spaceBetween: 30,
        slidesPerView: 1.5, // Full-width on mobile
        loop: true,
        breakpoints: {
            640: { slidesPerView: 1.5 }, // Full-width on small screens
            768: { slidesPerView: 2 }, // Two products on medium screens
            1024: { slidesPerView: 4 }, // Four products on large screens
        },
    };

    const storeSwiperSettings = {
        spaceBetween: 0,
        slidesPerView: 1.5, // Full-width for stores on mobile
        loop: false,
        breakpoints: {
            640: { slidesPerView: 1.5}, // Full-width on mobile
            768: { slidesPerView: 2 }, // Two stores on medium screens
            1024: { slidesPerView: 3 }, // Three stores on large screens
        },
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <main className="container-fluid p-0" style={{ marginTop: '140px' }}> {/* Adjust the margin to match your navbar height */}
            {/* Image Slider */}
            <div className="slider-container mb-4" style={{ width: '100vw', overflow: 'hidden' }}> {/* Full-width container */}
                <Slider {...settings}>
                    {randomImages.map((image, index) => (
                        <div key={index} className="slider-item">
                            <img 
                                src={image} 
                                alt={`Random ${index}`} 
                                className="img-fluid w-100" 
                                style={{ height: "100vh", width: '100vw', objectFit: "cover" }} 
                            />
                        </div>
                    ))}
                </Slider>
            </div>

            {/* Latest Products with Swiper */}
            <h1 className="text-center text-white mb-4 display-4 "style={{ fontSize: '3rem', fontWeight: 'bold' }}>Nos produits</h1>
            <div className="row justify-content-center m-4">
                <Swiper {...swiperSettings}>
                    {products.map((product) => (
                        <SwiperSlide key={product.id} className="mb-4 ">
                            <div className="card h-90 text-center ">
                                <Link to={`/product/${product.title}/${product.id}`}>
                                    <img src={product.image} alt={product.title} className="card-img-top img-fluid h-auto" />
                                </Link>
                                <div className="card-body ">
                                    <h5 className="card-title">
                                        <Link className="text-dark text-decoration-none" to={`/product/${product.title}/${product.id}`}>
                                            {product.title}
                                        </Link>
                                    </h5>
                                    <h5 className="text-primary">Price: {product.price} DT</h5>
                                </div>
                                <div className="card-footer d-flex flex-column gap-1 ">
                                    <button className="btn btn-success btn-sm" onClick={() => cartAddButtonHandler(product)}>
                                        <i className="fa-solid fa-cart-plus"> Ajouter au panier</i>
                                    </button>
                                    <button className="btn btn-warning btn-sm" onClick={() => addToWishlistHandler(product)}>
                                        <i className="fa-solid fa-heart"> liste de souhaits</i>
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Stores Section in Swiper */}
            <h1 className="text-center my-5 text-white" style={{ fontSize: '3rem', fontWeight: 'bold' }}>Nos boutiques</h1>
                <div className="row justify-content-center mr-0">
                    <Swiper {...storeSwiperSettings}>
                        {stores.map(store => (
                            <SwiperSlide key={store.id} className="text-center mb-4">
                                <Link to={`/Stores/${store.id}`}>
                                    <img
                                        src={store.image || '/default-store.jpg'}
                                        alt={store.name}
                                        className="rounded-circle img-fluid"
                                        style={{ width: '70%', height: 'auto' }}  
                                    />
                                </Link>
                                <p className="mt-2 text-white" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{store.name}</p>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

        </main>
    );
}

export default Home;
