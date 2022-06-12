import { useState, useEffect } from 'react'

import bus from '../../utils/bus'

import styles from './Message.module.css'

function Message() {
    const [visible, setVisible] = useState(false)
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')

    useEffect(() => {
        bus.addListener('flash', ({ message, type }) => {
            setVisible(true)
            setMessage(message)
            setType(type)
    
            setTimeout(() => {
                setVisible(false)
            }, 5000)
        })
    }, [])

    return (
        visible && (
            <div className={ `${styles.message} ${styles[type]}` }>{ message }</div>
        )
    )
}

export default Message