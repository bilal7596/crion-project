import { ClonosStepper } from "./ClonosStepper";
import Styles from "../../../ModuleStyles/Assets/assets.module.css";
import { updateLayout } from "../../../utils/clonosCommon";
import { useDispatch, useSelector } from "react-redux";
import { getUser, loginJumpLoadingStopper } from "../../../utils/clonosCommon"
import useToggler from "../../../CustomHooks/TogglerHook"
import { useEffect } from "react"
import { Container } from "rsuite"
import { UnAuthorizedModal } from "../../CommonComponents/UnAuthorizedPage/UnAuthorizedModal"

export const AssetRegistatration = () => {

  const [lsLocalLoading, setIsLocalLoading] = useToggler() // Custom Hook which returns boolean value (initial value : "false")
  const logged_user = getUser();
  const dispatch = useDispatch();
  const { mainLayoutChildrenPositionsToolkitState } = useSelector(
    (store) => store.globalEntitiesStateManagement
  );

    useEffect(() => {
        updateLayout({ dispatch });
        let interval = loginJumpLoadingStopper({ setterFunction: setIsLocalLoading, timeout: 5000 })
        return () => {
            clearInterval(interval)
        }
    }, [])

    if (logged_user?.permissions?.includes("ast001")) {
        return (
            <div className={Styles.assetRegContainer} style={{
          height:
            mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart
              ?.height,
        }}>
                <div className={Styles.assetRegSubContainer}>
                    <ClonosStepper />
                </div>
            </div>
        )
  }
    return !lsLocalLoading ? <h1 style={{ textAlign: "center" }}>Loading...</h1> :
        <Container component="main" maxWidth="sm">
            <UnAuthorizedModal />
        </Container>
}
