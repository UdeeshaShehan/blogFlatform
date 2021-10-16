import React from "react";
import { useState, useEffect } from "react";
import Layout from "../../../../components/Layout";
import { resetPassword } from "../../../../actions/auth";
import { withRouter } from "next/router";

const ResetPassword = ({router}) => {
    const [values, setValues] = useState({
        name:'', newPassword:'', error:'', message:'', showForm:true
    });
    const {name, newPassword, error, message, showForm} = values;

    const handleSubmit = e => {
        e.preventDefault();
        setValues({...values, message:'', error:''});
        resetPassword({newPassword, resetPasswordLink: router.query.id}).then(data => {
            console.log(data)
            if(data.error) {
                setValues({...values, error:data.error, showForm:false, newPassword:''});
            } else {
                setValues({...values, message:data.message, newPassword:'', showForm:false, error:false});
            }
        });
    }

    const showError = () => error? <div className="alert alert-danger">{error}</div>: '';
    const showMessage = () => message? <div className="alert alert-info">{message}</div> : '';

    const PasswordResetForm = () => {
        return (
        <div>
            <form onSubmit = {handleSubmit}>
                <div className="form-group">
                    <input value = {newPassword} onChange = {e => setValues({...values, newPassword: e.target.value})} type="password" className="form-control" placeholder="Type your new Password" req/>
                </div>
                <div>
                    <button className="btn btn-primary">Change Password</button>
                </div>
            </form>
        </div>
        );
    };

    return(
    <Layout>
        <div className="container">
            <h2>Reset password</h2>
            <hr/>
            {showError()}
            {showMessage()}
            { PasswordResetForm()}
        </div>
    </Layout>
    );
}
export default withRouter(ResetPassword);