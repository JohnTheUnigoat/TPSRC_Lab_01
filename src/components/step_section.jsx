import styles from './step_section.module.css'
import Cell from './cell'

const StepSection = ({sectionItems, onSectionItemsChange}) => {
    function updateItemValue(index, value){
        let updatedList = [...sectionItems];

        updatedList[index] = value;

        onSectionItemsChange(updatedList);
    }

    // return <div className={styles.stepSection}>
    //     {sectionItems.map((item, index) => 
    //         <Cell key={index} value={item} onChange={(value) => updateItemValue(index, value)} />
    //     )}
    // </div>;

    return <>
        {sectionItems.map((item, index) => 
            <Cell key={index} value={item} onChange={(value) => updateItemValue(index, value)} />
        )}
    </>;
}

export default StepSection