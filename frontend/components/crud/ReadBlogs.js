import React , { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import moment from "moment";

import { isAuth, getCookie } from "../../actions/auth";
import {  listBlogs, remove, update } from "../../actions/blog";

const ReadBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [message, setMessage] = useState("");
    const token = getCookie('token');

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = () => {
        listBlogs().then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setBlogs(data);
            }
        });
    }

    const deleteBlog = slug => {
        remove(slug, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                console.log('mm', data.message)
                setMessage(data.message);
                loadBlogs();
            }
        });
    }

    const deleteConfirmation = slug => {
        let answer = window.confirm('Are you sure you want to delete your blog?');
        if (answer) {
            deleteBlog(slug);
        }
    }

    const showUpdateBlog = blog => {
        if(isAuth() && isAuth().role === 0) {
            return(
                <Link href={`/user/crud/${blog.slug}`}>
                    <a className="ml-2 btn btn-sm btn-warning">Update</a>
                </Link>
            );
        } else if (isAuth() && isAuth().role === 1) {
            return(
                <Link href={`/admin/crud/${blog.slug}`}>
                    <a className="ml-2 btn btn-sm btn-warning">Update</a>
                </Link>
            );
        }
    }

    const showAllBlogs = () => {
        return blogs.map((blog, i) => (
            <div  key={i} className="pb-5">
                <h5>{blog.title}</h5>
                <p className="mark">Written By {blog.postedBy.name} | Published on {moment(blog.updatedAt).fromNow()}</p>
                <button className="btn btn-sm btn-danger" onClick={() => deleteConfirmation(blog.slug)}>Delete</button>
                {showUpdateBlog(blog)}
            </div>
        ));
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-md-12">
                    {message && <div className="alert alert-warning">{message}</div>}
                    {showAllBlogs()}
                </div>
            </div>
        </React.Fragment>
    );
}

export default ReadBlogs;