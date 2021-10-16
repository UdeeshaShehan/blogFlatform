import React from "react";
import { useState, useEffect } from "react";
import Layout from "../../../../components/Layout";
import { signUp } from "../../../../actions/auth";
import { withRouter } from "next/router";
import jwt from "jsonwebtoken";

const AccountActivation = ({router}) => {

    const [values, setValues] = useState({
        name:'', token:'', error:'', success:false, showButton:true, loading: false
    });

    const {name, token, error, success, showButton, loading} = values;

    useEffect(() => {
        let token = router.query.id;
        if(token) {
            const {name} = jwt.decode(token);
            setValues({...values, name, token})
        }
    }, [router]);

    const showLoading = () => loading? <div className="alert alert-info">Loading ...</div> : '';

    const clickSubmit = e => {
        e.preventDefault();
        setValues({...values, loading : true, error: false});

        signUp({token}).then(data => {
            if(data.error) {
                setValues({...values, error: data.error, showButton: false, loading:false});
            } else {
                setValues({...values, success:true, showButton: false, loading:false});
            }
        });
    }

    return(
        <Layout>
            <div className="container">
                <h2>{`hey ${name}, Your account is ready to activate`}</h2>
                {showLoading()}
                {error && error}
                {success && 'You have activated your account successfully. Please Sign in'}
                {showButton && <button className="btn btn-outline-primary" onClick={clickSubmit}>Activate Account</button>}
            </div>
        </Layout>
    );
}

export default withRouter(AccountActivation);