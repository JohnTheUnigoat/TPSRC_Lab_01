import AddressSection from './address_section';
import StepSection from './step_section';

const Step = ({
    numberOfSteps,
    stepNumber,
    stepData, onStepDataChange,
    onDeleteStep,
    onAddSignal,
}) => {
    function updateSectionItems(key, newItems) {
        let newStep = {
          ...stepData,
          [key]: newItems,
        };
    
        onStepDataChange(newStep);
    }

    function updateAddressSection(newAddressValue) {
        let newStep = {
            ...stepData,
            address: newAddressValue,
        };

        onStepDataChange(newStep);
    }

    return <tr>
        <td>{stepNumber}</td>
        <StepSection
            sectionItems={stepData.state} onSectionItemsChange={items => updateSectionItems('state', items)}
            includeAddButton={stepNumber == 1} addButtonRowSpan={numberOfSteps + 1} onAddSignal={() => onAddSignal('state')}
        />

        <StepSection
            sectionItems={stepData.condition} onSectionItemsChange={items => updateSectionItems('condition', items)}
            includeAddButton={stepNumber == 1} addButtonRowSpan={numberOfSteps + 1} onAddSignal={() => onAddSignal('condition')}
        />

        <StepSection
            sectionItems={stepData.control} onSectionItemsChange={items => updateSectionItems('control', items)}
            includeAddButton={stepNumber == 1} addButtonRowSpan={numberOfSteps + 1} onAddSignal={() => onAddSignal('control')}
        />

        <AddressSection numberOfSteps={numberOfSteps} stepNumber={stepNumber} addressValue={stepData.address} onAddressValueChange={updateAddressSection} />
        <td style={{color: "red", width: "1.5em"}} onClick={onDeleteStep}>X</td>
    </tr>
}

export default Step;