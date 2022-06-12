import api from '../../../utils/api'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import useFlashMessage from '../../../hooks/useFlashMessage'

import PetForm from '../../form/PetForm'

import styles from './AddPet.module.css'

function EditPet() {
    const [pet, setPet] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const { id } = useParams()
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {
        api.get(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            setPet(response.data.pet)
        })
    }, [token, id])

    async function updatePet(pet) {
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

        const data = await api.patch(`/pets/${pet._id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
        .then(response => response.data)
        .catch(error => {
            type = 'error'
            return error.response.data
        })

        setFlashMessage(data.message, type)
    }

    return (
        <section>
            <div className={ styles.addpet_header }>
                <h1>Editando o Pet: { pet.name }</h1>
                <p>Após a edição os dados serão atualizados no sistema</p>
            </div>
            {pet.name && 
                <PetForm handleSubmit={ updatePet } btnText='Atualizar' petData={ pet } />
            }
        </section>
    )
}

export default EditPet