import Styles from './MaintenanceTasksListModal.module.css'
import searchIcon from "../../../assets/UIUX/icons/WO/search (2).svg"
import closeIcon from "../../../assets/UIUX/icons/WO/circle-x-filled.svg"
import ClonosSpinner from "../../../assets/Clonos Common Indicators/Clonos_Spinner.svg"
import { useEffect, useState } from 'react';
import { getAllScheduledMaintenanceOfAsset } from '../../../Api/ScheduleMaintenance/ScheduleMaintenance';
import Modal from '../../../components/CommonComponents/Modal/Modal';
import { getFormatedDate, handleLoginExpiry } from '../../../utils/clonosCommon';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
export const MaintenanceTasksListModal = ({open,assetId,closeModalMethod}) => {
    const [maintenanceTasks,setMaintenanceTasks] = useState([])
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const Navigate = useNavigate()
    const dispatch = useDispatch();
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleNavigate = (task) => {
        console.log(task,"task123")
        let id = task?.maintenanceId;
        Navigate("/view-maintenanceTask",{state:{maintenanceId:id}})
    }

    useEffect(() => {
        if(open){
            getAllScheduledMaintenanceOfAsset(assetId).then((res) => {
                setMaintenanceTasks(res?.data?.result?.lists)
            }).catch((err) => {
                handleLoginExpiry(err,dispatch)
            })
        }       
    },[open])
    console.log(assetId,"assetId")
    return (
        <Modal isOpen={open} closeModalMethod={() => closeModalMethod(false)}>
            <div className={Styles.dd_body}> {/* dd: dynamic dropdown */}
                <header className={Styles.ddb_header}> {/* ddb: dynamic dropdown body */}
                    <span>Select From Maintenance Plan</span>
                    <div><img onClick={() => closeModalMethod(false)} src={closeIcon} alt='Close Button' /></div>
                </header>

                <section>
                    <div>
                    <div className={Styles.ddb_search} >
                                <img src={searchIcon} alt="Search" />
                                <input
                                    placeholder={"Search"}
                                    value={inputValue}
                                    onChange={handleInputChange}
                                />
                    </div>
                    </div>
                    <div className={Styles.ddb_content}>
                        {
                            maintenanceTasks?.length > 0 && maintenanceTasks?.map((task) => {
                                return <div className={Styles.ddb_content_item} onClick={() => handleNavigate(task)}>
                                    <div>
                                        <p className={Styles.ddb_content_item_label}>{task?.maintenancePlanName }</p>
                                    </div>
                                    <div>
                                        <p className={Styles.ddb_content_item_label}>{`Scheduled On : ${getFormatedDate(task?.startDate)}`}</p>
                                        <p className={Styles.ddb_content_item_label}>{`Status : ${task?.status}`}</p>
                                    </div>
                                </div>
                            })
                        }
                        {
                            isLoading && <img src={ClonosSpinner} />
                        }
                        {
                            !maintenanceTasks?.length && <section><span>No results Found!</span></section>
                        }
                    </div>
                </section>
                <footer className={Styles.ddb_footer}>
                    <div className={Styles.ddbf_controller}> {/* ddbf: dynamic dropdown body footer */}
                        <span onClick={() => closeModalMethod(false)}>Cancel</span>
                        <span onClick={() => closeModalMethod(false)}>Ok</span>
                    </div>
                </footer>
            </div >
        </Modal >
    )
}