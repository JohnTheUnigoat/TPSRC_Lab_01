import { useMemo } from "react";

const SignalNames = ({isInput, count}) => {
    const signalNames = useMemo(() => {
        const numbers = [...Array(count).keys()].map(x => x+1);
        return numbers.map(x => isInput ? `In${x}` : `Out${x}`);
    }, [isInput, count])

    return <>
        {signalNames.map(name => 
            <td key={name}>{name}</td>
        )}
    </>
}

export default SignalNames;