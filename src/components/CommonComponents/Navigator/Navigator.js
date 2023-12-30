import React from "react";
import { useState } from "react";
import Styles from "./Navigator.module.css";

const CommonNavigator = ({ values, getSelectedValue }) => {
  console.log('values:', values)
  const [filterNav, setFilterNav] = useState(values)
  const loggedInUser = JSON.parse(localStorage.getItem("loginUser"))
  console.log('filterNav:', filterNav)
  console.log("values:", values);

  const handleActiveFilter = (e, index, clicked) => {
    console.log("clicked:", clicked);
    getSelectedValue(clicked);
    let updatedValues = filterNav.map((ele) => {
      if (ele.value === clicked) return { ...ele, status: true };
      else return { ...ele, status: false };
    });

    console.log("updatedValues:", updatedValues);
    setFilterNav(updatedValues);
  };



  return (
    <nav className={Styles.common_filter_nav}>
      {
        filterNav?.map((ele, index) => {
          if (loggedInUser?.role_id === "076" && (ele.value !== "All" && ele.value !== "Draft")) {
            return <button className={ele.status ? Styles.common_filter_nav_item_active : Styles.common_filter_nav_item} onClick={(e) => handleActiveFilter(e, index, ele.value)}>{ele.value}</button>
          }
          else if (loggedInUser?.role_id === "001" || loggedInUser?.role_id === "002" || loggedInUser?.role_id === "086") {
            return <button className={ele.status ? Styles.common_filter_nav_item_active : Styles.common_filter_nav_item} onClick={(e) => handleActiveFilter(e, index, ele.value)}>{ele.value}</button>
          }
        })
      }
    </nav>
  );
};

export default CommonNavigator