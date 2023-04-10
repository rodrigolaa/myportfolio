import styles from './styles.module.scss'
import Image from 'next/image'
import techsImage from '../../../public/images/techs.svg'

export default function Footer(){
    return(
        <>
        <div className={styles.container}>
            <Image src={techsImage} alt='tech image'/>
            <h2>Mais de <span className={styles.alunoContent}> 15 mil </span> já levaram sua carreira ao próximo nivel.</h2>
            <span>E você vai perder a chance de evoluir de uma vez por todas?</span>
            <a>
                <button>
                    Start Now
                </button>
            </a>
        </div>
        </>
    )
}