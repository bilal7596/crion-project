import Styles from "../../../ModuleStyles/Assets/assets.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";

import FileUploader from "../../CommonComponents/FileUploader/FileUploader";
export const CreateAsset3DDetails = ({ getData, data }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ ...data });

  const handleChange = (event) => {
    const { name, value, placeholder } = event.target;
    if (name === "asset3DmodelPosition") {
      setFormData((prevData) => {
        let temp = {
          ...prevData,
          [name]: {
            ...formData?.asset3DmodelPosition,
            [placeholder]: value,
          },
        };
        getData(temp);
        return temp;
      });
    } else if (name === "asset3DmodelRotation") {
      setFormData((prevData) => {
        let temp = {
          ...prevData,
          [name]: {
            ...formData?.asset3DmodelRotation,
            [placeholder]: value,
          },
        };
        getData(temp);
        return temp;
      });
    }
  };

  const handleGetUploadedfile = (val) => {
    if (val.name === "asset3dmodal") {
      if (val?.files?.length > 0) {
        setFormData((prev) => {
          let temp = {
            ...prev,
            asset3DModel: val.files[0]
          }
          getData(temp);
          return temp
        })
      } else {
        delete formData.asset3DModel
        setFormData({ ...formData })
        getData({ ...formData })
      }
    }
    if (val.name === "assetlayoutimage") {
      if (val?.files?.length > 0) {
        setFormData((prev) => {
          let temp = {
            ...prev,
            assetLayoutImage: val.files[0]
          }
          getData(temp);
          return temp
        })
      } else {
        delete formData.assetLayoutImage
        setFormData({ ...formData })
        getData({ ...formData })
      }
    }
  }
  console.log(formData, "ddd");
  return (
    <>
      <div className={Styles.asset3DDetailsContainer}>
        <div className={Styles.asset3DDetailsLeftContainer}>
          <div className={Styles.locDetailsContainer}>
            <>
              <div>
                <label>Position</label>
                <div className={Styles.geoLocation}>
                  <div>
                    <label>X</label>
                    <input
                      type="number"
                      onChange={handleChange}
                      name="asset3DmodelPosition"
                      placeholder="x"
                      value={formData?.asset3DmodelPosition?.x}
                    />
                  </div>
                  <div>
                    <label>Y</label>
                    <input
                      type="number"
                      onChange={handleChange}
                      name="asset3DmodelPosition"
                      placeholder="y"
                      value={formData?.asset3DmodelPosition?.y}
                    />
                  </div>
                  <div>
                    <label>Z</label>
                    <input
                      type="number"
                      onChange={handleChange}
                      name="asset3DmodelPosition"
                      placeholder="z"
                      value={formData?.asset3DmodelPosition?.z}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label>Rotation (Degree)</label>
                <div className={Styles.geoLocation}>
                  <div>
                    <label>X</label>
                    <input
                      type="number"
                      onChange={handleChange}
                      name="asset3DmodelRotation"
                      placeholder="x"
                      value={formData?.asset3DmodelRotation?.x}
                    />
                  </div>
                  <div>
                    <label>Y</label>
                    <input
                      type="number"
                      onChange={handleChange}
                      name="asset3DmodelRotation"
                      placeholder="y"
                      value={formData?.asset3DmodelRotation?.y}
                    />
                  </div>
                  <div>
                    <label>Z</label>
                    <input
                      type="number"
                      onChange={handleChange}
                      name="asset3DmodelRotation"
                      placeholder="z"
                      value={formData?.asset3DmodelRotation?.z}
                    />
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>
        <div className={Styles.asset3DDetailsRightContainer}>
          <div>
            <FileUploader label={"3D Modal"} title={"asset3DModal"} typeOfRecord={"Image"} isMandatory={false} limit={1} acceptableFileTypes={[".fbx"]} fileSizeInMB={10} localPreviousPageFiles={formData?.asset3DModel ? [formData?.asset3DModel] : []} handleGetSelectedData={(value) => handleGetUploadedfile(value)} />
          </div>
          <div>
            <FileUploader label={"Layout Image"} title={"assetLayoutImage"} typeOfRecord={"Image"} isMandatory={false} limit={1} acceptableFileTypes={[".png", ".jpg", ".jpeg"]} fileSizeInMB={10} localPreviousPageFiles={formData?.assetLayoutImage ? [formData?.assetLayoutImage] : []} handleGetSelectedData={(value) => handleGetUploadedfile(value)} />
          </div>
        </div>
      </div>
    </>
  );
};