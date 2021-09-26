import React , { useState, useEffect } from "react";
import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from "next/router";
import renderHTML from 'react-render-html';
import moment from 'moment';

import Layout from '../../components/Layout';
import { singleTag } from "../../actions/tag";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import Card from "../../components/blog/Card";

const Tag = ({tag, blogs}) => {
    console.log('jj', tag);
    const head = () => (
        <Head>
            <title>{tag.name} | {APP_NAME}</title>
            <meta name="description" content={`programing tutorials cf tag ${tag.name}`}/>
            <link rel="canonical" href={`${DOMAIN}/tags/${tag.slug}`}/>

            <meta property="og:title" content={`${tag.name}| ${APP_NAME}`}/>
            <meta property="og:description" content={`programing tutorials cf tag ${tag.name}`}/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`${DOMAIN}/tags/${tag.slug}`}/>
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
                                <h1 className="display-4 font-weight-bold">{tag.name}</h1>
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

Tag.getInitialProps = ({query}) => {
    return singleTag(query.slug).then(data => {
        console.log(data)
        if(data.error) {
            console.log(data.error);
        } else {
            return {tag: data.tag[0], blogs: data.blogs};
        }
    });
}

export default Tag;