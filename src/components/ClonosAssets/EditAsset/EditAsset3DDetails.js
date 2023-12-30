import Styles from "../../../ModuleStyles/Assets/assets.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";

import FileUploader from "../../CommonComponents/FileUploader/FileUploader";
export const EditAsset3DDetails = ({ getData, data,getChangedValues,changedData }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ ...data });

  const handleChange = (event) => {
    const { name, value, placeholder } = event.target;
    let temp = null;
    let changeIn = null;
    setFormData((prevData) => {
      if(name === "asset3DmodelPosition") {
        temp = {
          ...prevData,
          [name]: {
            ...formData?.asset3DmodelPosition,
            [placeholder]: value,
          },
        };
        changeIn = {
          ...changedData,
          [name]: {
            ...formData?.asset3DmodelPosition,
            [placeholder]: value,
          },
        };
      } else if (name === "asset3DmodelRotation") {
           temp = {
            ...prevData,
            [name]: {
              ...prevData?.asset3DmodelRotation,
              [placeholder]: value,
            },
          };
          console.log(temp,"tempo from japan")
          changeIn = {
            ...changedData,
            [name]: {
              ...prevData?.asset3DmodelRotation,
              [placeholder]: value,
            },
          };
        }
        getData(temp);
        getChangedValues(changeIn)
    })
  };
  const handleGetUploadedfile = (val,name) => {
    if(name === "asset3dmodel"){
      if(val?.name === "needToDeleteDocuments"){
        let prevFiles = formData?.assetImages;
        delete formData.asset3DModel
        const filesTobeDeleted = val?.selectedOption || [];
        let temp = {
          ...formData,
          asset3DModelToDelete: filesTobeDeleted,
        };
        let changeIn = {
          ...changedData,
          asset3DModelToDelete: filesTobeDeleted,
        };
        getData(temp);
        getChangedValues(changeIn);
      } else {
        let files = val?.files;
        let temp = {
          ...formData,
          asset3DModel: [...files]
        }
        let changeIn = {
          ...changedData,
          asset3DModel: [...files],
        };
        getData(temp)
        getChangedValues(changeIn);
      }
    } 
    if(name === "assetlayoutimage"){
      if(val?.name === "needToDeleteDocuments"){
        let prevFiles = formData?.assetImages;
        delete formData.assetLayoutImage
        const filesTobeDeleted = val?.selectedOption || [];
        let temp = {
          ...formData,
          assetLayoutImageToDelete: filesTobeDeleted,
        };
        let changeIn = {
          ...changedData,
          assetLayoutImageToDelete: filesTobeDeleted,
        };
        getData(temp);
        getChangedValues(changeIn);
      } else {
        let files = val?.files;
        let temp = {
          ...formData,
          assetLayoutImage: [...files]
        }
        let changeIn = {
          ...changedData,
          assetLayoutImage: [...files],
        };
        getData(temp)
        getChangedValues(changeIn);
      }
    }
  }

  // const handleGetUploadedfile = (val) => {
  //   if (val.name === "asset3dmodal") {
  //     if (val?.files?.length > 0) {
  //       setFormData((prev) => {
  //         let temp = {
  //           ...prev,
  //           asset3DModel: val.files[0]
  //         }
  //         getData(temp);
  //         return temp
  //       })
  //     } else {
  //       delete formData.asset3DModel
  //       setFormData({ ...formData })
  //       getData({ ...formData })
  //     }
  //   }
  //   if (val.name === "assetlayoutimage") {
  //     if (val?.files?.length > 0) {
  //       setFormData((prev) => {
  //         let temp = {
  //           ...prev,
  //           assetLayoutImage: val.files[0]
  //         }
  //         getData(temp);
  //         return temp
  //       })
  //     } else {
  //       delete formData.assetLayoutImage
  //       setFormData({ ...formData })
  //       getData({ ...formData })
  //     }
  //   }
  // }
  console.log(formData,changedData, "ddd");
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
               <FileUploader defaultValue={ formData?.asset3DModel && [formData?.asset3DModel]} localPreviousPageFiles={changedData?.asset3DModel &&  [changedData?.asset3DModel]} label={"3D Modal"} title={"asset3DModal"} typeOfRecord={"Image"} isMandatory={false} limit={1} acceptableFileTypes={[".fbx"]} fileSizeInMB={10} handleGetSelectedData={(value) => handleGetUploadedfile(value,"asset3dmodel")}/>
             </div>
             <div>
              <FileUploader defaultValue={formData?.assetLayoutImage && [formData?.assetLayoutImage]} localPreviousPageFiles={changedData?.assetLayoutImage && [changedData?.assetLayoutImage]} label={"Layout Image"} title={"assetLayoutImage"} typeOfRecord={"Image"} isMandatory={false} limit={1} acceptableFileTypes={[".png",".jpg",".jpeg"]} fileSizeInMB={10} handleGetSelectedData={(value) => handleGetUploadedfile(value,"assetlayoutimage")}/>
             </div>
        </div>
      </div>
    </>
  );
};







// import Styles from "../../../ModuleStyles/Assets/assets.module.css";
// import {useState } from "react";
// import { useDispatch } from "react-redux";

// import FileUploader from "../../CommonComponents/FileUploader/FileUploader";
// export const EditAsset3DDetails = ({ getData, data ,getChangedValues,changedData}) => {
//   const dispatch = useDispatch();
//   const [formData, setFormData] = useState({ ...data });

//   const handleChange = (event) => {
//     const { name, value, placeholder } = event.target;
//     setFormData((prevData) => {
//       let temp = {
//         ...prevData,
//         [name]: {
//           ...formData[name],
//           [placeholder]: value,
//         },
//       };
//       let changeIN = {
//           ...changedData,
//           [name]: {
//             ...formData[name],
//             [placeholder]: value,
//           },
//         };
//       getData(temp);
//       getChangedValues(changeIN)
//       return temp;
//     });
//   };

  // const handleGetUploadedfile = (val,name) => {
  //   console.log(val,"val")
  //   if(name === "asset3dmodel"){
  //     if(val?.name === "needToDeleteDocuments"){
  //       delete formData?.asset3DModel
  //       delete changedData?.asset3DModel
  //       getData({...formData})
  //       getChangedValues({...changedData})
  //     } else {
  //       let files = val?.files
  //       let changeIn = {
  //         ...changedData,
  //         asset3DModel: [...files],
  //       };
  //       getChangedValues(changeIn);
  //     }
  //   } 
  //   if(name === "assetlayoutimage"){
  //     if(val?.name === "needToDeleteDocuments"){
  //       delete formData?.assetLayoutImage
  //       delete changedData?.assetLayoutImage
  //       getData({...formData})
  //       getChangedValues({...changedData});
  //     } else {
  //       let files = val?.files
  //       let changeIn = {
  //         ...changedData,
  //         assetLayoutImage: [...files],
  //       };
  //       getChangedValues(changeIn);
  //     }
  //   }
  // }
//   console.log(formData?.asset3DModel, "3d details");
//   return (
//     <>
//       <div className={Styles.asset3DDetailsContainer}>
//         <div className={Styles.asset3DDetailsLeftContainer}>
//           <div className={Styles.locDetailsContainer}>
//               <>
//                 <div>
//                   <label>Position</label>
//                   <div className={Styles.geoLocation}>
//                     <div>
//                     <label>X</label>
//                     <input
//                       type="number"
//                       onChange={handleChange}
//                       name="asset3DmodelPosition"
//                       placeholder="x"
//                       value={formData?.asset3DmodelPosition?.x}
//                     />
//                     </div>
//                     <div>
//                     <label>Y</label>
//                     <input
//                       type="number"
//                       onChange={handleChange}
//                       name="asset3DmodelPosition"
//                       placeholder="y"
//                       value={formData?.asset3DmodelPosition?.y}
//                     />
//                     </div>
//                     <div>
//                     <label>Z</label>
//                     <input
//                       type="number"
//                       onChange={handleChange}
//                       name="asset3DmodelPosition"
//                       placeholder="z"
//                       value={formData?.asset3DmodelPosition?.z}
//                     />
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <label>Rotation (Degree)</label>
//                   <div className={Styles.geoLocation}>
//                     <div>
//                       <label>X</label>
//                       <input
//                       type="number"
//                       onChange={handleChange}
//                       name="asset3DmodelRotation"
//                       placeholder="x"
//                       value={formData?.asset3DmodelRotation?.x}
//                     />
//                     </div>
//                     <div>
//                     <label>Y</label>
//                     <input
//                       type="number"
//                       onChange={handleChange}
//                       name="asset3DmodelRotation"
//                       placeholder="y"
//                       value={formData?.asset3DmodelRotation?.y}
//                     />
//                     </div>
//                     <div>
//                     <label>Z</label>
//                     <input
//                       type="number"
//                       onChange={handleChange}
//                       name="asset3DmodelRotation"
//                       placeholder="z"
//                       value={formData?.asset3DmodelRotation?.z}
//                     />
//                     </div>
//                   </div>
//                 </div>
//               </>
//           </div>
//         </div>
//         <div className={Styles.asset3DDetailsRightContainer}>
//             <div>
//               <FileUploader defaultValue={ formData?.asset3DModel && [formData?.asset3DModel]} localPreviousPageFiles={changedData?.asset3DModel &&  [changedData?.asset3DModel]} label={"3D Modal"} title={"asset3DModal"} typeOfRecord={"Image"} isMandatory={false} limit={1} acceptableFileTypes={[".fbx"]} fileSizeInMB={10} handleGetSelectedData={(value) => handleGetUploadedfile(value,"asset3dmodel")}/>
//             </div>
//             <div>
//               <FileUploader defaultValue={formData?.assetLayoutImage && [formData?.assetLayoutImage]} localPreviousPageFiles={changedData?.assetLayoutImage && [changedData?.assetLayoutImage]} label={"Layout Image"} title={"assetLayoutImage"} typeOfRecord={"Image"} isMandatory={false} limit={1} acceptableFileTypes={[".png",".jpg",".jpeg"]} fileSizeInMB={10} handleGetSelectedData={(value) => handleGetUploadedfile(value,"assetlayoutimage")}/>
//             </div>
//         </div>
//       </div>
//     </>
//   );
// };
