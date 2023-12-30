
import { useNavigate } from "react-router-dom";
import Styles from "../../ModuleStyles/LandingPage/landingPage.module.css";
import { getUser } from "../../utils/clonosCommon";
export const LandingPageCard = ({
  image,
  title,
  description,
  buttonTitle,
  permissions,
  viewPermission,
  createPermission,
  createPath,
  viewPath,
  roles
}) => {
  const NAVIGATE = useNavigate();
  const user = getUser();
  console.log(roles,buttonTitle)
  return (
    <>
      <div
        className={Styles.cardContainer}
        style={{
          display: roles.includes(user?.role_id ) ? "block": (permissions[`${viewPermission}`] ||
                permissions[`${createPermission}`])
                  ? "block"
                  : "none",
        }}
      >
        <div onClick={() => NAVIGATE(`/${viewPath}`)}
            style={{
              display: roles.includes(user?.role_id ) ? "flex": (permissions[`${viewPermission}`] ||
              permissions[`${createPermission}`])
                ? "flex"
                : "none",
            }} className={Styles.imageContainer}>
          <img src={image} />
        </div>
        <div className={Styles.content}>
          <div className={Styles.titleContainer}>
            <h4>{title}</h4>
          </div>
          <div>
            <p>{description}</p>
          </div>
          <div className={Styles.btn}>
            <button
            onClick={() => NAVIGATE(`/${createPath}`)}
              style={{
                display: roles.includes(user?.role_id ) ? "block": permissions[`${viewPermission}`] ||
                permissions[`${createPermission}`]
                  ? "block"
                  : "none",
              }}
            >
              {buttonTitle}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
