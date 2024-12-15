import styles from './cell.module.css';

const Cell = ({value, onChange}) => {
    function updateValue() {
        let nextValues = {
            "00": "10",
            "10": "01",
            "01": "00",
        };

        let nextValue = nextValues[value];

        onChange(nextValue);
    };

    function getBgColor() {
        let colorValues = {
            "00": "#fff",
            "10": "#b6ffc2",
            "01": "#ffadad",
        };

        return colorValues[value];
    }

    const displayValue = value === "00" ? "" : value;

    // return <div className={styles.cell} style={{ "backgroundColor": getBgColor() }} onMouseDown={updateValue}>{displayValue}</div>
    return <td 
    className='cell'
    // className={styles.cell} 
    style={{ "backgroundColor": getBgColor() }} onMouseDown={updateValue}>{displayValue}</td>
};

export default Cell;