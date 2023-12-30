import React from "react";
import Styles from "../../ModuleStyles/Attributes/Table.module.css";

const Table = ({ positions, element }) => {
  console.log("{positions,element}:", { positions, element });
  return (
    <div
      className={Styles.table_attribute_container}
      style={{
        top: `${positions.y}px`,
        left: `${positions.x}px`,
      }}
    >
      <div className={Styles.table_attribute_content}>
        <span>{element.fieldName}</span>
        <span className={Styles.table_attribute_value}></span>
        <table className={Styles.table_attribute_table_tag}>
          <thead>
            <tr>
              {element?.fieldValue?.headers?.map((ele) => {
                return <th key={ele.headerId}>{ele.name}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {element?.fieldValue?.tableData?.map((ele) => {
              return (
                <tr key={ele.rowId}>
                  {element?.fieldValue?.headers?.map((headersEle) => {
                    return (
                      <td key={headersEle.headerId}>
                        {ele[headersEle.headerId] == ""
                          ? "null"
                          : ele[headersEle.headerId]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
