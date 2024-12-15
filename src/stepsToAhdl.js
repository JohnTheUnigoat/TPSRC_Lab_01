export default function generateAHDLFromSteps(steps)
{
    return `-- BPS
${generateBPS(steps)}

--BPP
${generateBPP(steps)}

--BPK
${generateBPK(steps)}`;
}

function generateBPS(steps) // addr[n] => desired_state[k][2], ot (ot is always 0)
{
    let q = Math.ceil(Math.log2(steps.length));
    let k = steps[0].state.length;

    let ahdlResult =
`PARAMETERS
(
    q = ${q},
    k = ${k}
);
SUBDESIGN bps
(
    adr[q..1]              : INPUT;
    vec_Ai[1..k][1..2], ot : OUTPUT
)
BEGIN
TABLE
    adr[q..1] => vec_Ai[1..k][1..2], ot;`;

    for(let i = 0; i < steps.length; i++)
    {
        let stateHdl = steps[i].state.map(x => `b"${x}"`).join(',');
        ahdlResult += `\n    ${i+1} => (${stateHdl}),b"0";`;
    }

    ahdlResult +=
`
END TABLE;
END;`;

    return ahdlResult;
}

function generateBPP(steps) // condition[l] => addr[n]
{
    let addressBits = Math.ceil(Math.log2(steps.length))

    let u = steps[0].condition.length;
    let q = addressBits;

    let ahdlResult =
`PARAMETERS
(
    u = ${u},
    q = ${q}
);
SUBDESIGN bpp
(
-- conditions and address of current line
    vec_b[1..u], adr[q..1] : INPUT;
    sp_adr[q..1]           : OUTPUT
)
BEGIN
TABLE
    vec_b[1..u] => sp_addr[q..1];`;

    let stepsHavingGoTo = steps
    .map((x, i) => ({ stepNumber: i + 1, stepData: x}))
    .filter(x => x.stepData.address !== null)

    let lastStepNumberBaseTwo = (steps.length - 1).toString(2);

    for (let i = 0; i < stepsHavingGoTo.length; i++)
    {
        let baseTwoStepNumber = stepsHavingGoTo[i].stepNumber.toString(2).padStart(lastStepNumberBaseTwo.length, '0');

        let conditionX = castFullConditionsIntoX(stepsHavingGoTo[i].stepData.condition);

        ahdlResult += `\n    b"${baseTwoStepNumber}", b"${conditionX}" => ${stepsHavingGoTo[i].stepData.address.binaryValue};`;
    }

    ahdlResult +=
`
END TABLE;
END;
`;

    return ahdlResult;
}

function generateBPK(steps) // addr[n] => command[m], endsp
{
    let q = steps.length;
    let m = steps[0].control.length * 2;

    let ahdlResult =
`PARAMETERS
(
    q = ${q},
    m = ${m}
);
SUBDESIGN bpk
(
    adr[q..1]          : INPUT;
    vec_c[1..m], endsp : OUTPUT
)
BEGIN
TABLE
    adr[q..1] => vec_c[1..m], endsp;
-- pochatkove vstanoclennja
    0 => b"${"0".repeat(m)}", b"1";`;

    for (let i = 0; i < q; i++)
    {
        let controlValues = steps[i].control.join('');
        ahdlResult += `\n    ${i+1} => b"${controlValues}", b"${+(controlValues == false)}";`
    }

    ahdlResult +=
`
END TABLE;
END;
`;

    return ahdlResult;
}

function castFullConditionsIntoX(conditions)
{
    let result = "";

    for (let i = 0; i < conditions.length; i++)
    {
        result += castConditionIntoX(conditions[i]);
    }

    return result;
}

function castConditionIntoX(condition)
{
    if (condition === "00")
        return "x";
    if (condition === "01")
        return "0";
    if (condition === "10")
        return "1";
}