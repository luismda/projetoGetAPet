import styles from './RoundedImage.module.css'

function RoundedImage({ src, alt, width }) {
    return (
        <span className={`${styles.rounded_image}  ${styles[width]}`}>
            <img 
                src={src}
                alt={alt}
            />
        </span>
    )
}

export default RoundedImage