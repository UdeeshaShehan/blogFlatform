import fetch from 'isomorphic-fetch';
import queryString from 'query-string';

import {API} from '../config';

import { isAuth, handleResponse } from './auth';

export const create = (blog, token) => {
    let url;
    if (isAuth() && isAuth().role === 1) {
        url = `${API}/blog`;
    } else if(isAuth()) {
        url = `${API}/user/blog`;
    }
    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:blog
    }).then(res => {
        handleResponse(res);
        return res.json();
    } ).catch(err => console.log(err));
};

export const listBlogsWithCategoriesAndTags = (skip, limit) => {
    const data = {skip, limit}
    return fetch(`${API}/blogs-categories-tags`, {
        method: 'POST',
        headers: {
            'Accept':'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).catch(err => console.log(err));
};

export const singleBlog = slug => fetch(`${API}/blog/${slug}`, {method:'GET'}).
then(response => response.json()).
catch(error => console.log(error));

export const listRelated = (blog) => {
    return fetch(`${API}/blogs/related`, {
        method: 'POST',
        headers: {
            'Accept':'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blog)
    }).then(res => res.json()).catch(err => console.log(err));
};

export const listBlogs = userName => {
    let url;
    if (userName) {
        url = `${API}/${userName}/blogs`;
    } else {
        url = `${API}/blogs`;
    }
    return fetch(url, {method:'GET'}).
then(response => response.json()).
catch(error => console.log(error))
};

export const remove = (slug, token) => {
    let url;
    if (isAuth() && isAuth().role === 1) {
        url = `${API}/blog/${slug}`;
    } else if(isAuth()) {
        url = `${API}/user/blog/${slug}`;
    }
    return fetch(url, {
        method: 'DELETE',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    }).then(res => {
        handleResponse(res);
        return res.json();
    }).catch(err => console.log(err));
};

export const update = (blog, token, slug) => {
    let url;
    if (isAuth() && isAuth().role === 1) {
        url = `${API}/blog/${slug}`;
    } else if(isAuth()) {
        url = `${API}/user/blog/${slug}`;
    }
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Accept':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:blog
    }).then(res => {
        handleResponse(res);
        return res.json();
    }).catch(err => console.log(err));
};

export const listSearch = (params) => {
    let query = queryString.stringify(params);
    console.log('jjj', query)
    return fetch(`${API}/blogs/search?${query}`, {
        method: 'GET'
    }).then(res => res.json()).catch(err => console.log(err));
};