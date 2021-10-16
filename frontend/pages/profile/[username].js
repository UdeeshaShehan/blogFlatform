import React , { useState, useEffect } from "react";
import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from "next/router";
import renderHTML from 'react-render-html';
import moment from 'moment';

import Layout from '../../components/Layout';
import { userPublicProfile } from "../../actions/user";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import ContactForm from "../../components/form/ContactForm";

const UserProfile = ({user, blogs, query}) => {

    const head = () => (
        <Head>
            <title>{user.nameName} | {APP_NAME}</title>
            <meta name="description" content={`Blogs by ${user.nameName}`}/>
            <link rel="canonical" href={`${DOMAIN}/profile/${user.userName}`}/>

            <meta property="og:title" content={`${user.nameName}| ${APP_NAME}`}/>
            <meta property="og:description" content={`Blogs by ${user.nameName}`}/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`${DOMAIN}/profile/${user.userName}`}/>
            <meta property="og:site_name" content={`${APP_NAME}`}/>

            <meta property="og:image" content={`${DOMAIN}/static/image/source-4280758_1920.jpg`}/>
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/image/source-4280758_1920.jpg`}/>
            <meta property="og:image:type" content="image/jpg"/>
            <meta property="fb:app_id" content={`${FB_APP_ID}`}/>
        </Head>
    );
    const userBlogs = () => {
        return blogs.map((blog, i) => {
            return(
                <div className="mt-4 mb-4" key={i}>
                    <Link href={`/blogs/${blog.slug}`}>
                        <a className="lead">{blog.title}</a>
                    </Link>
                </div>
            );
        });
    }

    return(
        <React.Fragment>
            {head()}
            <Layout>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <h5>username</h5>
                                            <p>{user.name}</p>
                                            <p className="text-muted">Joined {moment(user.createdAt).fromNow()}</p>
                                        </div>
                                        <div className="col-md-4">
                                            <img className="img img-fluid img-thumbnail mb-3" src={`${API}/user/photo/${user.userName}`} alt="user profile" style={{maxHeight:'100px', maxWidth:'100%'}} />  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div  className="container pb-5">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                        <h5 className="card-title bg-primary pb-4 pt-4 pr-4 pl-4 text-white">
                                        Recent blogs by {user.name}
                                        </h5>
                                        {userBlogs()}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h5 className="card-title bg-primary pb-4 pt-4 pr-4 pl-4 text-white">
                                Message {user.name}
                            </h5>
                            <br/>
                            <ContactForm authorEmail = {user.email}/>
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
            return {user: data.user, blogs: data.blogs, query}
        }
    });
}

export default UserProfile;