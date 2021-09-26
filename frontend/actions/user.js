import fetch from 'isomorphic-fetch';

import {API} from '../config';

export const userPublicProfile = userName => {
    return fetch(`${API}/user/${userName}`, {
        method: 'GET',
        headers: {
            'Accept':'application/json'
        }
    }).then(res => res.json()).catch(err => console.log(err));
};