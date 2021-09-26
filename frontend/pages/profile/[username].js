import React , { useState, useEffect } from "react";
import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from "next/router";
import renderHTML from 'react-render-html';
import moment from 'moment';

import Layout from '../../components/Layout';
import { userPublicProfile } from "../../actions/user";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";

const UserProfile = ({user, blogs}) => {
    return(
        <React.Fragment>
            <Layout>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5>username</h5>
                                    <p>{user.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </React.Fragment>
    );
}

UserProfile.getInitialProps = ({query}) => {
    return userPublicProfile(query.username).then(data => {
        if (data.error) {
            console.log(data.error)
        } else {
            return {user: data.user, blogs: data.blogs}
        }
    });
}

export default UserProfile;