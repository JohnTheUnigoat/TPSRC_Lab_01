import styles from './label.module.css'

const Label = ({value, onChange}) => {
    return <input type='text' value={value} onChange={onChange} />
}

export default Label;