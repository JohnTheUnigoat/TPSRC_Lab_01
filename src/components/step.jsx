import AddressSection from './address_section';
import styles from './step.module.css'
import StepSection from './step_section';

const Step = ({
    numberOfSteps,
    stepNumber,
    stepData, onStepDataChange
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

    // return <div className={styles.step}>
    //     <div className={styles.stepNumber} onClick={onAddressTargetClick}>{stepNumber}</div>

    //     <StepSection
    //         sectionItems={stepData.state} onSectionItemsChange={items => updateSectionItems('state', items)}
    //     />

    //     <StepSection
    //         sectionItems={stepData.condition} onSectionItemsChange={items => updateSectionItems('condition', items)}
    //     />

    //     <StepSection
    //         sectionItems={stepData.control} onSectionItemsChange={items => updateSectionItems('control', items)}
    //     />

    //     <AddressSection numberOfSteps={numberOfSteps} stepNumber={stepNumber} addressValue={stepData.address} onAddressValueChange={updateAddressSection} />
    // </div>

    return <tr>
        <td>{stepNumber}</td>
        <StepSection
            sectionItems={stepData.state} onSectionItemsChange={items => updateSectionItems('state', items)}
        />

        <StepSection
            sectionItems={stepData.condition} onSectionItemsChange={items => updateSectionItems('condition', items)}
        />

        <StepSection
            sectionItems={stepData.control} onSectionItemsChange={items => updateSectionItems('control', items)}
        />

        <AddressSection numberOfSteps={numberOfSteps} stepNumber={stepNumber} addressValue={stepData.address} onAddressValueChange={updateAddressSection} />
    </tr>
}

export default Step;