import fetch from 'isomorphic-fetch';
import {API} from '../config';
import { handleResponse } from './auth';

export const emailContactForm = (data) => {
    let url;
    if (data.authorEmail) {
        url = `${API}/contact`;
    } else {
        url = `${API}/contact-blog-author`;
    }
    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data) 
    }).then(res => {
        handleResponse(res);
        return res.json();
    } ).catch(err => console.log(err));
};