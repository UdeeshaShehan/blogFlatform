import React , { useState, useEffect } from "react";
import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from "next/router";
import renderHTML from 'react-render-html';
import moment from 'moment';

import Layout from '../../components/Layout';
import { singleBlog, listRelated } from "../../actions/blog";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import SmallCard from "../../components/blog/SmallCard";

const SingleBlog = ({blog}) => {
    const [related, setRelated] = useState([]);

    const loadRelated = () => {
        listRelated({blog}).then(data => {
            if (data.error) {
                console.log(error);
            } else {
                setRelated(data);
            }
        }
        );
    };

    useEffect(() => {
        loadRelated();
    }, [])

    const head = () => (
        <Head>
            <title>{blog.title} | {APP_NAME}</title>
            <meta name="description" content={blog.mdesc}/>
            <link rel="canonical" href={`${DOMAIN}/blogs/${blog.slug}`}/>

            <meta property="og:title" content={`${blog.title}| ${APP_NAME}`}/>
            <meta property="og:description" content={blog.mdesc}/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`${DOMAIN}/blogs/${blog.slug}`}/>
            <meta property="og:site_name" content={`${APP_NAME}`}/>

            <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`}/>
            <meta property="og:image:secure_url" content={`${API}/blog/photo/${blog.slug}`}/>
            <meta property="og:image:type" content="image/jpg"/>
            <meta property="fb:app_id" content={`${FB_APP_ID}`}/>
        </Head>
    );

    const showCategories = (blog) => {
        return blog.categories.map((c, i) => (
            <Link key={i} href={`/categories/${c.slug}`}>
                <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
            </Link>
        ));
    }

    const showTags = (blog) => {
        return blog.tags.map((c, i) => (
            <Link key={i} href={`/tags/${c.slug}`}>
                <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{c.name}</a>
            </Link>
        ));
    }

    const showRelatedBlog = () => {
        //return(<div>{JSON.stringify(related)}</div>)
        return related.map((blog, i) => (
            <div className="col-md-4" key={i}>
                <article>
                    <SmallCard blog={blog}/>
                </article>
            </div>
        ))

    };

    return(
        <React.Fragment>
            {head()}
            <Layout>
                <main>
                    <article>
                        <div className="container-fluid">
                            <section>
                                <div className="row" style={{marginTop:'-30px'}}>
                                    <img className="img img-fluid featured-image" src={`${API}/blog/photo/${blog.slug}`} alt={blog.title} />
                                </div>
                            </section>
                            <section>
                                <div className="container">
                                    <h1 className="display-2 pb-3 pt-3 text-center font-weight-bold">{blog.title}</h1>
                                    <p className="lead mt-3 mark">
                                        Written By {blog.postedBy.name} | Published {moment(blog.updatedAt).fromNow() }
                                    </p>
                                    <div className="pb-3">
                                        {showCategories(blog)}
                                        {showTags(blog)}
                                        <br/>
                                        <br/>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="container">
                            <section>
                                <div className="col-md-12 lead">{renderHTML(blog.body)}</div>
                            </section>
                        </div>
                        <div className="container pb-5">
                            <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
                            <hr/>
                            <div className="row">
                            {showRelatedBlog()}
                            </div>
                        </div>
                        <div className="container pb-5">
                            <p>Show comments</p>
                        </div>
                    </article>
                </main>
            </Layout>
        </React.Fragment>
    );
};
SingleBlog.getInitialProps = ({query}) => {
    return singleBlog(query.slug).then(data => {
        if(data.error) {
            console.log(data.error);
        } else {
            return {blog: data};
        }
    });
}

export default SingleBlog;