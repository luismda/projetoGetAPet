import api from '../../../utils/api'

import { useState, useEffect } from 'react'
import useFlashMessage from '../../../hooks/useFlashMessage'

import { Link } from 'react-router-dom'

import RoundedImage from '../../layout/RoundedImage'
import Loading from '../../layout/Loading'

import styles from './Dashboard.module.css'

function MyPets() {
    const [pets, setPets] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')
    const [removeLoading, setRemoveLoading] = useState(false)
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {
        api.get('/pets/mypets', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
        .then(response => {
            setPets(response.data.pets)
            setRemoveLoading(true)
        })
    }, [token])

    async function removePet(id) {
        let type = 'success'

        const data = await api.delete(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
        .then(response => {
            const updatedPets = pets.filter(pet => pet._id !== id)
            setPets(updatedPets)

            return response.data
        })
        .catch(error => {
            type = 'error'
            return error.response.data
        })

        setFlashMessage(data.message, type)
    }

    async function concludeAdoption(id) {
        let type = 'success'
        
        const data = await api.patch(`/pets/conclude/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
        .then(response => response.data)
        .catch(error => {
            type = 'error'
            return error.response.data
        })

        let petsUpdated = []

        pets.forEach(pet => {
            if (pet._id === id) {
                pet.available = false
                petsUpdated.push(pet)
                return
            }
            
            petsUpdated.push(pet)
        })

        setPets(petsUpdated)

        setFlashMessage(data.message, type)
    }

    return (
        <section>
            <div className={ styles.petlist_header }>
                <h1>Meus Pets</h1>
                <Link to='/pet/add'>Cadastrar Pet</Link>
            </div>
            <div className={ styles.petlist_container }>
                {!pets.length && removeLoading ? (
                    <p>Você ainda não cadastrou nenhum pet.</p>
                ) : (
                    pets.map(pet => (
                        <div className={ styles.petlist_row } key={ pet._id }>
                            <RoundedImage 
                                src={ `${process.env.REACT_APP_API}images/pets/${pet.images[0]}` }
                                alt={ pet.name }
                                width='px75'
                            />
                            <span className={ `bold ${ styles.pet_name }` }>{ pet.name }</span>
                            <div className={ styles.actions }>
                                {pet.available ? (
                                    <>
                                        {pet.adopter && (
                                            <button className={ styles.conclude_btn } onClick={ () => {
                                                concludeAdoption(pet._id)
                                            } }>Concluir adoção</button>
                                        )}
                                        <Link to={ `/pet/edit/${pet._id}` }>Editar</Link>
                                        <button className={ styles.delete } onClick={ () => { removePet(pet._id) } } >Excluir</button>
                                    </>
                                ) : (
                                    <p className={ styles.adopted_text }>Adoção concluída</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {!removeLoading && <Loading />}
            </div>
        </section>
    )
}

export default MyPets