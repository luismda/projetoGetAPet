import api from '../../../utils/api'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useFlashMessage from '../../../hooks/useFlashMessage'

import PetForm from '../../form/PetForm'

import styles from './AddPet.module.css'

function AddPet() {
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    async function registerPet(pet) {
        let type = 'success'

        const formData = new FormData()

        Object.keys(pet).forEach(key => {
            if (key === 'images') {
                pet[key].forEach(image => {
                    formData.append('images', image)
                })

                return
            }
            
            formData.append(key, pet[key])
        })

        const data = await api.post('pets/create', formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => response.data)
        .catch(error => {
            type = 'error'
            return error.response.data
        })

        setFlashMessage(data.message, type)

        if (type === 'success') {
            navigate('/pet/mypets')
        }
    }

    return (
        <section className={ styles.addpet_header }>
            <div>
                <h1>Cadastre um Pet</h1>
                <p>Ele ficará disponível para adoção</p>
            </div>
            <PetForm handleSubmit={ registerPet } btnText='Cadastrar Pet' />
        </section>
    )
}   

export default AddPet