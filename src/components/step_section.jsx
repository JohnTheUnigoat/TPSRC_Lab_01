import Cell from './cell'

const StepSection = ({
    sectionItems,
    onSectionItemsChange,
    includeAddButton,
    addButtonRowSpan,
    onAddSignal,
}) => {
    function updateItemValue(index, value){
        let updatedList = [...sectionItems];

        updatedList[index] = value;

        onSectionItemsChange(updatedList);
    }

    return <>
        {sectionItems.map((item, index) => 
            <Cell key={index} value={item} onChange={(value) => updateItemValue(index, value)} />
        )}
        {includeAddButton && <td rowSpan={addButtonRowSpan} style={{width: "1.5em", color: "#777"}} onClick={onAddSignal}>+</td>}
    </>;
}

export default StepSection