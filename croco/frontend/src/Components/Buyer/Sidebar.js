import { Link } from 'react-router-dom';

function Sidebar (){
    return(
        <section className='container' style={{ marginTop: '-120px'}}>
            <div className="list-group" style={{ fontFamily: 'Trebuchet MS', fontSize: '14px', color:'black', backgroundColor: 'transparent' , fontWeight:'bold'}}>
                <Link to="/Buyer/Dashboard" className="list-group-item list-group-item-action" >Main</Link>
                <Link to="/Buyer/Orders" className="list-group-item list-group-item-action">Orders</Link>
                <Link to="/Buyer/Wishlist" className="list-group-item list-group-item-action">Wishlist</Link>
                <Link to="/Buyer/Profile" className="list-group-item list-group-item-action">Manage Profile</Link>
                <Link to="/Buyer/Changepwd" className="list-group-item list-group-item-action">Change Password</Link>
                <a href="/Buyer/Logout" className="list-group-item list-group-item-action text-danger">Logout</a>
            </div>
        </section>
    )
}

export default Sidebar;
