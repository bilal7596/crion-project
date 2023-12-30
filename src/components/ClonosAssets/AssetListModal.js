import Modal from "../CommonComponents/Modal/Modal";
import Styles from "../../ModuleStyles/Assets/assets.module.css";
import { useEffect, useRef } from "react";
import { getAssetDropdown, getFilteredAssetLevelDropdown } from "../../Api/Asset/assetApi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { handleLoginExpiry } from "../../utils/clonosCommon";
import { BsSearch } from "react-icons/bs";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { debounce } from "lodash";
import { CloseOutlined } from "@material-ui/icons";
export const AssetListModal = ({ isOpen, closeModalMethod,setFormData }) => {
  const [assetsDropdown, setAssetsDropdown] = useState([]);
  const dispatch = useDispatch();
  const [selectedAsset, setSelectedAsset] = useState({});
  const debouncedSearchRef = useRef(debounce(() => {}, 500));
  const [assetInputValue,setAssetInputValue] = useState("")
  const handleSelectAsset = (asset) => {
    if(selectedAsset?.assetId === asset){
        setSelectedAsset(null);
        setFormData((prev) => ({...prev,asset : null}))
    } else {
        setSelectedAsset({assetName : asset?.assetName,assetId : asset?.assetId});
        setFormData((prev) => ({...prev,asset : {assetName : asset?.assetName,assetId : asset?.assetId}}))
    }
  }

  useEffect(() => {
    getFilteredAssetLevelDropdown()
      .then((res) => {
        setAssetsDropdown(res?.data?.result);
      })
      .catch((err) => {
        handleLoginExpiry(err, dispatch);
      });
  }, []);

  useEffect(() => {
    clearTimeout(debouncedSearchRef.current);
    debouncedSearchRef.current = setTimeout(() => {
      getFilteredAssetLevelDropdown({assetName:assetInputValue}).then((res) => {
        setAssetsDropdown(res?.data?.result);
      }).catch((err) => {
        handleLoginExpiry(err, dispatch);
      });
    }, 500);
    return () => clearTimeout(debouncedSearchRef.current);
  },[assetInputValue])
  return (
    <Modal isOpen={isOpen} closeModalMethod={closeModalMethod}>
      <div className={Styles.astModalContainer}>
        <div className={Styles.astmodalheader}>
          <h4>Select from Asset Library</h4>
          <div onClick={() => closeModalMethod()}>
            <CloseOutlined/>
          </div>
        </div>
        <div className={Styles.astModalSearchbar}>
          <div>
            <div>
              <BsSearch />
            </div>
            <input ref={debouncedSearchRef}  onChange={(e) => setAssetInputValue(e.target.value)} placeholder="Search Asset" />
          </div>
        </div>
        <div className={Styles.astListContainer}>
          {assetsDropdown?.map((asset) => {
            return (
              <div
                onClick={() => handleSelectAsset(asset)}
                className={Styles.assetItem}
              >
                <div className={Styles.astModalTitle}>
                  <h4>{asset?.assetName}</h4>
                  <p>Level - {asset?.assetLevel}</p>
                </div>
                { selectedAsset?.assetId === asset?.assetId ?
                  <div className={Styles.checkIconBox}>
                    <CheckCircleIcon fontSize="small" />
                  </div> : <></>
                }
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
