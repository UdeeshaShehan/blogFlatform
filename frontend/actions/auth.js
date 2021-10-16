import fetch from 'isomorphic-fetch';
import {API} from '../config';
import Cookies from 'js-cookie';
import Router from "next/router";

export const handleResponse = response => {
    if (response.status === 401) {
        signOut(() => {
            Router.push({
                pathname:'/signin',
                query: {
                    message: 'Your session is expired. Please Sign In'
                }
            });
        })
    } else{
        return;
    }
}

export const preSignUp = user => {
    return fetch(`${API}/pre-signup`, {
        method: 'POST',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify(user)
    }).then(res => res.json()).catch(err => console.log(err));
};

export const signUp = token => {
    console.log('lllll', JSON.stringify(token));
    return fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify(token)
    }).then(res => res.json()).catch(err => console.log(err));
};

export const signIn = user => {
    return fetch(`${API}/signin`, {
        method: 'POST',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify(user)
    }).then(res => res.json()).catch(err => console.log(err));
};

export const signOut = (next) => {
    removeCookie('token');
    removeLocalStorage('user');
    next();

    return fetch(`${API}/signout`, {
        method: 'GET'
    }).then(res => console.log('sign out successful', res)).catch(err => console.log(err));
}

export const setCookie = (key, value) => {
    if(process.browser) {
        Cookies.set(key, value, {
            expires: 1
        });
    }
};

export const getCookie = (key) => {
    if(process.browser) {
       return Cookies.get(key);
    }
};

export const removeCookie = (key) => {
    if(process.browser) {
        Cookies.remove(key, {
            expires: 1
        });
    }
};

export const setLocalStorage = (key, value) => {
    if(process.browser) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

export const removeLocalStorage = (key) => {
    if(process.browser) {
        localStorage.removeItem(key);
    }
};

export const authenticate = (data, next) => {
    setCookie('token', data.token);
    setLocalStorage('user', data.user);
    next();
}

export const isAuth = () => {
    if(process.browser) {
        const cookieChecked = getCookie('token');
        if (cookieChecked) {
            const user = localStorage.getItem('user');
            if (user) {
                return JSON.parse(user);
            } else {
                return false;
            }
        }
    }
}

export const updateUser = (user, next) => {
    if (process.browser) {
        if (localStorage.getItem('user')) {
            localStorage.setItem('user', JSON.stringify(user));
            next();
        }
    }
}

export const forgotPassword = email => {
    return fetch(`${API}/forgot-password`, {
        method: 'PUT',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify(email)
    }).then(res => res.json()).catch(err => console.log(err));
};

export const resetPassword = resetInfo => {
    return fetch(`${API}/reset-password`, {
        method: 'PUT',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify(resetInfo)
    }).then(res => res.json()).catch(err => console.log(err));
};

export const loginWithGoogle = user => {
    return fetch(`${API}/google-login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};









