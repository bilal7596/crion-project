import { DateRangePicker, SelectPicker } from "rsuite";
import Styles from "../../ModuleStyles/Assets/assets.module.css";
import { useState } from "react";
import { debounce } from "lodash";
import { useEffect } from "react";
import { useRef } from "react";
import {
  getAssetDepartmentDropdown,
  getFilteredAssets,
} from "../../Api/Asset/assetApi";
import { useDispatch } from "react-redux";
import { assetActions } from "../../Store/Reducers/ClonosAssetReducer";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { handleLoginExpiry, removeUserSession } from "../../utils/clonosCommon";
// import SearchIcon from "@material-ui/icons/Search";
import { BsSearch } from "react-icons/bs";
export const AssetFilters = ({ activePage, limit,setTotalPage,getAppliedFilters }) => {
  const [filters, setFilters] = useState({});
  const [installationDate, setInstallationDate] = useState([null, null]);
  const [createdDate, setCreatedDate] = useState([null, null]);
  const [assetDepartmentDropdown, setAssetDepartmentDropdown] = useState([]);
  // Reference to the debounced search function
  const debouncedSearchRef = useRef(debounce(() => {}, 500));
  const dispatch = useDispatch();
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      let temp = {
        ...prevFilters,
        [name]: value
      }
      getAppliedFilters({...temp})
      return temp
    });
  };

  const handleDateRangeChange = (value, name) => {
    if (value) {
      const data = {
        startDate: value[0],
        endDate: value[1],
      };
      let prev_date = value[0].setHours(0, 0, 0, 0);
      let next_date = value[1].setHours(23, 59, 59, 0);
      prev_date = new Date(prev_date);
      next_date = new Date(next_date);
      data.startDate = prev_date;
      data.endDate = next_date;
      console.log(data, "daata");
      if (name === "installationDate") {
        setInstallationDate([data?.startDate, data?.endDate]);
      }
      if (name === "createdDate") {
        setCreatedDate([data?.startDate, data?.endDate]);
      }
      setFilters((prevFilters) => {
        let temp = {
          ...prevFilters,
          [name]: {
            startDate: data.startDate,
            endDate: data.endDate,
          },
        }
        getAppliedFilters({...temp})
        return temp
      });
      console.log(data, name);
    }
  };

  useEffect(() => {
    clearTimeout(debouncedSearchRef.current);
    const optionalParams = {
      assetDepartment : 1,
      criticalityLevel : 1,
      asset3DModel:1,
    }
    debouncedSearchRef.current = setTimeout(() => {
      getFilteredAssets({page:activePage, limit, payload : filters,optionalParams}).then((res) => {
        setTotalPage(res?.data?.result?.totalPages)
        dispatch(assetActions.getAllAssets(res?.data?.result?.assets));
        dispatch(commonActions.showApiLoader(false))
      }).catch((err) => {
        handleLoginExpiry(err,dispatch)
      })
    }, 500);
    return () => clearTimeout(debouncedSearchRef.current);
  }, [filters,activePage,limit]);

  // useEffect(() => {
  //   getAssetDepartmentDropdown()
  //     .then((res) => {
  //       console.log(res.data, "atsads");
  //       setAssetDepartmentDropdown(res.data.result);
  //     })
  //     .catch((err) => {
  //       if (
  //         err.response.data.status === 401 &&
  //         JSON.parse(localStorage.getItem("loginUser")) !== null
  //       ) {
  //         dispatch(commonActions.handleExpiryAlert(true));
  //         removeUserSession();
  //         localStorage.removeItem("loginUser");
  //       }
  //     });
  // }, []);
  return (
    // <div className={Styles.filterContainer}>
    //   <div className={Styles.filterItem}>
    //     {/* <label>Search By</label> */}
    //     <div className={Styles?.astSearchbar}>
    //       <div className={Styles.searchIconContainer}>
    //         <BsSearch fontSize="medium" />
    //       </div>
    //       <input
    //         name="assetNumber"
    //         onChange={handleFilterChange}
    //         placeholder="Asset Number"
    //       />
    //     </div>
    //   </div>
    //   <div className={Styles.filterItem}>
    //     <div className={Styles?.astSearchbar}>
    //       <div className={Styles.searchIconContainer}>
    //         <BsSearch fontSize="medium" />
    //       </div>
    //       <input
    //         name="assetName"
    //         onChange={handleFilterChange}
    //         placeholder="Asset Name"
    //       />
    //     </div>
    //   </div>

    //   <div className={`${Styles.filterItem} astFilterSelectPicker`}>
    //     <SelectPicker
    //       onSelect={(val) => {
    //         setFilters((prev) => {
    //           return {
    //             ...prev,
    //             assetDepartment: val,
    //           };
    //         });
    //       }}
    //       onClean={() => {
    //         setFilters((prev) => {
    //           return {
    //             ...prev,
    //             assetDepartment: "",
    //           };
    //         });
    //       }}
    //       style={{
    //         // width: "200px",
    //         border: "1px solid #dcdcdc",
    //         borderRadius: "6px",
    //         overflow: "hidden",
    //         fontSize: "16px",
    //       }}
    //       placeholder="Asset Department"
    //       searchable={false}
    //       data={assetDepartmentDropdown?.map((opt) => {
    //         return {
    //           label: opt.asset_department,
    //           value: opt.asset_departmentId,
    //         };
    //       })}
    //     />
    //   </div>
    //   <div className={Styles.filterItem}>
    //     <div className={Styles?.astSearchbar}>
    //       <div className={Styles.searchIconContainer}>
    //         <BsSearch fontSize="medium" />
    //       </div>
    //       <input
    //         onChange={handleFilterChange}
    //         name="assetModel"
    //         placeholder="Asset Model"
    //       />
    //     </div>
    //   </div>
    //   <div className={`${Styles.filterItem} ast_dateRange`}>
    //     <DateRangePicker
    //       onClean={() => {
    //         setCreatedDate([null, null]);
    //         delete filters.createdDate;
    //         setFilters((prev) => {
    //           return {
    //             ...prev,
    //           };
    //         });
    //       }}
    //       format="dd/MM/yyyy"
    //       onChange={(val) => handleDateRangeChange(val, "createdDate")}
    //       placement="leftStart"
    //       placeholder="Created Date"
    //       value={createdDate}
    //     />
    //   </div>
    //   <div className={`${Styles.filterItem} ast_dateRange`}>
    //     <DateRangePicker
    //       onClean={() => {
    //         setInstallationDate([null, null]);
    //         delete filters.installationDate;
    //         setFilters((prev) => {
    //           return {
    //             ...prev,
    //           };
    //         });
    //       }}
    //       onChange={(val) => handleDateRangeChange(val, "installationDate")}
    //       placement="leftStart"
    //       format="dd/MM/yyyy"
    //       placeholder="Installation Date"
    //       value={installationDate}
    //     />
    //   </div>
    //   {/* <div className="ast_dateRange">
    //     <DateRangePicker
    //       onClean={() => {
    //         setFilters((prev) => {
    //           return {
    //             ...prev,
    //             decommissionedDate : ""
    //           }
    //         })
    //       }}
    //       onChange={(val) => handleDateRangeChange(val, "decommissionedDate")}
    //       placement="leftStart"
    //       placeholder="Decommission Date"
    //     />
    //   </div> */}
    // </div>
    <></>
  );
};
