import { useEffect, useMemo, useState, useRef } from 'react';
import styles from './address_section.module.css'

const AddressSection = ({numberOfSteps, stepNumber, addressValue, onAddressValueChange}) => {
    const [isEditMode, setIsEditMode] = useState(false);

    const selectRef = useRef(null);

    const bitCount = useMemo(() => Math.ceil(Math.log2(numberOfSteps)), [numberOfSteps]);

    const addressValues = useMemo(() => {
        let res = [...Array(numberOfSteps).keys()]
            .map(x => x + 1)
            .filter(decimalValue => decimalValue !== stepNumber)
            .map(decimalValue => {
                const binaryValue = decimalValue.toString(2).padStart(bitCount, '0');

                return {decimalValue, binaryValue};
            });

        return [null, ...res];
    }, [numberOfSteps, stepNumber, bitCount]);

    useEffect(() => {
        if (!addressValue) return;

        if (addressValue.binaryValue.length === bitCount) return;

        if (addressValue.binaryValue.length < bitCount) {
            let newAddressValue = {...addressValue}
            newAddressValue.binaryValue.padStart(bitCount, '0');

            onAddressValueChange(newAddressValue);
        }

        onAddressValueChange(null);
    }, [bitCount])

    useEffect(() => {
        console.log("reacting to isEdit")
        if (isEditMode) {
            console.log("should click thing", selectRef )
            selectRef.current?.focus();
        }
    }, [isEditMode])

    function handleChange(e) {
        let index = +e.target.value;
        onAddressValueChange(addressValues[index]);
        setIsEditMode(false);
    }

    const getDisplayValue = addressValue => addressValue
        ? <>{addressValue.binaryValue} ({addressValue.decimalValue})</>
        : '';

    console.log(stepNumber)

    return <td
            style={{ position: "relative", width: `${bitCount + 4}em`}}
        >
            <div  style={{height: "1.25em"}} onClick={() => setIsEditMode(true)}>
                {getDisplayValue(addressValue)}
            </div>
            {isEditMode && <select
                style = {{position: "absolute", top: 0, left: 0, right: 0, zIndex: 2}}
                value={addressValues.indexOf(addressValue)}
                onChange={handleChange}
                size={addressValues.length}
                ref={selectRef}>
                    {addressValues.map((addressValueOption, index) => 
                        <option key={index} value={index}>{getDisplayValue(addressValueOption)}</option>
                    )}
            </select>}
    </td>

    if (isEditMode) {
        return <td style={{position: "relative", width: `${bitCount + 4}em`}}>
            <select style = {{position: "relative"}} value={addressValues.indexOf(addressValue)} onChange={handleChange} size={addressValues.length} >
                {addressValues.map((addressValueOption, index) => 
                    <option key={index} value={index}>{getDisplayValue(addressValueOption)}</option>
                )}
            </select>
        </td>
    } else {
        return <td style={{position: "relative", width: `${bitCount + 4}em`}}>
            <div style={{position: "absolute", inset: 0}} onClick={() => setIsEditMode(true)}>{getDisplayValue(addressValue)}</div>
        </td>;
    }
}

export default AddressSection;