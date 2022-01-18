import jwt from "jsonwebtoken"
import axios from "axios"

export function isAuthenticated() {
    

    const token = localStorage.getItem('token');
    if (!token) return;
    axios.defaults.headers.common['Authorization'] = "Bearer " + token;

    const date = new Date().getTime() / 1000;
    const data = jwt.decode(token);
    if (!data) return;
    if (date < data.exp)
        return true
    else
        return false
}

export const AuthMixin = {
    methods: {
        isAuthenticated
    }
}