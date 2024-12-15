import { useEffect, useMemo, useState, useRef } from 'react';

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
            let newAddressValue = {
                ...addressValue,
                binaryValue: addressValue.binaryValue.padStart(bitCount, '0')
            }

            console.log("updating address value", {newAddressValue, bitCount, currLength: addressValue.binaryValue.length})
            onAddressValueChange(newAddressValue);
        }

        console.log("updating address value", {newAddressValue: null, bitCount, currLength: addressValue.binaryValue.length})
        onAddressValueChange(null);
    }, [bitCount])

    useEffect(() => {
        if (isEditMode) {
            selectRef.current?.focus();
        }
    }, [isEditMode])

    function handleSelectOption(index) {
        onAddressValueChange(addressValues[index]);
        setIsEditMode(false);
    }

    const getDisplayValue = addressValue => addressValue
        ? <>{addressValue.binaryValue} ({addressValue.decimalValue})</>
        : '';

    return <td
            style={{ position: "relative", width: `${bitCount + 4}em`}}
        >
            <div  style={{height: "1.25em"}} onClick={() => setIsEditMode(true)}>
                {getDisplayValue(addressValue)}
            </div>
            {isEditMode && <select
                style = {{position: "absolute", top: 0, left: 0, right: 0, zIndex: 2}}
                value={addressValues.indexOf(addressValue)}
                onChange={() => {}}
                size={addressValues.length}
                ref={selectRef}>
                    {addressValues.map((addressValueOption, index) => 
                        <option key={index} value={index} onClick={e => handleSelectOption(+e.target.value)}>{getDisplayValue(addressValueOption)}</option>
                    )}
            </select>}
    </td>;
}

export default AddressSection;