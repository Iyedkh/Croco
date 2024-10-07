// About.js

import React from 'react';

const About = () => {
    return (
        <div className="page-center" style={{ marginTop: '230px' }}>
            <div className="about-container">
                <div className="logos" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                    <img src="/Pro3.png" alt="Logo 1" style={{ maxWidth: '220px', height: 'auto', margin: '0 10px' }} />
                    <img src="/Eleg.png" alt="Logo 2" style={{ maxWidth: '220px', height: 'auto', margin: '0 10px' }} />
                </div>
                <div style={{ marginBottom: '80px' }}></div>
                <div className="about-us" style={{ textAlign: 'center', fontSize: '19px', lineHeight: '1.6', maxWidth: '1100px', margin: '0 auto',fontFamily: 'Trebuchet MS', }}>
                <p><span style={{ color: '#446cb3', fontWeight:'bold' }}>ElEPRO</span> is a B2B multivendor platform owned by ELEGANZA Store, designed to facilitate business-to-business transactions efficiently. As a multivendor platform, ElEPRO enables multiple vendors or suppliers to list and sell their products or services through a centralized marketplace. This approach not only broadens the range of offerings available but also streamlines procurement processes for businesses.</p>
                <p><span style={{ color: '#446cb3' , fontWeight:'bold'}}>ELEGANZA Store</span> stands out as a company passionate about quality and exceptional customer service. Founded on strong values, it has become a leader in online commerce in Tunisia. Originally a small family business, it has quickly grown by offering a high-quality online shopping experience while maintaining its commitment to excellence. Eleganza store offers a diverse range of products, from fashion to electronic items, carefully selected to meet the varied needs of its customers. The company excels in offering high-quality products at competitive prices, thus creating an unparalleled online shopping experience.</p>
                </div>
            </div>
        </div>
    );
}

export default About;
