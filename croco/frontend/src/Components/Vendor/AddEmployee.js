import { Link } from 'react-router-dom';
import VendorSidebar from './VendorSidebar';

function AddEmployee(props) {
    return (
        <section className="container mt-4">
    <div className="row">
        <div className="col-md-3 col-12 mb-2">
            <VendorSidebar/>
        </div>
        <div className="col-md-9 col-12 mb-2">
            <div className="card p-4" style={{ borderRadius: '10px' }}>
                <h4 className="text-center" style={{ fontFamily: 'Trebuchet MS', fontSize: '25px', color: 'black' }}>Add Store Employee</h4>
                <div className="card-body">

                    <form>

                        <div className="mb-3">
                            <label for="Name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="Name" />
                        </div>
                        <div className="mb-3">
                            <label for="Phone" className="form-label">Phone</label>
                            <input type="tel" className="form-control" id="Phone" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">E-mail</label>
                            <input type="email" className="form-control" id="email" />
                        </div>
                        <div className="mb-3">
                            <label for="Address" className="form-label">Address</label>
                            <textarea className="form-control" id="Address" ></textarea>
                        </div>
                       

                        <button type="submit" className="btn btn-primary d-block mx-auto" style={{ borderRadius: '20px', fontSize: '17px', width: '130px' }}>Submit</button>

                    </form>

                </div>
            </div>
        </div>
    </div>
</section>


    )
}

export default AddEmployee;
