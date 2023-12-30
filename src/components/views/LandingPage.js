import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllPermissions } from "../../Api/User/UserApi";
import { cardsData } from "./LandingPageData";
import { LandingPageCard } from "./LandingPageCard";
import Styles from "../../ModuleStyles/LandingPage/landingPage.module.css"
import { getUser } from "../../utils/clonosCommon";


const LandingPage = () => {
  const USER_DETAILS = getUser();
  const currentPermissionsSelector = useSelector(
    (state) => state.userData.loggedUserPermissions
  );
  const [allpermissions, setallpermissions] = useState([]);

  const searchValueSelector = useSelector(
    (state) => state.assetData.searchAssetValue
  );
  const searchDocsSelector = useSelector(
    (state) => state.documentData.searchDocuments
  );

  // useEffect(() => {
  //   getAllPermissions()
  //     .then((res) => {
  //       console.log("getAllPermissions RESPONSE", res);
  //       setallpermissions(res?.data?.result);
  //     })
  //     .catch((err) => console.log("getAllPermissions ERROR".err));
  // }, []);

  const [handlePermission, sethandlePermission] = useState({});

  useEffect(() => {
    allpermissions?.forEach((permission) => {
      sethandlePermission((prev) => ({
        ...prev,
        [`${permission.permissionType}`]: false,
      }));
    });
    currentPermissionsSelector?.forEach((permission) => {
      sethandlePermission((prev) => ({
        ...prev,
        [`${permission.permissionType}`]: true,
      }));
    });
  }, [allpermissions, currentPermissionsSelector]);
console.log(USER_DETAILS)
  return (
    <>
      <div className={Styles.cardsContainer}>
      {cardsData.map((card) => {
          return (
            <LandingPageCard
              image={card.image}
              title={card.title}
              description={card.description}
              buttonTitle={card.buttonTitle}
              permissions={handlePermission}
              viewPermission={card.viewPermissoin}
              createPermission={card.createPermisson}
              createPath={card.createPath}
              viewPath={card.viewPath}
              roles={card?.roles || []}
            />
          );
        })}
      </div>
    </>
  );
};

export default LandingPage;
