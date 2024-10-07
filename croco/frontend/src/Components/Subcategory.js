// Subcategory.js
import React from 'react';

const Subcategory = ({ subcategories }) => {
    return (
        <div className="row">
            {subcategories.map((subcategory) => (
                <div className="col-12 col-md-3 mb-2" key={subcategory.id}>
                    <div className="card">
                        <img src={subcategory.image} alt={subcategory.title} style={{ maxWidth: '100px', maxHeight: '80px' }} className="no-blend-mode" />
                        <div className="card-body" style={{ fontFamily: 'Trebuchet MS', fontSize: '16px', textAlign: 'center' }}>
                            <h5 className="card-title" style={{ color: 'black', textDecoration: 'none' }}>{subcategory.title}</h5>
                        </div>
                        <div className="card-footer" style={{ fontFamily: 'Trebuchet MS', fontSize: '12px', color: 'black', textAlign: 'center' }}>
                            {/* Additional details can be added here */}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Subcategory;
