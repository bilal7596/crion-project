import { useState } from "react";
import Styles from "./clonosToggleButton.module.css";
export const ClonosToggleButton = ({isOn,turnOffMethod,setFormData}) => {
  const handleOn = () => {
    turnOffMethod(true);
    setFormData((prev) => ({
      ...prev,
      isRecurring : true
    }))
  }
  const handleOff = () => {
    turnOffMethod(false);
    setFormData((prev) => ({
      ...prev,
      isRecurring : false
    }))
  }
  return (
    <div>
      {!isOn && (
        <div onClick={handleOn} className={Styles.off_button}>
          <div className={Styles.off_button_content}></div>
        </div>
      )}
      {isOn && (
        <div onClick={handleOff} className={Styles.on_button}>
          <div className={Styles.on_button_content}></div>
        </div>
      )}
    </div>
  );
};
