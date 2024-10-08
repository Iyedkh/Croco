import { Link, useLocation, useParams } from 'react-router-dom';
import OneProduct from './OneProduct';
import { useState, useEffect } from 'react';
import CrocoTeamStore from './CrocoTeamStore';
import MovingBanner from './MovingBanner';
import { FaFilter } from 'react-icons/fa';

function StoreProducts() {
    const baseUrl = 'http://127.0.0.1:8000/';
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [storeName, setStoreName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showFilters, setShowFilters] = useState(false);

    const { storeId } = useParams();
    const location = useLocation();

    useEffect(() => {
        fetchCategories();
        fetchSubcategories();
        fetchData();
    }, [location.search, storeId, selectedCategory, selectedSubcategory, priceRange]);

    function fetchData() {
        const queryParams = new URLSearchParams(location.search);
        const page = queryParams.get('page') || 1;
        setCurrentPage(page);

        let url = `${baseUrl}Products/?page=${page}&storeId=${storeId}`;

        if (selectedCategory) url += `&category=${selectedCategory}`;
        if (selectedSubcategory) url += `&subcategory=${selectedSubcategory}`;
        if (priceRange.min) url += `&price_min=${priceRange.min}`;
        if (priceRange.max) url += `&price_max=${priceRange.max}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                const filteredProducts = data.results.filter(product => product.store.id === parseInt(storeId));

                if (filteredProducts.length > 0) {
                    setStoreName(filteredProducts[0].store.name);
                } else {
                    setStoreName('');
                }

                setProducts(filteredProducts);
                setTotalPages(Math.ceil(filteredProducts.length / data.results.length));
            })
            .catch((error) => console.error("Error fetching products:", error));
    }

    function fetchCategories() {
        fetch(`${baseUrl}/categories/`)
            .then((response) => response.json())
            .then((data) => setCategories(data));
    }

    function fetchSubcategories() {
        fetch(`${baseUrl}/subcategories/`)
            .then((response) => response.json())
            .then((data) => setSubcategories(data));
    }

    function handlePriceChange(event) {
        const { name, value } = event.target;
        setPriceRange((prevRange) => ({ ...prevRange, [name]: value }));
    }

    function changePage(pageNumber) {
        setCurrentPage(pageNumber);
        fetchData();
    }

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Condition to render Croco Team Store component
    if (storeId === '3') {
        return <CrocoTeamStore />;
    }

    return (
        <div className="div" style={{ width: '100%', height: '100%', marginTop: '190px' }}>
            <MovingBanner />
            <div className="titl">
            <h1 className="text-center text-black mb-5 fw-bold tit" style={{ fontFamily: 'Cursive', fontSize: '30px' }}>
                {storeName ? `Produits ${storeName}` : 'Products'}
            </h1>
            </div>
           


            {/* Filter Icon for Mobile */}
            <div className="text-center mb-3 hide-on-desktop">
                <FaFilter
                    size={24}
                    onClick={() => setShowFilters(!showFilters)}
                    style={{ cursor: 'pointer', color: 'black' }}
                />
            </div>

            {/* Filter Section (Visible if showFilters is true) */}
            {showFilters && (
                <div className="mb-4 p-3 shadow-sm  card">
                    <h5 style={{ fontFamily: 'Impact' }}>Filter Products</h5>
                    
                    {/* Single Filter: Category Filter */}
                    <div className="mb-4">
                        <label htmlFor="category" className="form-label" style={{ fontFamily: 'Impact' }}>Category</label>
                        <select id="category" className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range Filter */}
                    <div className="mb-4">
                        <label htmlFor="price_min" className="form-label" style={{ fontFamily: 'Impact' }}>Price Range</label>
                        <div className="d-flex gap-2">
                            <input
                                type="number"
                                id="price_min"
                                name="min"
                                className="form-control"
                                placeholder="Min"
                                value={priceRange.min}
                                onChange={handlePriceChange}
                            />
                            <input
                                type="number"
                                id="price_max"
                                name="max"
                                className="form-control"
                                placeholder="Max"
                                value={priceRange.max}
                                onChange={handlePriceChange}
                            />
                        </div>
                    </div>

                    <button className="button-30" style={{ fontFamily: 'Impact', borderRadius: '0' }} onClick={() => setShowFilters(false)}>
                        Apply Filters
                    </button>
                </div>
            )}

            {/* Sidebar for Desktop */}
            <div className="sideandpro"
                style={{
                    width: '80%',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '20px',
                }}>
                
                <aside className="col-md-3 d-none d-md-block">
                    <div className="card shadow-sm p-4 mb-5">
                        <h5 className="mb-4" style={{ fontFamily: 'Impact' }}>Filter Products</h5>

                        {/* Single Filter: Category Filter */}
                        <div className="mb-4">
                            <label htmlFor="category" className="form-label" style={{ fontFamily: 'Impact' }}>Category</label>
                            <select id="category" className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range Filter */}
                        <div className="mb-4">
                            <label htmlFor="price_min" className="form-label" style={{ fontFamily: 'Impact' }}>Price Range</label>
                            <div className="d-flex gap-2">
                                <input
                                    type="number"
                                    id="price_min"
                                    name="min"
                                    className="form-control"
                                    placeholder="Min"
                                    value={priceRange.min}
                                    onChange={handlePriceChange}
                                />
                                <input
                                    type="number"
                                    id="price_max"
                                    name="max"
                                    className="form-control"
                                    placeholder="Max"
                                    value={priceRange.max}
                                    onChange={handlePriceChange}
                                />
                            </div>
                        </div>

                        <button className="button-30" style={{ fontFamily: 'Impact', borderRadius: '0' }}>
                            Apply Filters
                        </button>
                    </div>
                </aside>

                {/* Product Listings */}
                <div className="products col-md-9">
                    <div className="row row-cols-1 row-cols-md-4 g-4">
                        {products.map((product) => (
                            <OneProduct key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="pagination mt-4">
                        {pageNumbers.map((pageNumber) => (
                            <button key={pageNumber} onClick={() => changePage(pageNumber)} className="button-30 me-2">
                                {pageNumber}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoreProducts;
