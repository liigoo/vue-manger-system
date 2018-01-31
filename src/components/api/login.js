import request from '../utils/request';

export function loginByUser(username,password){
    const data = {
        username,
        password,
    };

    return request({
        url: 'login/loginbyuser',
        method: 'post',
        data,
    })
}

export function logout() {
    return request({
        url: 'login/logout',
        method: 'post',
    });
}

export function getInfo() {
    return request({
        url: 'user/info',
        method: 'post',
        params: { token }
    });
}
