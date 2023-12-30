import TEMPLTE_CREATION_TEXTICON from "../../assets/UIUX/icons/Checklist/Attributes/alphabet-latin.svg"
import TEMPLTE_CREATION_NUMBERICON from "../../assets/UIUX/icons/Checklist/Attributes/123.svg"
import TEMPLTE_CREATION_DOTCIRCLE from "../../assets/UIUX/icons/Checklist/Attributes/circle-dot (1).svg"
import TEMPLTE_CREATION_SQUARECHECK from "../../assets/UIUX/icons/Checklist/Attributes/square-check.svg";
import TEMPLTE_CREATION_CIRCLEDOWN from "../../assets/UIUX/icons/Checklist/Attributes/circle-chevron-down.svg";
import TEMPLTE_CREATION_CALENDARICON from "../../assets/UIUX/icons/Checklist/Attributes/calendar-event.svg";
import Styles from "../../ModuleStyles/ChecklistAndReports/ClonosChecklist/TemplateCreationPage.module.css"
export const TemplateAttributes = ({getSelectedValue}) => {
    const attributes = [
        {id:1,icon:TEMPLTE_CREATION_TEXTICON,title:"Text"},
        {id:2,icon:TEMPLTE_CREATION_DOTCIRCLE,title:"Multiple Choice"},
        {id:3,icon:TEMPLTE_CREATION_SQUARECHECK,title:"Checkboxes"},
        {id:4,icon:TEMPLTE_CREATION_CIRCLEDOWN,title:"Dropdown"},
        {id:5,icon:TEMPLTE_CREATION_NUMBERICON,title:"Number"},
        {id:6,icon:TEMPLTE_CREATION_CALENDARICON,title:"Date"},
    ]
    return <div className={Styles.checklist_template_attribute_container}>
        {
            attributes?.map((attr) => {
                return <div key={attr?.id} className={Styles.attributeItem} onClick={() => getSelectedValue(attr?.title)}>
                    <img src={attr?.icon}/>
                    <p>{attr?.title}</p>
                </div>
            })
        }
    </div>
}