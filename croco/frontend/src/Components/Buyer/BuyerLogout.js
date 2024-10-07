function BuyerLogout(){
    localStorage.removeItem('buyer_login');
    localStorage.removeItem('buyer_username');
    window.location.href = '/Buyer/Login';
}

export default BuyerLogout;