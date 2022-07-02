import api from '../../../utils/api'

import { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'

import { Context } from '../../../context/UserContext'

import useFlashMessage from '../../../hooks/useFlashMessage'

import Loading from '../../layout/Loading'

import styles from './PetDetails.module.css'

function PetDetails() {
    const [pet, setPet] = useState({})
    const { id } = useParams()
    const [token] = useState(localStorage.getItem('token') || '')
    const [removeLoading, setRemoveLoading] = useState(false)
    const { setFlashMessage } = useFlashMessage()
    const { authenticated } = useContext(Context)

    useEffect(() => {
        api.get(`/pets/${id}`).then(response => {
            setPet(response.data.pet)
            setRemoveLoading(true)
        })
    }, [id])

    async function schedule() {
        let type = 'success'

        const data = await api.patch(`/pets/schedule/${pet._id}`, {}, {
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
            <>
                {pet.name && (
                    <section className={ styles.pet_details_container }>
                        <div className={ styles.pet_details_header }>
                            <h1>Conhecendo o Pet: { pet.name }</h1>
                            <p>Se tiver interesse, marque uma visita para conhecê-lo</p>
                        </div>
                        <div className={ styles.pet_images }>
                            {pet.images.map((image, index) => (
                                <span key={ index }>
                                    <img 
                                        src={ `${process.env.REACT_APP_API}images/pets/${image}` }
                                        alt={ pet.name }
                                    />
                                </span>
                            ))}
                        </div>
                        <p>
                            <span className='bold'>Peso:</span> { pet.weight }Kg
                        </p>
                        <p>
                            <span className='bold'>Idade:</span> { pet.age } {pet.age > 1 ? <>anos</> : <>ano</>}
                        </p>
                        {authenticated ? (
                            <button onClick={ schedule }>Solicitar visita</button>
                        ) : (
                            <p>Você precisa <Link to='/register'>criar uma conta</Link> para solicitar uma visita.</p>
                        )}
                    </section>
                )}
                {!removeLoading && <Loading />}
            </>
        </section>
    )
}

export default PetDetails