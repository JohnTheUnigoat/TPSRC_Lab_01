const SignalDeleteButtonRow = ({labelData, onSignalDelete}) => {
    return <tr>
        <td></td>
        {labelData.state.map((_, index) =>
            <td key={index} style={{height: "2em", color: "red"}} onClick={() => onSignalDelete('state', index)}>X</td>)}
        {labelData.condition.map((_, index) =>
            <td key={index} style={{height: "2em", color: "red"}} onClick={() => onSignalDelete('condition', index)}>X</td>)}
        {labelData.control.map((_, index) =>
            <td key={index} style={{height: "2em", color: "red"}} onClick={() => onSignalDelete('control', index)}>X</td>)}
    </tr>
}

export default SignalDeleteButtonRow;