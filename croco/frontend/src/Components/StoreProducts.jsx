import { Link, useLocation, useParams } from 'react-router-dom';
import OneProduct from './OneProduct';
import { useState, useEffect } from 'react';
import CrocoTeamStore from './CrocoTeamStore'; // Import the new component
import MovingBanner from './MovingBanner';
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
    if (storeId === '3') { // Croco Team Store ID
        return <CrocoTeamStore />;
    }

    return (
        <section className="container mt-5 products-page">
            <MovingBanner></MovingBanner>
            {/* Store name heading */}
            <h3 className="text-center text-white mb-5" style={{ fontFamily: 'Impact', fontSize: '30px' }}>
                {storeName ? `Produits ${storeName}` : 'Products'}
            </h3>

            <div className="row">
                {/* Start Sidebar Filters */}
                
                <aside className="col-md-3">
                    <div className="card shadow-sm p-4 mb-5">
                        <h5 className="mb-4" style={{ fontFamily: 'Impact' }}>Filter Products</h5>

                        {/* Category Filter */}
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

                        {/* Subcategory Filter */}
                        <div className="mb-4">
                            <label htmlFor="subcategory" className="form-label" style={{ fontFamily: 'Impact' }}>Subcategory</label>
                            <select id="subcategory" className="form-select" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
                                <option value="">All Subcategories</option>
                                {subcategories.map((subcategory) => (
                                    <option key={subcategory.id} value={subcategory.id}>
                                        {subcategory.name}
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

                {/* End Sidebar Filters */}

                {/* Product Listing */}
                <div className="col-md-9">
                    <div className="row mb-4" style={{ fontFamily: 'Trebuchet MS', fontSize: '18px', color: 'black' }}>
                        {products.map((product) => <OneProduct key={product.id} product={product} currentPage={currentPage} />)}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-center">
                                {pageNumbers.map((pageNumber) => (
                                    <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                        <Link onClick={() => changePage(pageNumber)} to={`/Stores/${storeId}?page=${pageNumber}`} className="page-link">{pageNumber}</Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </section>
    );
}

export default StoreProducts;
