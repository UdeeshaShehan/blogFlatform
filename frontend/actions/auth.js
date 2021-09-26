import fetch from 'isomorphic-fetch';
import {API} from '../config';
import Cookies from 'js-cookie';


export const signUp = user => {
    return fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify(user)
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
            console.log('user', user);
            if (user) {
                return JSON.parse(user);
            } else {
                return false;
            }
        }
    }
}













