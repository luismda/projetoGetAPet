import { useState } from 'react'

import Input from './Input'

import formStyles from './Form.module.css'
import Select from './Select'

function PetForm({ handleSubmit, petData, btnText }) {
    const [pet, setPet] = useState(petData || {}) 
    const [preview, setPreview] = useState([])
    const colors = ['Branco', 'Preto', 'Cinza', 'Caramelo', 'Marrom', 'Mesclado']

    function onFileChange(event) {
        setPreview(Array.from(event.target.files))
        setPet({ ...pet, images: [...event.target.files] })
    }

    function handleChange(event) {
        setPet({ ...pet, [event.target.name]: event.target.value })
    }

    function onColorChange(event) {
        setPet({ ...pet, color: event.target.options[event.target.selectedIndex].text })
    }

    function submit(event) {
        event.preventDefault()
        
        handleSubmit(pet)
    }

    return (
        <form onSubmit={ submit } className={ formStyles.form_container }>
            <div className={ formStyles.preview_pet_images }>
                {preview.length > 0
                ? preview.map((image, index) => (<span key={ `${pet.name}${index}` }><img 
                    src={ URL.createObjectURL(image) } 
                    alt={ pet.name } /></span>))
                : pet.images && pet.images.map((image, index) => (<span key={ `${pet.name}${index}` }><img 
                    src={ `${process.env.REACT_APP_API}images/pets/${image}` } 
                    alt={ pet.name } /></span>))
                } 
            </div>
            <Input 
                type='file'
                text='Imagens do Pet'
                name='images'
                handleOnChange={ onFileChange }
                multiple={ true }
            />
            <Input 
                type='text'
                text='Nome'
                name='name'
                value={ pet.name || '' }
                placeholder='Digite o nome do Pet'
                handleOnChange={ handleChange }
            />
            <Input 
                type='text'
                text='Idade'
                name='age'
                value={ pet.age || '' }
                placeholder='Digite a idade do Pet'
                handleOnChange={ handleChange }
            />
            <Input 
                type='text'
                text='Peso'
                name='weight'
                value={ pet.weight || '' }
                placeholder='Digite o peso do Pet'
                handleOnChange={ handleChange }
            />
            <Select 
                text='Cor do Pet'
                name='color'
                options={ colors }
                value={ pet.color || '' }
                handleOnChange={ onColorChange }
            />
            <input type='submit' value={ btnText } />
        </form>
    )
}

export default PetForm