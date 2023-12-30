import { memo } from "react";
import Styles from "../../../ModuleStyles/Assets/assetParameters.module.css";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import PARAMETER_CREATION_REMOVEROW from "../../../assets/UIUX/icons/Checklist/circle-minus.svg";
import { restrictSpecialCharacters } from "../../../utils/clonosCommon";

const CreateAssetParameters = ({ getData, data }) => {
  const [assetParameters, setAssetParameters] = useState([]);

  const handleChange = (e, parameterId) => {
    const { name, value } = e.target;
    const specialCharacters = `!"#$%&'()*+,./:;<=>?@[\\]^\`{|}~`;
    const newValue = restrictSpecialCharacters({ value, specialCharacters });
    setAssetParameters((prev) => {
      let temp = assetParameters?.map((param) => {
        if (param?.assetParameterId === parameterId) {
          return {
            ...param,
            [name]: newValue,
          };
        } else {
          return param;
        }
      });
      getData({ ...data, assetParameters: temp });
      return temp;
    });
  };
  const handleAddParameter = () => {
    let parameter = {
      assetParameterId: uuidv4(),
      name: "",
      description: "",
      unit: "",
    };
    setAssetParameters((prev) => {
      let temp = [...prev, parameter];
      let tempData = { ...data, assetParameters: temp };
      getData(tempData);
      return temp;
    });
  };

  const handleRemoveParameter = (assetParameterId) => {
    setAssetParameters((prev) => {
      let remainingParameters = assetParameters?.filter((param) => param?.assetParameterId !== assetParameterId);
      let tempData = { ...data, assetParameters: remainingParameters };
      getData(tempData);
      return remainingParameters;
    });
  };
  useEffect(() => {
    setAssetParameters(data?.assetParameters || []);
  }, []);
  console.log(assetParameters, "params");
  return (
    <div
      aria-label="container to add parameters"
      className={Styles.ast_prms_contanier}
    >
      <div className={Styles.ast_prms_header}>
        <h4 className={Styles.ast_prms_header_title}>
          Technical Specifications
        </h4>
      </div>
      <div className={Styles.ast_prms_inner_container}>
        <div className={Styles.ast_prms_add_parameters}>
          <div onClick={() => handleAddParameter()}>
            <span>+</span>
            <span>Add Parameter</span>
          </div>
        </div>
        <div className={Styles.ast_prms_list_container}>
          {assetParameters?.length > 0 ? (
            assetParameters?.map((parameter, index) => {
              return (
                <div
                  key={parameter?.assetParameterId}
                  className={Styles.ast_prms_single_param}
                >
                  <div className={Styles.ast_prms_paramname}>
                    <input
                      onChange={(e) => handleChange(e, parameter?.assetParameterId)}
                      value={parameter?.name}
                      name="name"
                      placeholder={`Parameter ${index + 1}`}
                    />
                  </div>
                  <div className={Styles.ast_prms_paramDesc}>
                    <input
                      onChange={(e) => handleChange(e, parameter?.assetParameterId)}
                      value={parameter?.description}
                      name="description"
                      placeholder="Description"
                    />
                  </div>
                  <div className={Styles.ast_prms_paramUnit}>
                    <input
                      onChange={(e) => handleChange(e, parameter?.assetParameterId)}
                      value={parameter?.unit}
                      name="unit"
                      placeholder="Units"
                    />
                  </div>
                  <div onClick={() => handleRemoveParameter(parameter?.assetParameterId)}>
                    <img src={PARAMETER_CREATION_REMOVEROW} />
                  </div>
                </div>
              );
            })
          ) : (
            <h4 style={{ color: "#3f51b5", textAlign: "center" }}>
              Add Parameters To Create
            </h4>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CreateAssetParameters);

{
  /* <div className={Styles.}></div> */
}
