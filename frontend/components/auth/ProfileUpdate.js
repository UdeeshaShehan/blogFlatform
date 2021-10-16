import React, { useEffect, useState } from "react";
import { getCookie, updateUser } from "../../actions/auth";
import { getProfile, update} from "../../actions/user";

import { API } from "../../config";

const ProfileUpdate = () => {
    const [values, setValues] = useState({
        name:'',
        userName:'',
        email:'',
        password:'',
        error:false,
        success: false,
        loading: false,
        photo: '',
        userData: '',
        about:''
    })

    const {name, userName, email, password, error, success, loading, photo, userData, about} = values;
    const token = getCookie('token');
    let userFormData;

    const init = () =>{
        userFormData = new FormData();
        getProfile(token).then(data => {
            if(data && data.error) {
                setValues({...values, error: data.error, success: false})
            } else if (data) {
                setValues({...values, name: data.name, userName: data.userName, email: data.email, about: data.about, success: 'Successfully updated', error:false})
            }
        });
    }

    useEffect(()=>{
        init();
    }, [])

    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        if (!userFormData) userFormData = new FormData();
        userFormData.set(name, value);
        setValues({...values, [name]: value, userData: userFormData, error: false, success:false});
    };

    const handleSubmit = e => {
        e.preventDefault();
        setValues({...values, loading: true});
        update(token, userData).then(data => {
            if(data.error) {
                setValues({...values, error: true, success:false, loading: false});
            } else {
                updateUser(data, () => {
                    setValues({...values, name: data.name, userName: data.userName, email: data.email, about: data.about, success: true, loading:false});
                })
                }
        });
    }

    const profileUpdateForm = () => (
        <form onSubmit={handleSubmit} >
            <div className="form-group">
                <label className="btn btn-outline-info">Profile Photo
                    <input onChange={handleChange('photo')} type="file" accept="image/*" hidden/>
                </label>
            </div>
            <div className="form-group">
                <label className="text-muted">User Name</label>
                <input onChange={handleChange('userName')} type="text" value={userName} className="form-control"/>
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" value={name} className="form-control"/>
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} type="email" value={email} className="form-control"/>
            </div>
            <div className="form-group">
                <label className="text-muted">About</label>
                <textarea onChange={handleChange('about')} type="text" value={about} className="form-control"/>
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} type="password" value={password} className="form-control"/>
            </div>
            <div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </form>
    )

    const showErrors = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );
    const showSuccess = () => (
        <div className='alert alert-success' style={{display: success ? '' : 'none'}}>
            {success}
        </div>
    );

    const showLoading = () => (
        <div className='alert alert-info' style={{display: loading ? '' : 'none'}}>
            Loading ...
        </div>
    );

    return (
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <img className="img img-fluid img-thumbnail mb-3" src={`${API}/user/photo/${userName}`} alt="user profile" style={{maxHeight:'auto', maxWidth:'100%'}} />
                    </div>
                    <div className="col-md-8 mb-5">
                        {showErrors()}
                        {showSuccess()}
                        {showLoading()}
                        {profileUpdateForm()}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ProfileUpdate;