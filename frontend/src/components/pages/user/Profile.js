import api from '../../../utils/api'

import { useState, useEffect } from 'react'
import useFlashMessage from '../../../hooks/useFlashMessage'

import Input from '../../form/Input'
import RoundedImage from '../../layout/RoundedImage'

import formStyles from '../../form/Form.module.css'
import styles from './Profile.module.css'

function Profile() {
    const [user, setUser] = useState({})
    const [preview, setPreview] = useState()
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {
        api.get('/users/checkuser', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            setUser(response.data)
        })
    }, [token])

    function onFileChange(event) {
        setPreview(event.target.files[0])
        setUser({ ...user, [event.target.name]: event.target.files[0] })
    }

    function handleChange(event) {
        setUser({ ...user, [event.target.name]: event.target.value })
    }

    async function handleSubmit(event) {
        event.preventDefault()

        let type = 'success'

        const formData = new FormData()

        Object.keys(user).forEach(key => {
            formData.append(key, user[key])
        })

        const data = await api.patch('/users/edit', formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => response.data).catch(error => {
            type = 'error'
            return error.response.data
        })

        setFlashMessage(data.message, type)
    }

    return (
        <section>
            <div className={ styles.profile_header }>
                <h1>Perfil</h1>
                {(user.image || preview) && (
                    <RoundedImage
                        src={ preview ? 
                                URL.createObjectURL(preview) : 
                                `${process.env.REACT_APP_API}images/users/${user.image}` }
                        alt={ user.name }
                    />
                )}
            </div>
            <form onSubmit={ handleSubmit } className={ formStyles.form_container }>
                <Input 
                    type='file'
                    name='image'
                    text='Imagem de perfil'
                    handleOnChange={ onFileChange }
                />
                <Input 
                    type='email'
                    name='email'
                    text='E-mail'
                    placeholder='Digite o seu e-mail'
                    value={ user.email || '' }
                    handleOnChange={ handleChange }
                />
                <Input 
                    type='text'
                    name='name'
                    text='Nome'
                    placeholder='Digite o seu nome'
                    value={ user.name || '' }
                    handleOnChange={ handleChange }
                />
                <Input 
                    type='text'
                    name='phone'
                    text='Telefone'
                    placeholder='Digite o seu telefone'
                    value={ user.phone || '' }
                    handleOnChange={ handleChange }
                />
                <Input 
                    type='password'
                    name='password'
                    text='Senha'
                    placeholder='Digite a sua senha'
                    handleOnChange={ handleChange }
                />
                <Input 
                    type='password'
                    name='confirmpassword'
                    text='Confirmação de senha'
                    placeholder='Confirme a sua senha'
                    handleOnChange={ handleChange }
                />
                <input type='submit' value='Editar' />
            </form>
        </section>
    )
}

export default Profile