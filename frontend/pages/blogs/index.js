import React , { useState, useEffect } from "react";
import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from "next/router";
import renderHTML from 'react-render-html';
import moment from 'moment';

import Layout from '../../components/Layout';
import { listBlogsWithCategoriesAndTags } from "../../actions/blog";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import Card from "../../components/blog/Card";

const Blogs = ({blogs, categories, tags, totalBlogs, blogLimit, blogSkip, router}) => {
    const head = () => (
        <Head>
            <title>Programing Blog | {APP_NAME}</title>
            <meta name="description" content="Programing Blogs And Tutorials"/>
            <link rel="canonical" href={`${DOMAIN}${router.pathname}`}/>

            <meta property="og:title" content={`Programing Blog | ${APP_NAME}`}/>
            <meta property="og:description" content="Programing Blogs And Tutorials"/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`${DOMAIN}${router.pathname}`}/>
            <meta property="og:site_name" content={`${APP_NAME}`}/>

            <meta property="og:image" content={`${DOMAIN}/static/image/source-4280758_1920.jpg`}/>
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/image/source-4280758_1920.jpg`}/>
            <meta property="og:image:type" content="image/jpg"/>
            <meta property="fb:app_id" content={`${FB_APP_ID}`}/>
        </Head>
    );

    const [skip, setSkip] = useState(blogSkip);
    const [limit, setLimit] = useState(blogLimit);
    const [size, setSize] = useState(totalBlogs);
    const [loadedBlogs, setLoadedBlogs] = useState([])

    const loadMore = () => {
        let toSkip = limit + skip;
        listBlogsWithCategoriesAndTags(toSkip, limit).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                setLoadedBlogs([...loadedBlogs, ...data.blogs]);
                setSkip(toSkip);
                setSize(data.size);
            }
        });
    };

    const loadMoreButton = () => (
        size > 0 && size >= limit && (<button onClick={loadMore} className="btn btn-outline-primary btn-lg">Load More ...</button>)
    )

    const showBlogs = () => {
        return blogs.map((blog, i) => {
            return (
                <article key={i}>
                    <Card blog={blog}/>
                    <hr/>
                </article>
            );
        });
    }
    const showLoadedBlogs = () => {
        return loadedBlogs.map((blog, i) => {
            return (
                <article key={i}>
                    <Card blog={blog}/>
                    <hr/>
                </article>
            );
        });
    }

    const showAllCategories = () => {
        return categories.map((c, i) => {
            return(
            <Link key={i} href={`/categories/${c.slug}`}>
                <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
            </Link>)
        });
    }

    const showAllTags = () => {
        return tags.map((c, i) => {
            return(
            <Link key={i} href={`/tags/${c.slug}`}>
                <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{c.name}</a>
            </Link>)
        });
    }

    return (
            <React.Fragment>
                {head()}
                <Layout>
                    <main>
                        <div className="container-fluid">
                            <header>
                                <div className="col-md-12 pt-3">
                                    <h1 className="display-4 font-weight-bold text-center"> Programing Blogs and Tutorials</h1>
                                </div>
                                <section>
                                    <div className="pb-5 text-center">
                                        {showAllCategories()}
                                        <br/>
                                        {showAllTags()}
                                    </div>
                                </section>
                            </header>
                        </div>
                        <div className="container-fluid">
                                    {showBlogs()}
                        </div>
                        <div className="container-fluid">
                                    {showLoadedBlogs()}
                        </div>
                        <div className="text-center pt-5 pb-5">
                                    {loadMoreButton()}
                        </div>
                    </main>
                </Layout>
            </React.Fragment>
    );
}

Blogs.getInitialProps = () => {
    let skip = 0;
    let limit = 2;
    return listBlogsWithCategoriesAndTags(skip, limit).then(data => {
        if (data.error) {
            console.log(data.error);
        } else {
            return { blogs: data.blogs, categories: data.categories, tags: data.tags,
                 totalBlogs: data.size, blogLimit: limit, blogSkip: skip} ;
        }
    });
}

export default withRouter(Blogs);