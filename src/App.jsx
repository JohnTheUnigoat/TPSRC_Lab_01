import './main.css'

import { useEffect, useRef, useState } from 'react'
import Step from './components/step';
import LabelSection from './components/label_section';
import SignalNames from './components/signal_names';
import SignalDeleteButtonRow from './components/signal_delete_button_row';
import generateAHDLFromSteps from './stepsToAhdl';

function getInitialLabels() {
  return {
    state: [ "State Input 1", "State Input 2", "State Input 3"],
    condition: ["Cond. Input 1", "Cond. Input 2", "Cond. Input 3"],
    control: ["Output 1", "Output 2"]
  }
}

function getInitialStepData() {
  return {
    state: [
      "00",
      "00",
      "00",
    ],
    condition: [
      "00",
      "00",
      "00",
    ],
    control: [
      "00",
      "00",
    ],
    address: null
  };
}

function getInitialSteps() {
  return [
    getInitialStepData(),
    getInitialStepData(),
    getInitialStepData(),
  ];
}

function App() {
  const [labels, setLabels] = useState(getInitialLabels())
  const [steps, setSteps] = useState(getInitialSteps());
  const [isSaved, setIsSaved] = useState(true);
  
  const fileInputRef = useRef(null);

  useEffect(() => {setIsSaved(false)}, [steps, labels]);

  function updateLabelsValue(key, updatedLabels){
    let updatedLabelData = {...labels};
    updatedLabelData[key] = updatedLabels;
    setLabels(updatedLabelData)
  }

  function updateStepValue(index, updatedStep){
    let updatedList = [...steps];
    updatedList[index] = updatedStep;
    setSteps(updatedList);
  }

  function addStep() {
    const sampleStep = steps[0];
    const stateCount = sampleStep.state.length;
    const conditionCount = sampleStep.condition.length;
    const controlCount = sampleStep.control.length;

    function getZeroValues(count) {
      return [...Array(count).keys()].map(_ => "00");
    }

    const newStep = {
      state: getZeroValues(stateCount),
      condition: getZeroValues(conditionCount),
      control: getZeroValues(controlCount),
      address: null,
    };

    setSteps([...steps, newStep]);
  }

  function deleteStep(index) {
    let stepsCopy = [...steps];
    stepsCopy.splice(index, 1);
    setSteps(stepsCopy);
  }

  function addSignal(key) {
    const newSignalNumber = labels[key].length + 1;

    const newSignalName = ({
      'state': `State Input ${newSignalNumber}`,
      'condition': `Cond. Input ${newSignalNumber}`,
      'control': `Output ${newSignalNumber}`,
    })[key];

    setLabels({
      ...labels,
      [key]: [...labels[key], newSignalName],
    });

    setSteps([...steps].map(step => ({
      ...step,
      [key]: [...step[key], "00"],
    })));
  }

  function deleteSignal(key, index) {
    const updatedLabelArray = [...labels[key]];

    updatedLabelArray.splice(index, 1);

    const updatedLabelData = {
      ...labels,
      [key]: updatedLabelArray,
    };

    setLabels(updatedLabelData);

    const stepsCopy = [...steps]

    const updatedSteps = stepsCopy.map(step => {
      const updatedValuesArray = [...step[key]]

      updatedValuesArray.splice(index, 1)

      const updatedStep = {
        ...step,
        [key]: updatedValuesArray,
      }

      return updatedStep;
    });

    setSteps(updatedSteps)
  }
  
  function saveToJson() {
    const data = JSON.stringify({labels, steps});
    saveFile(data, 'table_program.json');
    setIsSaved(true);
  }

  function triggerLoadFromJson() {
    if (!isSaved && !confirm("You have unsaved changes - are you sure you want to override your table?")) return;

    fileInputRef.current.click();
  }

  async function loadFromJson(file) {
    const text = await file.text();
    const data = JSON.parse(text);

    setLabels(data.labels);
    setSteps(data.steps);
    setIsSaved(true);
  }

  function exportAhdl() {
    const data = generateAHDLFromSteps(steps);
    saveFile(data, 'modules.tdf');
  }

  function saveFile(text, fileName) {

    const blob = new Blob([text], {
      type: 'application/json'
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  function reset() {
    if (!isSaved && !confirm("You have unsaved changes - are you sure you want to reset?")) return;

    setLabels(getInitialLabels());
    setSteps(getInitialSteps());
    setIsSaved(false);
  }

  const maxLabelLength = Math.max(...[...labels.state, ...labels.control, ...labels.condition].map(label => label.length));

  return <>
    <table style={{marginBottom: "1em"}}>
      <tbody>
        <tr>
          <td rowSpan={2}>Step</td>
          <LabelSection maxValuLength={maxLabelLength} values={labels.state} onValuesChange={newLabels => updateLabelsValue('state', newLabels)} />
          <LabelSection maxValuLength={maxLabelLength} values={labels.condition} onValuesChange={newLabels => updateLabelsValue('condition', newLabels)} />
          <LabelSection maxValuLength={maxLabelLength} values={labels.control} onValuesChange={newLabels => updateLabelsValue('control', newLabels)} />
          <td>Address</td>
          <td></td>
        </tr>
        <tr>
          <SignalNames isInput={true} count={labels.state.length + labels.condition.length} />
          <SignalNames isInput={false} count={labels.control.length} />
          <td></td>
          <td></td>
        </tr>
          {steps.map((step, index) =>
            <Step
              key={index}
              numberOfSteps={steps.length}
              stepNumber={index+1}
              stepData={step} onStepDataChange={newStep => updateStepValue(index, newStep)}
              onDeleteStep={() => deleteStep(index)}
              onAddSignal={addSignal}
            />
          )}
          <SignalDeleteButtonRow labelData={labels} onSignalDelete={deleteSignal} />
          <tr>
            <td
              colSpan={labels.state.length + labels.condition.length + labels.control.length + 6}
              style={{color: "#777", height: "1.5em"}}
              onClick={() => addStep()}
            >+</td>
          </tr>
      </tbody>
    </table>

    <button onClick={() => saveToJson()}>Save (JSON)</button>
    <button onClick={() => triggerLoadFromJson()}>Load (JSON)</button>
    <input type="file" accept='.json' onChange={e => loadFromJson(e.target.files[0])} ref={fileInputRef} style={{display: "none"}} />
    <button onClick={() => exportAhdl()}>Export (AHDL)</button>
    <button onClick={() => reset()}>Reset</button>
  </>
}

export default App
