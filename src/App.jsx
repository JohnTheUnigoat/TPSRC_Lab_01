import './main.css'

import { useEffect, useState } from 'react'
import Step from './components/step';
import LabelSection from './components/label_section';
import SignalNames from './components/signal_names';
import SignalDeleteButtonRow from './components/signal_delete_button_row';

function getInitialLabelData() {
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

function App() {
  const [labelData, setLabelData] = useState(getInitialLabelData())

  const [steps, setSteps] = useState([
    getInitialStepData(),
    getInitialStepData(),
    getInitialStepData(),
  ]);

  const [selectedAddressCellIndex, setSelectedAddressCellIndex] = useState(null);
  const [selectedAddressTargetIndex, setSelectedAddressTargetIndex] = useState(null);

  useEffect(() => {
    if (selectedAddressCellIndex === null || selectedAddressTargetIndex === null) return;

    let selectedTargetStepNumber = selectedAddressTargetIndex + 1;
    let selectedTargetStepNumberBinary = selectedTargetStepNumber.toString(2).padStart(4, '0');

    let addressValue = selectedTargetStepNumberBinary.split('');

    let updatedSteps = [...steps];
    updatedSteps[selectedAddressCellIndex].address = addressValue;;

    setSteps(updatedSteps);

    setSelectedAddressCellIndex(null);
    setSelectedAddressTargetIndex(null);
  }, [selectedAddressCellIndex, selectedAddressTargetIndex])

  function updateLabelsValue(key, updatedLabels){
    let updatedLabelData = {...labelData};
    updatedLabelData[key] = updatedLabels;
    setLabelData(updatedLabelData)
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
    const newSignalNumber = labelData[key].length + 1;

    const newSignalName = ({
      'state': `State Input ${newSignalNumber}`,
      'condition': `Cond. Input ${newSignalNumber}`,
      'control': `Output ${newSignalNumber}`,
    })[key];

    setLabelData({
      ...labelData,
      [key]: [...labelData[key], newSignalName],
    });

    setSteps([...steps].map(step => ({
      ...step,
      [key]: [...step[key], "00"],
    })));
  }

  function deleteSignal(key, index) {
    const updatedLabelArray = [...labelData[key]];

    updatedLabelArray.splice(index, 1);

    const updatedLabelData = {
      ...labelData,
      [key]: updatedLabelArray,
    };

    setLabelData(updatedLabelData);

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

  const maxLabelLength = Math.max(...[...labelData.state, ...labelData.control, ...labelData.condition].map(label => label.length));

  return <>

    <table>
      <tbody>
        <tr>
          <td rowSpan={2}>Step</td>
          <LabelSection maxValuLength={maxLabelLength} values={labelData.state} onValuesChange={newLabels => updateLabelsValue('state', newLabels)} />
          <LabelSection maxValuLength={maxLabelLength} values={labelData.condition} onValuesChange={newLabels => updateLabelsValue('condition', newLabels)} />
          <LabelSection maxValuLength={maxLabelLength} values={labelData.control} onValuesChange={newLabels => updateLabelsValue('control', newLabels)} />
          <td>Address</td>
          <td></td>
        </tr>
        <tr>
          <SignalNames isInput={true} count={labelData.state.length + labelData.condition.length} />
          <SignalNames isInput={false} count={labelData.control.length} />
          <td></td>
          <td></td>
        </tr>
          {steps.map((step, index) =>
            <Step
              key={index}
              numberOfSteps={steps.length}
              stepNumber={index+1}
              stepData={step} onStepDataChange={newStep => updateStepValue(index, newStep)}
              isAddressSelected={selectedAddressCellIndex === index}
              onAddressClick={() => setSelectedAddressCellIndex(index)}
              onAddressTargetClick={() => setSelectedAddressTargetIndex(index)}
              onDeleteStep={deleteStep}
              onAddSignal={addSignal}
            />
          )}
          <SignalDeleteButtonRow labelData={labelData} onSignalDelete={deleteSignal} />
          <tr>
            <td
              colSpan={labelData.state.length + labelData.condition.length + labelData.control.length + 6}
              style={{color: "#777"}}
              onClick={() => addStep()}
            >+</td>
          </tr>
      </tbody>
    </table>
  </>
}



export default App
