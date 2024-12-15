import './main.css'

import { useEffect, useState } from 'react'
import Step from './components/step';
import LabelSection from './components/label_section';
import SignalNames from './components/signal_names';

function getInitialLabelData() {
  return {
    state: [ "grabby thing", "pressure", "idk", "something else"],
    condition: ["heyo", "woah"],
    control: ["grab", "pump", "rotate"]
  }
}

function getInitialStepData() {
  return {
    state: [
      "00",
      "00",
      "00",
      "00",
    ],
    condition: [
      "00",
      "00",
    ],
    control: [
      "00",
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

  console.log(labelData);

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

  return <>

    <table>
      {/* <thead>
        <tr>
          <td rowSpan={2}>Step</td>
          <LabelSection values={labelData.state} onValuesChange={newLabels => updateLabelsValue('state', newLabels)} />
          <LabelSection values={labelData.condition} onValuesChange={newLabels => updateLabelsValue('condition', newLabels)} />
          <LabelSection values={labelData.control} onValuesChange={newLabels => updateLabelsValue('control', newLabels)} />
        </tr>
      </thead> */}
      <tbody>
        <tr>
          <td rowSpan={2}>Step</td>
          <LabelSection values={labelData.state} onValuesChange={newLabels => updateLabelsValue('state', newLabels)} />
          <LabelSection values={labelData.condition} onValuesChange={newLabels => updateLabelsValue('condition', newLabels)} />
          <LabelSection values={labelData.control} onValuesChange={newLabels => updateLabelsValue('control', newLabels)} />
            {/* <td></td> */}
        </tr>
        <tr>
          <SignalNames isInput={true} count={labelData.state.length + labelData.condition.length} />
          <SignalNames isInput={false} count={labelData.control.length} />
          {/* <td></td> */}

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
          />
        )}
      </tbody>
    </table>
  </>
}



export default App
