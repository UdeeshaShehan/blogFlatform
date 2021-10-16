import React from "react";
import { useState, useEffect } from "react";
import { signUp, isAuth, preSignUp } from "../../actions/auth";
import Router from "next/router";
import Link from "next/link";

const SignUpComponent = () => {

    const [values, setValues] = useState({
        name: 'Udeesha',
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

    const {name, email, password, error, loading, message, showForm} = values;

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({...values, error:false, loading:true});
        const user = {name, email, password}
        preSignUp(user).then(data => {
            if(data.error) {
                setValues({...values, error: data.error, loading:false});
            } else {
                setValues({...values, name: '', email:'', password:'', error:'', loading:false, message: data.message, showForm:false});
            }
        });
    };

    const handleChange = name => (e) => {
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
                    <input value = {name} onChange = {handleChange('name')} type="text" className="form-control" placeholder="Type your Name"/>
                </div>
                <div className="form-group">
                    <input value = {email} onChange = {handleChange('email')} type="email" className="form-control" placeholder="Type your Email"/>
                </div>
                <div className="form-group">
                    <input value = {password} onChange = {handleChange('password')} type="password" className="form-control" placeholder="Type your Password"/>
                </div>
                <div>
                    <button className="btn btn-primary">Signup</button>
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
            <br/>
            <Link href="/auth/password/forgot">
                <a className="btn btn-outline-danger">Forgot Password</a>
            </Link>
        </React.Fragment>
    );
};

export default SignUpComponent;