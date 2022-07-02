import { BsFillExclamationCircleFill, BsCheckCircleFill, BsXLg } from 'react-icons/bs'

import { useState, useEffect } from 'react'

import bus from '../../utils/bus'

import styles from './Message.module.css'

function Message() {
    const [visible, setVisible] = useState(false)
    const [showMessage, setShowMessage] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')

    useEffect(() => {
        bus.addListener('flash', ({ message, type }) => {
            setVisible(true)
            setShowMessage('showMessage')
            setMessage(message)
            setType(type)
    
            setTimeout(() => {
                setVisible(false)
            }, 5000)
        })
    }, [])

    return (
        <div className={ `${styles.message} ${styles[type]} ${visible ? styles.show : styles.hide} ${styles[showMessage]}` }>
            {type === 'success' 
            ? <BsCheckCircleFill className={ styles.icon_type_msg } /> 
            : <BsFillExclamationCircleFill className={ styles.icon_type_msg } /> }
            <span className={ styles.msg }>{ message }</span>
            <span onClick={ () => { setVisible(false) } } className={ styles.close_btn }>
                <BsXLg />
            </span>
        </div>
    )
}

export default Message