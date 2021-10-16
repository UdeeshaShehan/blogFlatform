import fetch from 'isomorphic-fetch';

import {API} from '../config';
import { handleResponse } from './auth';

export const userPublicProfile = userName => {
    return fetch(`${API}/user/${userName}`, {
        method: 'GET',
        headers: {
            'Accept':'application/json'
        }
    }).then(res => res.json()).catch(err => console.log(err));
};

export const getProfile = token => {
    return fetch(`${API}/user/profile`, {
        method: 'GET',
        headers: {
            'Accept':'application/json',
            'Authorization':`Bearer ${token}`
        }
    }).then(res => {
        handleResponse(res);
        return res.json();
    }).catch(err => console.log(err));
};

export const update = (token, user )=> {
    return fetch(`${API}/user/update`, {
        method: 'PUT',
        headers: {
            'Accept':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:user
    }).then(res => {
        handleResponse(res);
        return res.json();
    }).catch(err => console.log(err));
};