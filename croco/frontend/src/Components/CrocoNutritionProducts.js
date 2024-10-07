import { Link, useLocation, useParams } from 'react-router-dom';
import OneProduct from './OneProduct';
import { useState, useEffect } from 'react';

function CrocoNutritionProducts() {
    const baseUrl = 'http://127.0.0.1:8000/';
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const { storeId } = useParams();
    const location = useLocation();

    useEffect(() => {
        fetchCategories();
        fetchSubcategories();
        fetchData();
    }, [location.search, storeId, selectedCategory, selectedSubcategory, priceRange]);

    const fetchData = () => {
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
                setProducts(filteredProducts);
                setTotalPages(Math.ceil(data.count / 10)); // Changed to use data.count for pagination
            })
            .catch((error) => console.error("Error fetching products:", error));
    };

    const fetchCategories = () => {
        fetch(`${baseUrl}/categories/`)
            .then((response) => response.json())
            .then((data) => setCategories(data));
    };

    const fetchSubcategories = () => {
        fetch(`${baseUrl}/subcategories/`)
            .then((response) => response.json())
            .then((data) => setSubcategories(data));
    };

    const handlePriceChange = (event) => {
        const { name, value } = event.target;
        setPriceRange((prevRange) => ({ ...prevRange, [name]: value }));
    };

    const changePage = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchData();
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <section className="container mt-5 products-page">
            <h3 className="text-center text-white mb-5" style={{ fontFamily: 'Impact', fontSize: '30px' }}>
                Produits Croco Nutrition
            </h3>
            <div className="row">
                <aside className="col-md-3">
                    <div className="card shadow-sm p-4 mb-5">
                        <h5 className="mb-4" style={{ fontFamily: 'Impact' }}>Filter Products</h5>
                        <div className="mb-4">
                            <label htmlFor="category" className="form-label" style={{ fontFamily: 'Impact' }}>Category</label>
                            <select id="category" className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="subcategory" className="form-label" style={{ fontFamily: 'Impact' }}>Subcategory</label>
                            <select id="subcategory" className="form-select" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
                                <option value="">All Subcategories</option>
                                {subcategories.map((subcategory) => (
                                    <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price_min" className="form-label" style={{ fontFamily: 'Impact' }}>Price Range</label>
                            <div className="d-flex gap-2">
                                <input type="number" id="price_min" name="min" className="form-control" placeholder="Min" value={priceRange.min} onChange={handlePriceChange} />
                                <input type="number" id="price_max" name="max" className="form-control" placeholder="Max" value={priceRange.max} onChange={handlePriceChange} />
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ fontFamily: 'Impact', borderRadius: '0' }}>Apply Filters</button>
                    </div>
                </aside>
                <div className="col-md-9">
                    <div className="row mb-4" style={{ fontFamily: 'Trebuchet MS', fontSize: '18px', color: 'black' }}>
                        {products.map((product) => <OneProduct key={product.id} product={product} currentPage={currentPage} />)}
                    </div>
                    {totalPages > 1 && (
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-center">
                                {pageNumbers.map((pageNumber) => (
                                    <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                        <Link onClick={() => changePage(pageNumber)} to={`/Stores/${storeId}/Nutrition?page=${pageNumber}`} className="page-link">{pageNumber}</Link>
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

export default CrocoNutritionProducts;