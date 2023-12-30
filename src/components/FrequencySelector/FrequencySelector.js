import React, { useEffect } from 'react';
import { useState } from 'react';
import Styles from "./FrequencySelector.module.css";
import UPSELECTOR from "../../assets/UIUX/icons/chevron-up-angle.svg";
import ClonosSelect from '../CommonComponents/ClonosSelect/ClonosSelect';
import DOWNSELECTOR from "../../assets/UIUX/icons/chevron-down-angle.svg";
import { handleRepeatationNumber, showRepeatationFrequency } from '../../utils/ChecklistAndReportsMethods/ChecklistMethod';
import { ClonosToggleButton } from '../CommonComponents/ClonosToggleButton/ClonosToggleButton';



const FrequencySelector = React.memo(({ type, uniqueKey, selectTagProps, inputTagProps, handleGetValues, defaultValue }) => {
    console.log('defaultValue:', defaultValue)
    // Local States 
    const [lcValues, setLcValues] = useState({
        "isCustomFrequency": false,
    })
    const [isRecurring, setIsRecurring] = useState(false);
    const { isCustomFrequency } = lcValues;

    console.log('isCustomFrequency:', isCustomFrequency)


    // Local Handler
    const lcHandleGetValues = (props) => {
        setLcValues(prev => {
            let updatedValues = null;
            if (props.uniqueKey == selectTagProps?.uniqueKey) updatedValues = { ...prev, [props?.uniqueKey]: { "name": props?.updatedValue?.label, "id": props?.updatedValue?.value } }
            handleGetValues({ type, uniqueKey, "updatedValue": updatedValues })
            return updatedValues
        })
    }

    useEffect(() => {
        handleGetValues({ type, uniqueKey, "updatedValue": lcValues })
    }, [isRecurring, lcValues?.frequencyPeriod])

    useEffect(() => {
        defaultValue && defaultValue?.isRecurring && setIsRecurring(prev => {
            const lcIsRecurring = defaultValue?.isRecurring
            handleGetValues({ type, uniqueKey, "updatedValue": { "isRecurring": lcIsRecurring } })
            return lcIsRecurring
        })
        defaultValue && defaultValue?.isCustomFrequency && setLcValues({ ...lcValues, ["isCustomFrequency"]: defaultValue?.isCustomFrequency })
    }, [defaultValue?.isRecurring, defaultValue?.isCustomFrequency])

    console.log('lcValues:', lcValues)
    return (
        <div className={Styles.main_container}>
            <ClonosToggleButton
                isOn={isRecurring}
                turnOffMethod={setIsRecurring}
                setFormData={setLcValues}
            />
            {
                isRecurring && <div>
                    <div className={Styles.s_m_frequency_wrapper}>
                        <div
                            area-aria-label="field container to get Frequency"
                            className={Styles.fieldItemBox}
                        >
                            <ClonosSelect
                                options={selectTagProps?.options}
                                isLabel={selectTagProps?.isLabel}
                                type={"select"}
                                label={selectTagProps?.label}
                                position={selectTagProps?.position}
                                uniqueKey={selectTagProps?.uniqueKey}
                                defaultValue={selectTagProps?.defaultValue}
                                placeholder="Select"
                                isMandatory={selectTagProps?.isMandatory}
                                handleGetValues={lcHandleGetValues}
                            />
                        </div>
                        {isCustomFrequency && (
                            <div
                                area-aria-label="field container to get Repeatation"
                                className={Styles.repeatation_wrapper}
                            >
                                <div
                                    area-aria-label="label for Field"
                                    className={Styles.s_m_frequency_label}
                                >
                                    Every
                                </div>
                                <div
                                    area-aria-label="to get value for repeatation number"
                                    className={Styles.s_m_fieldValueTaker}
                                >
                                    <div className={Styles.durrationContainer}>
                                        <div className={Styles.custom_input_container}>
                                            <input
                                                onChange={(e) => {
                                                    handleRepeatationNumber({
                                                        count: e.target.value,
                                                        formData: lcValues,
                                                        setFormData: setLcValues,
                                                    })
                                                    handleGetValues({ type, uniqueKey, "updatedValue": lcValues })
                                                }}
                                                value={lcValues?.frequencyPeriod}
                                                type={inputTagProps?.type}
                                                placeholder={inputTagProps?.placeholder}
                                                defaultValue={inputTagProps?.defaultValue}
                                                maxLength={inputTagProps?.maxLength}
                                                readOnly={defaultValue ? false : lcValues[selectTagProps?.uniqueKey] ? false : true}
                                                disabled={defaultValue ? false : lcValues[selectTagProps?.uniqueKey] ? false : true}
                                            />
                                            <div className={Styles.count_selector}>
                                                <span
                                                    onClick={() =>
                                                        handleRepeatationNumber({
                                                            count: -1,
                                                            formData: lcValues,
                                                            setFormData: setLcValues,
                                                        })
                                                    }
                                                >
                                                    <img height={20} src={UPSELECTOR} />
                                                </span>
                                                <span
                                                    onClick={() =>
                                                        handleRepeatationNumber({
                                                            count: 1,
                                                            formData: lcValues,
                                                            setFormData: setLcValues,
                                                        })
                                                    }
                                                >
                                                    <img height={20} src={DOWNSELECTOR} />
                                                </span>
                                            </div>
                                        </div>
                                        <p className={Styles.s_m_durrationText}>
                                            {showRepeatationFrequency(lcValues)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={Styles.s_m_custome_frequency_taker}>
                        <input
                            onChange={() => {
                                setLcValues(prev => {
                                    const updatedValues = { ...prev, ["isCustomFrequency"]: !isCustomFrequency }
                                    handleGetValues({ type, uniqueKey, "updatedValue": updatedValues })
                                    return updatedValues
                                })
                            }}
                            type="checkbox"
                            checked={lcValues?.isCustomFrequency}
                        />
                        <label className={Styles.s_m_frequency_label}>Custom</label>
                    </div>
                </div>
            }
        </div>
    )

})

export default FrequencySelector