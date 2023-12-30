import Styles from "./CustomSelect.module.css";
import DOWNANGLE from "../../../assets/UIUX/icons/chevron-down.svg";
import { useEffect } from "react";
import { CloseOutlined } from "@material-ui/icons";
export const CustomSelect = ({
  isOpen,
  closeMethod,
  title,
  data,
  icon,
  elementRef,
  formData,
  type,
  placement,
  getSelectedValue
}) => {
  const handleCloseDropdown = (event) => {
    if (elementRef?.current && !elementRef?.current.contains(event.target)) {
      closeMethod(false);
    }
    if (elementRef?.current && !elementRef?.current.contains(event.target)) {
      closeMethod(false);
    }
  };

  const handleChange = (field) => {
    console.log(field,"compare field")
    getSelectedValue(field)
    closeMethod(false);
    
  };
  useEffect(() => {
    if (elementRef) {
      document.addEventListener("mousedown", handleCloseDropdown);
    } else {
      document.removeEventListener("mousedown", handleCloseDropdown);
    }
    return () => {
      document.removeEventListener("mousedown", handleCloseDropdown);
    };

  }, [elementRef]);
  return (
    <div ref={elementRef} className={Styles.selectContainer}>
      <div
        className={Styles.selectController}
        onClick={() => closeMethod(!isOpen)}
      >
        <h4 style={{color:(type && formData[type]?.name) ? "black" :"#8CA1C4"}}>{(type && formData[type]?.name )? formData[type]?.name : title}</h4>
        <div>
          {(type && formData[type]?.name) ? (
            <div
              style={{ cursor: "pointer",display:"flex",alignItems:"center" }}
              onClick={(e) => {
                e.stopPropagation();
                getSelectedValue("deselected")
              }}
            >
              <CloseOutlined />
            </div>
          ) : (
            <img src={icon || DOWNANGLE} />
          )}
        </div>
      </div>
      {isOpen ? (
        <div  style={{bottom:placement === "top" ? "60px" :"",top:placement === "top" ? "":"60px"}} className={Styles.optionsController}>
          {
            data?.length > 0 ? data?.map((field,index) => {
              return (
                <div key={index + 1} onClick={() => handleChange(field)}>{field?.label}</div>
              );
            }) : "No Result found!"
          }
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
