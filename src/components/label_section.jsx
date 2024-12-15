import styles from './label_section.module.css'

const LabelSection = ({values, onValuesChange}) => {
    function updateValue(index, newvalue) {
        let newValues = [...values];
        newValues[index] = newvalue;
        onValuesChange(newValues);
    }

    const tdStyle = {
        writingMode: "vertical-lr",
        textOrientation: "mixed",
        transform: "rotate(180deg)",
    }

    return <>
        {values.map((value, index) => 
            <td key={index} style={tdStyle} >{value}</td>
        )}
    </>
}

export default LabelSection;