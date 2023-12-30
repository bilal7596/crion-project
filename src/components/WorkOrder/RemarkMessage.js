import React, { useEffect, useState } from 'react'
import Styles from "../../ModuleStyles/WorkOrder/WorkOrderView.module.css"
import { getDayMonthYear, getFormattedTime, handleLoggedInUser } from '../../utils/clonosCommon'


const RemarkMessage = ({ item, uniqueKey, prevDate }) => {
    const [lcValues, setLcValues] = useState({});


    useEffect(() => {
        const dateObject = getDayMonthYear(item.createdDate)
        setLcValues({ ...lcValues, ["dateObject"]: dateObject })

        const timeObject = getFormattedTime({ timestampString: item?.createdDate, timeZone: "Asia/Kolkata" });
        setLcValues((prev) => {
            return { ...prev, ["timeObject"]: timeObject }
        })

        setLcValues((prev) => {
            return { ...prev, ["who'sRemark"]: handleLoggedInUser().userId == item.createdBy?.id ? "mine" : "others" }
        })

        setLcValues((prev) => {
            let currentDate = new Date()
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            let day = currentDate.getDate();
            console.log('day:', typeof day)

            if (String(day).length == 1) {
                day = `0${day}`
            }

            const updatedData = { ...prev, ["currentDate"]: `${year}-${month}-${day}` }
            return updatedData
        })


    }, [item?.createdBy?.id])
    return (
        <div className={Styles.wov_remark_message_container} key={uniqueKey} aria-label='Remark Message'>
            {
                prevDate != item.createdDate?.split("T")[0] && item.createdDate?.split("T")[0] != lcValues.currentDate && <div className={Styles.wov_remark_date}>
                    <span>{lcValues?.dateObject?.day}</span>
                    <span>{lcValues?.dateObject?.monthString}</span>
                    <span>{lcValues?.dateObject?.year}</span>
                </div>
            }
            {
                prevDate != item.createdDate?.split("T")[0] && item.createdDate?.split("T")[0] == lcValues.currentDate && <span className={Styles.wov_remark_date}>Today</span>
            }
            <div className={lcValues?.["who'sRemark"] == "mine" ? Styles.wov_remark_message_mine : Styles.wov_remark_message_others}
                id={Styles.wov_remark_message_common}
            >
                <div className={Styles.wov_remark_message_profile}>
                    {
                        item?.imageURL ?
                            <img src={item?.imageURL} aria-label='profile image' loading='lazy' alt='profile image' />
                            : <span></span>
                    }
                </div>
                <div className={Styles.wov_remark_message_content}>
                    <div
                        aria-label='User name and time'
                        className={lcValues?.["who'sRemark"] == "mine" ? Styles.wov_remark_message_userName_and_time_mine : Styles.wov_remark_message_userName_and_time_others}
                        id={Styles.wov_remark_message_userName_and_time_common}
                    >
                        <h4 className={Styles.wov_remark_message_name_heading} aria-label='User name'>{item?.createdBy?.name}</h4>
                        <div aria-label='time'>
                            <span className={Styles.wov_remark_message_name_time}>{lcValues?.timeObject?.hours}</span>
                            <span className={Styles.wov_remark_message_name_time}>:</span>
                            <span className={Styles.wov_remark_message_name_time}>{lcValues?.timeObject?.minutes}</span>
                            <bdi className={Styles.wov_remark_message_name_time}> </bdi>
                            <span className={Styles.wov_remark_message_name_time}>{lcValues?.timeObject?.zone}</span>
                        </div>
                    </div>
                    <div
                        className={lcValues?.["who'sRemark"] == "mine" ? Styles.wov_remark_message_paragraph_mine : Styles.wov_remark_message_paragraph_others}
                        id={Styles.wov_remark_message_paragraph_common}
                    >
                        <p>{item?.remarks}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RemarkMessage