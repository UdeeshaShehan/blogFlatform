import React , { useState, useEffect } from "react";
import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from "next/router";
import renderHTML from 'react-render-html';
import moment from 'moment';

import Layout from '../../components/Layout';
import { singleCategory } from "../../actions/category";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import Card from "../../components/blog/Card";

const Category = ({category, blogs}) => {
    const head = () => (
        <Head>
            <title>{category.name} | {APP_NAME}</title>
            <meta name="description" content={`programing tutorials cf category ${category.name}`}/>
            <link rel="canonical" href={`${DOMAIN}/categories/${category.slug}`}/>

            <meta property="og:title" content={`${category.name}| ${APP_NAME}`}/>
            <meta property="og:description" content={`programing tutorials cf category ${category.name}`}/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`${DOMAIN}/categories/${category.slug}`}/>
            <meta property="og:site_name" content={`${APP_NAME}`}/>

            <meta property="og:image" content={`${DOMAIN}/static/image/source-4280758_1920.jpg`}/>
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/image/source-4280758_1920.jpg`}/>
            <meta property="og:image:type" content="image/jpg"/>
            <meta property="fb:app_id" content={`${FB_APP_ID}`}/>
        </Head>
    );

    return(
        <React.Fragment>
            {head()}
            <Layout>
                <main>
                    <div className="container-fluid text-center">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold"> {category.name}</h1>
                                {blogs.map((b, i) => (
                                    <div>
                                        <Card blog ={b} key={i}/>
                                        <hr/>
                                    </div>
                                    ))
                                }
                            </div>
                        </header>
                    </div>
                </main>
            </Layout>
        </React.Fragment>
    );
};

Category.getInitialProps = ({query}) => {
    return singleCategory(query.slug).then(data => {
        console.log(data)
        if(data.error) {
            console.log(data.error);
        } else {
            return {category: data.category[0], blogs: data.blogs};
        }
    });
}

export default Category;