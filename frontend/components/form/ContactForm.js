import React , { useState, useEffect } from "react";
import Link from "next/link";
import { emailContactForm } from "../../actions/form";

const ContactForm = ({authorEmail}) => {

    const [values, setValues] = useState({
        message:'',
        email:'',
        name:'',
        sent:false,
        buttonText:'Send message',
        success:false,
        error:false
    });

    const {message, email, name, sent, buttonText, success, error} = values;

    const showSuccessMessage = () => success && <div className="alert alert-info">Thanks for contacting us</div>;

    const showErrorMessage = () => error && <div className="alert alert-danger">{error}</div>;

    const clickSubmit = e => {
        e.preventDefault();
        setValues({...values, buttonText:'Sending ...'});
        emailContactForm({authorEmail, name, email, message}).then(data => {
            if (data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({...values, error: false, sent: true, name:'', message:'', email:'', success: data.success, buttonText:'Sent'})
            }
        })
    }

    const handleChange = name => e =>{
        setValues({...values, [name]: e.target.value, error:false, success:false, buttonText:'Send Message'});
    }

    const contactForm = () => (
        <form onSubmit={clickSubmit} className="pb-5">
            <div className="form-group">
                <label className="lead">Message</label>
                <textarea value = {message} onChange = {handleChange('message')} type="text" className="form-control" rows="10" required></textarea>
            </div>
            <div className="form-group">
                    <label className="lead">Name</label>
                    <input value = {name} onChange = {handleChange('name')} type="text" className="form-control" required/>
            </div>
            <div className="form-group">
                    <label className="lead">Email</label>
                    <input value = {email} onChange = {handleChange('email')} type="email" className="form-control" required/>
            </div>
            <div>
                <button className="btn btn-primary">{buttonText}</button>
            </div>
        </form>
    );

    return (
        <React.Fragment>
            {showSuccessMessage()}
            {showErrorMessage()}
            {contactForm()}
        </React.Fragment>
    );
}

export default ContactForm;