import api from '../../utils/api'

import { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'

import styles from './Home.module.css'

function Home() {
    const [pets, setPets] = useState([])

    useEffect(() => {
        api.get('/pets').then(response => {
            setPets(response.data.pets)
        })
    }, [])

    return (
        <section>
            <div className={ styles.pet_home_header }>
                <h1>Adote um Pet</h1>
                <p>Veja todos os pets e conheça o tutor deles</p>
            </div>
            <div className={ styles.pet_home_container }>
                {pets.length === 0 &&
                    <p>Não há pets cadastrados ou disponíveis para adoção.</p>
                }
                {pets.map(pet => (
                    <div className={ styles.pet_home_card } key={ pet._id }>
                        <div 
                            className={ styles.pet_home_card_image }
                            style={ { backgroundImage: `url(${process.env.REACT_APP_API}images/pets/${pet.images[0]})` } }
                        ></div>
                        <h3>{ pet.name }</h3>
                        <p>
                            <span className='bold'>Peso:</span> { pet.weight }Kg
                        </p>
                        {pet.available ? (
                            <Link to={ `/pet/${pet._id}` }>Mais detalhes</Link>
                        ) : (
                            <p className={ styles.adopted_text }>Adotado</p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Home