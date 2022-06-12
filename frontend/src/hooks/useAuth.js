import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useFlashMessage from './useFlashMessage'

import api from '../utils/api'

function useAuth() {
    const { setFlashMessage } = useFlashMessage()
    const [authenticated, setAuthenticated] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            setAuthenticated(true)
        }
    }, [])
    
    async function register(user) {
        let message = 'Cadastro realizado com sucesso!'
        let type= 'success'

        try {
            const data = await api.post('/users/register', user).then(response => response.data)

            await authUser(data)
        } catch (error) {
            message = error.response.data.message
            type = 'error'
        }

        setFlashMessage(message, type)
    }

    async function login(user) {
        let msg = 'Seja bem-vindo(a) novamente!'
        let type = 'success'

        try {
            const data = await api.post('/users/login', user).then(response => response.data)

            authUser(data)
        } catch (error) {
            msg = error.response.data.message
            type = 'error'
        }

        setFlashMessage(msg, type)
    }

    function logout() {
        const msg = 'Logout realizado com sucesso!'
        const type = 'success'

        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = undefined
        navigate('/')

        setFlashMessage(msg, type)
    }

    async function authUser(data) {
        setAuthenticated(true)

        localStorage.setItem('token', JSON.stringify(data.token))

        navigate('/')
    }

    return { authenticated, register, login, logout }
}

export default useAuth