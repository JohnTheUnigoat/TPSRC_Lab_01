import Label from './label'

const LabelSection = ({maxValuLength, values, onValuesChange}) => {
    function updateValue(index, newValue) {
        let newValues = [...values];
        newValues[index] = newValue;
        onValuesChange(newValues);
    }

    return <>
        {values.map((value, index) => 
            <Label key={index} maxValuLength={maxValuLength} value={value} onChange={newValue => updateValue(index, newValue)} />
        )}
        <td rowSpan={2}></td>
    </>
}

export default LabelSection;