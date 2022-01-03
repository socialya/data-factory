import axios from 'axios';

let host = 'http://127.0.0.1:8000';
// let host = 'http://api.keyou.site:8000';


// 登录
export const login = params => { return axios.post(`${host}/user/login/`, params) };