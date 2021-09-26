import Router from "next/router";
import React from "react";
import { useState, useEffect } from "react";
import { signIn, authenticate, isAuth } from "../../actions/auth";

const SignInComponent = () => {

    const [values, setValues] = useState({
        email: 'udeesha1@gmail.com',
        password: '111111',
        error: '',
        loading: false,
        message: '',
        showForm: true
    });

    useEffect(() => {
        isAuth() && Router.push('/');
    },[]);

    const { email, password, error, loading, message, showForm} = values;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.table({ email, password, error, loading, message, showForm});
        setValues({...values, error:false, loading:true});
        const user = { email, password}
        signIn(user).then(data => {
            if(data.error) {
                setValues({...values, error: data.error, loading:false});
            } else {
                authenticate(data, () => {

                    if (isAuth() && isAuth().role === 1) {
                        Router.push('/admin');
                    } else {
                        Router.push('/user');
                    }
                    
                });
                
            }
        });
    };

    const handleChange = name => (e) => {
        console.log(e.target.value);
        setValues({... values, error:false, [name]: e.target.value});
    }

    const showError = () => error? <div className="alert alert-danger">{error}</div>: '';
    const showLoading = () => loading? <div className="alert alert-info">Loading ...</div> : '';
    const showMessage = () => message? <div className="alert alert-info">{message}</div> : '';

    const SignForm = () => {
        return (
        <div>
            
            <form onSubmit = {handleSubmit}>
                <div className="form-group">
                    <input value = {email} onChange = {handleChange('email')} type="email" className="form-control" placeholder="Type your Email"/>
                </div>
                <div className="form-group">
                    <input value = {password} onChange = {handleChange('password')} type="password" className="form-control" placeholder="Type your Password"/>
                </div>
                <div>
                    <button className="btn btn-primary">SignIn</button>
                </div>
            </form>
        </div>
        );
    };

    return (
        <React.Fragment>
            {showError()}
            {showLoading()}
            {showMessage()}
            {showForm && SignForm()}
        </React.Fragment>
    );
};

export default SignInComponent;