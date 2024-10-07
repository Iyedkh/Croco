import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import VendorSidebar from './VendorSidebar';
import Chart from 'chart.js/auto';

const baseUrl = 'http://127.0.0.1:8000/';

function VendorDashboard(props) {
    const [totalProductsByCategory, setTotalProductsByCategory] = useState({});
    const [totalProductsBySubcategory, setTotalProductsBySubcategory] = useState({});
    const [totalProducts, setTotalProducts] = useState(0); // State to hold total number of products
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [vendorProducts, setVendorProducts] = useState([]);
    const [filteredOrderItems, setFilteredOrderItems] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [chartTypeCategory, setChartTypeCategory] = useState('bar'); // State to hold selected chart type for category chart
    const [chartTypeSubcategory, setChartTypeSubcategory] = useState('bar'); // State to hold selected chart type for subcategory chart
    const categoryChartRef = useRef(null); // Reference to the category chart instance
    const subcategoryChartRef = useRef(null); // Reference to the subcategory chart instance
    const vendorId = localStorage.getItem('vendor_id');
    const [vendorName, setVendorName] = useState('');
    const [vendorProfileImageUrl, setVendorProfileImageUrl] = useState('');




    useEffect(() => {
        if (vendorId) {
            fetchCategoriesAndProducts(`${baseUrl}/Categories/`, `${baseUrl}/Products/`, vendorId);
            fetchOrdersAndOrderItems(vendorId);
        }
    }, [vendorId]);

    function fetchCategoriesAndProducts(categoriesUrl, productsUrl, vendorId) {
        axios.all([
            axios.get(categoriesUrl),
            axios.get(productsUrl, { params: { vendor: vendorId } })
        ])
        .then(axios.spread((categoriesResponse, productsResponse) => {
            const categories = categoriesResponse.data.results;
            const vendorProducts = productsResponse.data.results.filter(product => product.Vendor === Number(vendorId));

            const productsByCategory = groupProductsByCategory(vendorProducts);
            setTotalProductsByCategory(productsByCategory);

            const productsBySubcategory = groupProductsBySubcategory(vendorProducts, categories);
            setTotalProductsBySubcategory(productsBySubcategory);

            // Set the total number of products
            setTotalProducts(vendorProducts.length);
        }))
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }

    function fetchOrdersAndOrderItems(vendorId) {
        axios.all([
            axios.get(`${baseUrl}Products/?Vendor=${vendorId}`),
            axios.get(`${baseUrl}OrderItems/`),
            axios.get(`${baseUrl}Orders/`),
            axios.get(`${baseUrl}Buyers/`)
        ])
        .then(axios.spread((productsResponse, orderItemsResponse, ordersResponse, buyersResponse) => {
            const vendorProducts = productsResponse.data.results;
            setVendorProducts(vendorProducts);

            const orderItems = orderItemsResponse.data.results;
            setOrderItems(orderItems);

            const orders = ordersResponse.data.results;
            setOrders(orders);

            const buyersMap = {};
            buyersResponse.data.results.forEach(buyer => {
                buyersMap[buyer.id] = buyer.user.username;
            });

            const filteredItems = orderItems.filter(item =>
                vendorProducts.some(product => product.id === item.Product && product.Vendor === parseInt(vendorId))
            );
            setFilteredOrderItems(filteredItems);
            setRowCount(calculateTotalRows(filteredItems));
        }))
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }

    function groupProductsByCategory(products) {
        const categories = {}; // Use an object to store categories
    
        products.forEach(product => {
            product.tag_list.forEach(category => {
                // Check if it's a category (not a subcategory)
                if (!categories[category]) {
                    categories[category] = 1;
                } else {
                    categories[category]++;
                }
            });
        });
    
        return categories;
    }
    

    function groupProductsBySubcategory(products, categories) {
        const subcategoryMap = {};
        categories.forEach(category => {
            category.subcategories.forEach(subcategory => {
                subcategoryMap[subcategory.id] = subcategory.title;
            });
        });

        const productsBySubcategory = {};
        products.forEach(product => {
            const subcategoryName = subcategoryMap[product.subcategory];
            if (subcategoryName) {
                if (!productsBySubcategory[subcategoryName]) {
                    productsBySubcategory[subcategoryName] = 1;
                } else {
                    productsBySubcategory[subcategoryName]++;
                }
            }
        });
        return productsBySubcategory;
    }

    function calculateTotalRows(items) {
        let total = 0;
        items.forEach(item => {
            total += item.tag_list ? item.tag_list.length : 1; // Check if tag_list exists
        });
        return total;
    }

    useEffect(() => {
        // Create category chart when totalProductsByCategory changes
        if (categoryChartRef.current) {
            categoryChartRef.current.destroy(); // Destroy previous chart
        }
        createCategoryChart();
    }, [totalProductsByCategory, chartTypeCategory]);

    useEffect(() => {
        if (subcategoryChartRef.current) {
            subcategoryChartRef.current.destroy(); 
        }
        createSubcategoryChart();
    }, [totalProductsBySubcategory, chartTypeSubcategory]);

    function createCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        categoryChartRef.current = new Chart(ctx, {
            type: chartTypeCategory,
            data: {
                labels: Object.keys(totalProductsByCategory),
                datasets: [{
                    label: 'Total products by Category',
                    data: Object.values(totalProductsByCategory),
                    backgroundColor: 'rgba(239, 207, 227, 1)',
                    borderColor: 'rgba(0, 0, 0)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function createSubcategoryChart() {
        const ctx = document.getElementById('subcategoryChart');
        const chartData = {
            labels: Object.keys(totalProductsBySubcategory),
            datasets: [{
                label: 'Total Products by Subcategory',
                data: Object.values(totalProductsBySubcategory),
                backgroundColor: 'rgba(213, 184, 255, 1)',
                borderColor: 'rgba(0, 0, 0)',
                borderWidth: 1
            }]
        };
        const chartOptions = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        const selectedChartType = chartTypeSubcategory;

        switch (selectedChartType) {
            case 'bar':
                subcategoryChartRef.current = new Chart(ctx, {
                    type: 'bar',
                    data: chartData,
                    options: chartOptions
                });
                break;
            case 'line':
                subcategoryChartRef.current = new Chart(ctx, {
                    type: 'line',
                    data:
                    chartData,
                    options: chartOptions
                });
                break
                case 'pie':
                    subcategoryChartRef.current = new Chart(ctx, {
                        type: 'pie',
                        data: chartData,
                        options: chartOptions
                    });
                    break;
                default:
                    // Default to bar chart if no valid type is provided
                    subcategoryChartRef.current = new Chart(ctx, {
                        type: 'bar',
                        data: chartData,
                        options: chartOptions
                    });
            }
        }
    
        function downloadCSV(data, filename) {
            const csvData = new Blob([data], { type: 'text/csv' });
            const csvUrl = window.URL.createObjectURL(csvData);
            const link = document.createElement('a');
            link.href = csvUrl;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    
        function renderDownloadButton(data, chartName) {
            const csvData = convertToCSV(data);
            const filename = `${chartName}.csv`;
            return (
                <button className="btn btn-secondary mt-2 btn-sm " onClick={() => downloadCSV(csvData, filename)}>Download as CSV</button>
            );
        }
    
        function convertToCSV(data) {
            let csv = '';
            data.forEach(row => {
                csv += row.join(',') + '\n';
            });
            return csv;
        }


        useEffect(() => {
            if (vendorId) {
                fetchVendorData();
            }
        }, [vendorId]);
    
        // Function to fetch vendor data
        const fetchVendorData = async () => {
            try {
                const response = await axios.get(`${baseUrl}Vendor/${vendorId}/`);
                setVendorName(response.data.user.username);
                setVendorProfileImageUrl(response.data.profile_img);
            } catch (error) {
                console.error('Error fetching vendor data:', error);
            }
        };
    
        return (
            <section className='container mt-5'>
                <div className='row'>
                    <div className='col-md-3 col-12'>
                        <VendorSidebar />
                    </div>

                    <div className='col-md-9 mb-1' style={{ marginTop: '-25px' }}>
                        <div className='card1' style={{ marginTop: '-4px' }}>
                            <div className='card-body d-flex align-items-center justify-content-start' style={{ fontFamily: 'Trebuchet MS', fontWeight: 'bold', color: '#000000' }}>
                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                                    <h4 className='card-title mb-0' style={{ fontFamily: 'Trebuchet MS', fontSize: '18px', fontWeight: 'bold', marginRight: '20px' }}>
                                        Welcome {vendorName}
                                    </h4>
                                    {vendorProfileImageUrl && (
                                        <img src={vendorProfileImageUrl} alt="Vendor Profile" className="img-fluid rounded-circle" style={{ height: '50px', width: '50px', borderRadius: '50%' }} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className='col-md-9 col-12 mb-2' style={{ marginTop: '-130px', marginLeft: '320px' }}>
                        <div className='row'>
                            <div className='col-md-6 mb-2'>
                                <div className='card shadow-sm' style={{ backgroundColor: '#ffffff' }}>
                                    <div className='card-body text-center' style={{ fontFamily: 'Trebuchet MS', fontWeight: 'bold', color: '#000000' }}>
                                        <h5 style={{ fontWeight: 'bold'}}>Total Products</h5>
                                        <a href="http://localhost:3000/Vendor/Products" style={{ textDecoration: 'none', color: '#284387' }}>
                                            <p className='card-text' style={{ color: '#284387', fontSize: '20px' }}>{totalProducts}</p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6 mb-2'>
                                <div className='card shadow-sm' style={{ backgroundColor: '#ffffff' }}>
                                    <div className='card-body text-center' style={{ fontFamily: 'Trebuchet MS',fontWeight: 'bold', color: '#000000' }}>
                                        <h5 style={{ fontWeight: 'bold'}}>Total Orders on products</h5>
                                        <a href="http://localhost:3000/Vendor/Orders" style={{ textDecoration: 'none', color: '#284387' }}>
                                            <p className='card-text' style={{ fontSize: '20px' }}>{rowCount}</p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6 mb-2'>
                                <div className='card shadow-sm' style={{ backgroundColor: '#ffffff' }}>
                                    <div className='card-body'>
                                        {/* Dropdown menu for selecting chart type */}
                                        <label style={{ fontFamily: 'Trebuchet MS',fontSize: '13px',fontWeight: 'bold', color: '#000000' }} htmlFor="chartTypeCategory">Chart Type:</label>
                                        <select style={{ fontFamily: 'Trebuchet MS',fontSize: '13px',fontWeight: 'bold', color: '#000000' }} id="chartTypeCategory" value={chartTypeCategory} onChange={(e) => setChartTypeCategory(e.target.value)}>
                                            <option value="bar">Bar</option>
                                            <option value="line">Line</option>
                                            <option value="pie">Pie</option>
                                        </select>
                                        <canvas id='categoryChart' style={{ height: '200px' }}></canvas>
                                        {renderDownloadButton(Object.entries(totalProductsByCategory), 'CategoryChart')}
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6 mb-2'>
                                <div className='card shadow-sm' style={{ backgroundColor: '#ffffff' }}>
                                    <div className='card-body'>
                                        {/* Dropdown menu for selecting chart type */}
                                        <label style={{ fontFamily: 'Trebuchet MS',fontSize: '13px',fontWeight: 'bold', color: '#000000' }} htmlFor="chartTypeSubcategory">Chart Type:</label>
                                        <select style={{ fontFamily: 'Trebuchet MS',fontSize: '13px',fontWeight: 'bold', color: '#000000' }} id="chartTypeSubcategory" value={chartTypeSubcategory} onChange={(e) => setChartTypeSubcategory(e.target.value)}>
                                            <option value="bar">Bar</option>
                                            <option value="line">Line</option>
                                            <option value="pie">Pie</option>
                                        </select>
                                        <canvas id='subcategoryChart' style={{ height: '200px' }}></canvas>
                                        {renderDownloadButton(Object.entries(totalProductsBySubcategory), 'SubcategoryChart')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
    
    export default VendorDashboard;
    