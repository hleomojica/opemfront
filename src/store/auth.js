/* eslint-disable no-console */
//import config from "../config"
import axios from "axios"
import jwt from "jsonwebtoken"
import router from '../Routes'
import CryptoJS from 'crypto-js'

export default {
    namespaced: true,
    state: {
        isFetching: false,
        errorMessage: '',
        currentUser: null,
        menu: null
    },
    mutations: {
        LOGIN_FAILURE(state, payload) {
            state.isFetching = false
            state.errorMessage = payload
            state.currentUser = null
        },
        LOGIN_SUCCESS(state, user) {
            state.isFetching = false
            state.errorMessage = ''
            state.currentUser = user || null
        },
        MENU_ROL(state, menu) {
            state.menu = menu || null
        },
        LOGIN_REQUEST(state) {
            state.isFetching = true
        },
        getCurrentuser(state, user) {
            state.currentUser = user
        }
    },
    actions: {
        async findMe({
            dispatch
        }) {
            try {
                const response = await axios.get('/auth/me')
                return response.data
            } catch (e) {
                dispatch('logoutUser')
            }
        },
        async doInit({
            commit
        }, res) {
            try {
                let currentUser = null;
                let token = localStorage.getItem('token');
                if (token) {
                    currentUser = res.data.dataUser; // use dispatch to call another action                     
                }
                commit('LOGIN_SUCCESS', currentUser)
            } catch (e) {
                commit('LOGIN_FAILURE', e)
            }
        },
        getcurrent({
            commit
        }) {
            let current = localStorage.getItem("datauser")
            commit('getCurrentuser', JSON.parse(current))
        },
        async loginUser({
            dispatch
        }, payload) {
            let url = "/cuentaacceso/auth";

            dispatch('requestLogin') // Setting the loading flag
            if (payload.password && payload.username) {
                try {
                    const res = await axios.post(url, payload)
                    const token = res.data
                    dispatch('receiveToken', token)

                    const resmod = await axios.get(`/modulos?idrol=${token.dataUser.idroles_cue}`)
                    const menu = resmod.data

                    dispatch('receiveMenu', menu)
                    dispatch('doInit', res)

                } catch (e) {
                    this._vm.$toasted.show('Error: ' + e, {
                        type: 'error'
                    })
                    dispatch('loginError', e.response.data)
                }
            } else {
                dispatch('loginError', 'Something was wrong. Try again')
            }
        },
        receiveMenu({
            commit
        }, data) {

            const encrMenu = CryptoJS.AES.encrypt(JSON.stringify(data), "staencripmaschimba").toString();
            localStorage.setItem("menu", encrMenu);
            commit('MENU_ROL')
            router.push('/')
        },
        receiveToken({
            commit
        }, data) {

            let token = data.accesToken
            let user = jwt.decode(token)
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('datauser', JSON.stringify(data.dataUser))
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            commit('LOGIN_SUCCESS')
        },
        logoutUser() {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem("menu");
            localStorage.removeItem("datauser");
            axios.defaults.headers.common['Authorization'] = ""
            router.push('/login')
        },
        loginError({
            commit
        }, payload) {
            commit('LOGIN_FAILURE', payload)
        },
        requestLogin({
            commit
        }) {
            commit('LOGIN_REQUEST')
        },
        receiveLogin({
            commit
        }) {
            commit('LOGIN_SUCCESS');
        },
    },
}