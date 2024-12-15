import { useState } from "react";

const Label = ({maxValuLength, value, onChange}) => {
    const [isEditMode, setIsEditMode] = useState(false);

    const tdStyle = {
        height: `${maxValuLength + 4}ch`,
        width: "2em",
        writingMode: "vertical-lr",
        textOrientation: "mixed",
        transform: "rotate(180deg)",
    }

    return <td style={tdStyle}>
        {isEditMode
            ? <input type='text' autoFocus value={value} size={maxValuLength} onChange={e => onChange(e.target.value)} onBlur={() => setIsEditMode(false)} />
            : <div
                style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}
                onClick={() => setIsEditMode(true)}
            >
                {value}
            </div>}
    </td> 
}

export default Label;