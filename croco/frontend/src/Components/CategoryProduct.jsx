import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CategoryProduct.css'; // Import your CSS file for styling
import MovingBanner from './MovingBanner';
function CategoryProducts(props) {
    const baseUrl = 'http://127.0.0.1:8000/';
    const [subcategories, setSubcategories] = useState([]);
    const { Category_id } = useParams();

    useEffect(() => {
        fetchSubcategories(baseUrl + `Category/${Category_id}/Subcategories/`);
    }, [Category_id]);

    function fetchSubcategories(url) {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setSubcategories(data.results);
            });
    }

    return (
        <div style={{display: 'flex', justifyContent:'center', height:'100%', width:'100%'}}>
             <section className="container  category-product-container" style={{marginTop:'180px', height:'100%', width:'100%'}}>
            <MovingBanner></MovingBanner>
            <div className="titl">
                <h3 className='tit' style={{ fontFamily: 'Trebuchet MS', fontSize: '30px', color: 'black', textAlign: 'center',fontWeight:'bold' }}> Subcategories </h3>
            </div>
            
            <div className='row mb-2' style={{width:'100%', height:'100%',display:'flex', justifyContent:'center'}}>
                <div style={{ marginBottom: '33px',  }}></div>
                {subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="col-md-3 mb-4">
                        <div className="card card-hover"> {/* Added class 'card-hover' */}
                            <img 
                                src={subcategory.image} 
                                className="card-img-top" 
                                alt={subcategory.title} 
                                style={{ 
                                    maxWidth: '95%', 
                                    height: '100%',   
                                    margin: '15px auto 0', 
                                    display: 'block', 
                                    objectFit: 'contain', 
                                    objectPosition: 'center',
                                    borderRadius: '10px' 
                                }} 
                            />
                            <div className="card-body">
                                <h5 className="card-title" style={{ fontSize: '1rem' }}>{subcategory.title}</h5>
                                <p className="card-text" style={{ fontSize: '14px', fontFamily: 'Trebuchet MS', color: 'black' }}>{subcategory.detail}</p>
                                <Link 
                                    to={`/Subcategory/${subcategory.id}/products`} 
                                    className="btn btn-success" 
                                    style={{ fontFamily: 'Trebuchet MS' , borderRadius: '5px', padding: '6px 12px', fontSize: '14px' }}
                                >
                                    View Products
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
        </div>
       
    );
}

export default CategoryProducts;
