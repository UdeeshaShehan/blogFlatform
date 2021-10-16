import React from "react";
import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import { forgotPassword } from "../../../actions/auth";

const ForgotPassword = () => {

    const [values, setValues] = useState({
        email:'',
        message:'',
        error:'',
        showForm:true
    });

    const {email, message, error, showForm} = values;

    const changeHandler = name => e => {
        setValues({...values, message:'', error:'', [name]: e.target.value });
    }

    const handleSubmit = e => {
        e.preventDefault();
        setValues({...values, message:'', error:''});
        forgotPassword({email}).then(data => {
            if(data.error) {
                setValues({...values, error:data.error});
            } else {
                setValues({...values, message:data.message, email:'', showForm:false});
            }
        });
    }

    const showError = () => error? <div className="alert alert-danger">{error}</div>: '';
    const showMessage = () => message? <div className="alert alert-info">{message}</div> : '';

    const ForgotPasswordForm = () => {
        return (
        <div>
            <form onSubmit = {handleSubmit}>
                <div className="form-group">
                    <input value = {email} onChange = {changeHandler('email')} type="email" className="form-control" placeholder="Type your Email" req/>
                </div>
                <div>
                    <button className="btn btn-primary">Send Password Reset Link</button>
                </div>
            </form>
        </div>
        );
    };

    return(
    <Layout>
        <div className="container">
            <h2>Forgot password</h2>
            <hr/>
            {showError()}
            {showMessage()}
            {showForm && ForgotPasswordForm()}
        </div>
    </Layout>);
}
export default ForgotPassword;