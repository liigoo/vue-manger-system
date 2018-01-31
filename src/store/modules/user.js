import {loginByUser, logout, getInfo} from "../../components/api/login";
import Cookies from 'js-cookie';

const user = {
    state: {
        username: '',
        user: '',
        status: '',
        email: '',
        code: '',
        uid: '',
        auth_type: '',
        token: Cookies.get('Admin-Token'),
        name: '',
        introduction: '',
        roles: [],
        setting: {
            articlePlatform: [],
        },
    },


    mutations: {
        SET_AUTH_TYPE: (state, type) => {
            state.auth_type = type;
        },
        SET_CODE: (state, code) => {
            state.code = code;
        },
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_UID: (state, uid) => {
            state.uid = uid;
        },
        SET_USERNAME: (state, username) => {
            state.username = username;
        },
        SET_EMAIL: (state, email) => {
            state.email = email;
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction;
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        LOGIN_SUCCESS: () => {
            console.log('login success');
        },
        LOGOUT_USER: state => {
            state.user = '';
        },
    },
    actions: {

        //用户名登录
        LoginByuser({commit}, userInfo) {
            const username = userInfo.username.trim();
            return new Promise((resolve, reject) => {
                loginByUser(username, userInfo.password).then(response => {
                    const data = response.data;
                    console.log(response.data);
                    Cookies.set('Admin-Token', response.data.token);
                    commit('SET_TOKEN', data.token);
                    commit('SET_USERNAME', data.username);
                    //commit('SET_NAME',NAME);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        //获取用户信息
        GetInfo({commit, state}) {

            return new Promise((resolve, reject) => {
                getInfo(state, token).then(response => {
                    const data = response.data;
                    commit('SET_ROLES', data.role);
                    commit('SET_NAME', data.name);
                    commit('SET_UID', data.uid);
                    commit('SET_INTRODUCTION', data.introduction);
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });

        },

        //logout
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '');
                    commit('SET_ROLES', []);
                    Cookies.remove('Admin-Token');
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },
    },
};


export default user;
