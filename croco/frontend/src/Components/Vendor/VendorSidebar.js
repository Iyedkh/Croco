
import { Link } from 'react-router-dom';
function VendorSidebar (){
    return(
        <section className='container' style={{ marginTop: '-130px'}}>
            <div className="list-group" style={{ fontFamily: 'Trebuchet MS', fontSize: '14px', color:'black',fontWeight:'bold' }}>
                <Link to="/Vendor/Dashboard" className="list-group-item list-group-item-action" >Dashboard</Link>
                <Link to="/Vendor/Products" className="list-group-item list-group-item-action">Products</Link>
                <Link to="/Vendor/Orders" className="list-group-item list-group-item-action">Orders</Link>
                <Link to="/Vendor/Profile" className="list-group-item list-group-item-action">Manage Profile</Link>
                <Link to="/Vendor/ChangePass" className="list-group-item list-group-item-action">Change Password</Link>
                <a href="/Vendor/Logout" className="list-group-item list-group-item-action text-danger">Logout</a>
            </div>
      </section>
    )
}

export default VendorSidebar;