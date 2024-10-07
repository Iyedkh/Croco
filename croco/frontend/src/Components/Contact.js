// Contact.js
import React from 'react';

const Contact = () => {
    return (
        <div className="page-center" style={{ marginTop: '260px', textAlign: 'center', fontFamily: 'Trebuchet MS' }}>
            <div className="contact-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <p style={{ fontWeight: 'bold', fontSize: '35px' }}>Contact Us</p>
                <div style={{ marginBottom: '70px' }}></div>
                <p style={{ fontWeight: 'bold', fontSize: '22px' }}><strong>Phone Number 1:</strong> <span style={{ fontSize: '18px',color: '#e67e22' }}>+216-22995682</span></p>
                <p style={{ fontWeight: 'bold', fontSize: '22px' }}><strong>Phone Number 2:</strong> <span style={{ fontSize: '18px',color: '#e67e22' }}>+216-21511984</span></p>
                <p style={{ fontWeight: 'bold', fontSize: '22px' }}><strong>Cordless phone number:</strong> <span style={{ fontSize: '18px',color: '#e67e22' }}>+216-71609234</span></p>
                <p style={{ fontWeight: 'bold', fontSize: '22px' }}><strong>Email:</strong> <a style={{ fontSize: '18px' }} href="mailto:info@elepro.com">elepro.2024@gmail.com</a></p>

                <p style={{ fontWeight: 'bold', fontSize: '22px' }}>
                    <strong>Facebook:</strong>
                    <a href="https://www.facebook.com/profile.php?id=61561238102311" target="_blank" rel="noopener noreferrer" style={{ fontSize: '18px', marginLeft: '10px' }}>facebook.com/elepro</a>
                </p>
                <p style={{ fontWeight: 'bold', fontSize: '22px' }}>
                    <strong>Instagram:</strong>
                    <a href="https://www.instagram.com/elepro.2024/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '18px', marginLeft: '10px' }}>instagram.com/elepro</a>
                </p>
            </div>
        </div>
    );
}

export default Contact;
