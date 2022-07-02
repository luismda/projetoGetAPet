import api from '../../../utils/api'

import { useState, useEffect } from 'react'

import RoundedImage from '../../layout/RoundedImage'
import Loading from '../../layout/Loading'

import styles from './Dashboard.module.css'
import adoptionsStyles from './MyAdoptions.module.css'

function MyAdoptions() {
    const [pets, setPets] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')
    const [removeLoading, setRemoveLoading] = useState(false)

    useEffect(() => {
        api.get('/pets/myadoptions', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
        .then(response => {
            setPets(response.data.pets)
            setRemoveLoading(true)
        })
    }, [token])

    return (
        <section>
            <div className={ styles.petlist_header }>
                <h1>Minhas adoções</h1>
            </div>
            <div className={ styles.petlist_container }>
                {!pets.length && removeLoading ? (
                    <p>Você ainda não fez nenhuma adoção.</p>
                ) : (
                    <>
                        {pets.map((pet, index) => (
                            <div className={ `${styles.petlist_row} ${adoptionsStyles.adoption_row}` } key={ index }>
                                <div className={ adoptionsStyles.pet_info }>
                                    <RoundedImage 
                                        src={ `${process.env.REACT_APP_API}images/pets/${pet.images[0]}` }
                                        alt={ pet.name }
                                        width='px75'
                                    />
                                    <span className={ `bold ${styles.pet_name}` }>{ pet.name }</span>
                                    <div className={ styles.actions }>
                                        {pet.available ? (
                                            <p>Adoção em processo</p>
                                        ) : (
                                            <p className={ adoptionsStyles.conclude_text }>Adoção concluída</p>
                                        )}
                                    </div>
                                </div>
                                {pet.available && 
                                    <div className={ adoptionsStyles.user_info }>
                                        <hr />
                                        <p>
                                            <span className='bold'>Ligue para:</span> { pet.user.phone }
                                        </p>
                                        <p>
                                            <span className='bold'>Fale com:</span> { pet.user.name }
                                        </p>
                                    </div>
                                }
                            </div>
                        ))}
                    </> 
                )}
                {!removeLoading && <Loading />}
            </div>
        </section>
    )
}

export default MyAdoptions