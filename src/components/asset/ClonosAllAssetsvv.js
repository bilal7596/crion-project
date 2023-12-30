import * as React from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState, useRef } from "react";
import Dropdown from "rsuite/Dropdown";
import DatePicker from "react-multi-date-picker";
import Button from "@material-ui/core/Button";
import { getAllAssets, getAssetTypes } from "../../Api/Asset/assetApi";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import HelpIcon from "@material-ui/icons/Help";
import { FileSaver } from "file-saver";
import XLSX from "sheetjs-style";
import { CheckPicker } from "rsuite";
import Container from "@material-ui/core/Container";
import { useDispatch, useSelector } from "react-redux";
import Papa from "papaparse";
import { assetActions } from "../../Store/Reducers/ClonosAssetReducer";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import ALLASSETIMG from "../../assets/images/all-gear.png";
import TextField from "@material-ui/core/TextField";
import {
  createBulkAssets,
  getAssetFilters,
  postAssetFilters,
  deleteAsset,
  downloadAssetTemp,
  getAllAssetImageDetails,
} from "../../Api/Asset/assetApi";
import { getAllPermissions } from "../../Api/User/UserApi";
import { makeStyles, withStyles } from "@material-ui/styles";
import { Box, Avatar } from "@material-ui/core";
import PreviewImage from "../Dialogs/ClonosPreviewImage";
import ClonosConfirmationDialog from "../Dialogs/ClonosConfirmationDialog";
import * as xlsx from "xlsx";
import Grid from "@material-ui/core/Grid";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { Modal } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import PostAddIcon from "@material-ui/icons/PostAdd";
import jsPDF from "jspdf";
import StorageIcon from "@material-ui/icons/Storage";
import configs from "../../config";
import { getUser } from "../../utils/clonosCommon";

const HtmlTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: "800px",

    // width: "500px",
    // height: "300px",

    border: "3px solid #dadde9",
  },
}))(Tooltip);

// HELP USER DIALOG________________________________________________________________________________________________
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{
            position: "absolute",
            right: 10,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function ClonosAllAssets() {
  const NAVIGATE = useNavigate();
  const dispatch = useDispatch();
  const allAssets = useSelector((state) => state.assetData.allAssets);
  const USER_DETAILS = getUser();
  const [filters, setfilters] = useState({});
  const [filteredusers, setfilteredusers] = useState([]);
  const [calendarVal, setcalendarVal] = useState(new Date());
  const [calenderChange, setcalenderChange] = useState(false);
  const [renderUserTable, setrenderUserTable] = useState(false);
  const [allAssetImageSource, setAllAssetImageSource] = useState([]);
  const [allAssetMessages, setallAssetMessages] = useState([]);
  const [assetTypes, setassetTypes] = useState([]);
  const [filterPayload, setfilterPayload] = useState({
    tagId: "",
    productName: "",
    type: "",
    isActive: "",
    createdDate: "",
    assetName: "",
  });
  const [openDelDialog, setopenDelDialog] = React.useState(false);
  const handleCloseDelDialog = () => {
    setopenDelDialog(false);
  };
  const [openImg, setOpenImg] = useState(false);
  const handleOpenPreview = () => setOpenImg(true);
  const handleClosePreview = () => setOpenImg(false);
  const [img, setImg] = useState("");
  const [assetImgDimentions, setAssetImgDimentions] = useState("");
  const [assetImgName, setAssetImgName] = useState("");
  const [assetImgSize, setAssetImgSize] = useState("");
  const [assetImgType, setAssetImgType] = useState("");
  const [selectedRows, setselectedRows] = useState([]);
  const contentRef = useRef(null);
  const [typevalue, settypevalue] = useState([]);
  const [allpermissions, setallpermissions] = useState([]);
  const handleEngineeringData = (asset) => {
    // dispatch(assetActions.getSingleAsset(asset));
    NAVIGATE("/engineering-data", { state: asset });
  };

  // useEffect(() => {
  //   getAllPermissions()
  //     .then((res) => {
  //       console.log("getAllPermissions RESPONSE", res);
  //       setallpermissions(res?.data?.result);
  //     })
  //     .catch((err) => console.log("getAllPermissions ERROR".err));
  // }, []);

  const [handlePermission, sethandlePermission] = useState({});

  const currentPermissionsSelector = useSelector(
    (state) => state.userData.loggedUserPermissions
  );

  useEffect(() => {
    allpermissions?.map((permission) => {
      sethandlePermission((prev) => ({
        ...prev,
        [`${permission.permissionType}`]: false,
      }));
    });
    currentPermissionsSelector?.map((permission) => {
      sethandlePermission((prev) => ({
        ...prev,
        [`${permission.permissionType}`]: true,
      }));
    });
  }, [allpermissions, currentPermissionsSelector]);

  const handleAssetView = (asset) => {
    // dispatch(assetActions.getSingleAsset(asset));
    NAVIGATE("/view-asset", { state: asset });
  };

  const columns = [
    { field: "assetId", headerName: "ID", width: 75 },
    {
      field: "assetName",
      headerName: "Asset name",
      width: 150,
    },
    {
      field: "productName",
      headerName: "Product Name",
      width: 150,
    },
    {
      field: "tagId",
      headerName: "Tag ID",
      width: 110,
    },
    {
      field: "type",
      headerName: "Type",
      width: 110,
    },
    // {
    //   field: "height",
    //   headerName: "Height",
    //   width: 110,
    // },
    // {
    //   field: "length",
    //   headerName: "Length",
    //   width: 110,
    // },
    // {
    //   field: "breadth",
    //   headerName: "Breadth",
    //   width: 110,
    // },
    {
      field: "shortDescription",
      headerName: "Short Description",
      width: 110,
    },

    {
      field: "assetImage",
      headerName: "Asset Image",
      width: 145,
      renderCell: (value) => {
        // console.log("renderCell", value.row);
        const imageasset = new Image();
        imageasset.src = value.row.assetImage;
        const dimentions = imageasset.height + " x " + imageasset.width + " px";

        const imageDetail = allAssetImageSource?.filter(
          (asset) => asset.assetId === value.row.assetId
        );

        return (
          <div>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <img
                    // src={
                    //   imageDetail[0]?.imageSource
                    //     ? imageDetail[0]?.imageSource
                    //     : "https://www.ohcampus.com/assets/images/No_image_available.png"
                    // }
                    src={
                      value.row.assetImage
                        ? value.row.assetImage
                        : "https://www.ohcampus.com/assets/images/No_image_available.png"
                    }
                    // src="https://mobimg.b-cdn.net/v3/fetch/05/05eeb93a2e41734ecb6044146351f11e.jpeg?h=900&r=0.5"
                    // src={asset.img}
                    width="100%"
                    height="300px"
                  ></img>
                </React.Fragment>
              }
            >
              <Avatar
                onClick={(bool, event) => {
                  handleOpenPreview();
                  // imageDetail[0]?.imageSource
                  //   ? setImg(imageDetail[0]?.imageSource)
                  //   : setImg(
                  //       "https://www.ohcampus.com/assets/images/No_image_available.png"
                  //     );
                  value.row.assetImage
                    ? setImg(value.row.assetImage)
                    : setImg(
                        "https://www.ohcampus.com/assets/images/No_image_available.png"
                      );
                  setAssetImgName(imageDetail[0]?.imageName);
                  // setAssetImgName(assetImageName);
                  // setAssetImgName(imgDetails.name);
                  // setAssetImgDimentions(imageDetail[0]?.imageDimentions);
                  setAssetImgDimentions(dimentions);
                  setAssetImgSize(
                    imageDetail[0]
                      ? (imageDetail[0]?.imageSize / 1024).toFixed(2) + " KB"
                      : "0 KB"
                  );
                  setAssetImgType(imageDetail[0]?.imageType);
                }}
                // src={
                //   imageDetail[0]?.imageSource
                //     ? imageDetail[0]?.imageSource
                //     : "https://www.ohcampus.com/assets/images/No_image_available.png"
                // }
                src={
                  value.row.assetImage
                    ? value.row.assetImage
                    : "https://www.ohcampus.com/assets/images/No_image_available.png"
                }
                // src={asset.img}
                variant="square"
                style={{
                  width: "96px",
                  height: "96px",
                  border: "3px solid #dadde9",
                }}
              ></Avatar>
            </HtmlTooltip>
          </div>
        );
      },
    },

    // {
    //   field: "assetImage",
    //   headerName: "Asset Image",
    //   width: 110,
    //   editable: true,
    //   renderCell: (value) => {
    //     console.log("renderCell", value);
    //     return <img src={value} alt={value} />
    //   }
    // },
    {
      field: "createdDate",
      headerName: "Created Date",
      width: 110,
      renderCell: (value) => {
        return new Date(`${value.row.createdDate}`).toLocaleDateString();
      },
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {USER_DETAILS.permissions.includes("ast004") && (
              <Tooltip title="View Asset">
                <IconButton
                  aria-label="view"
                  onClick={() => handleAssetView(params.row)}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            )}
            {USER_DETAILS.permissions.includes("doc007") ? (
              <Tooltip title="Manage Documents">
                <IconButton
                  aria-label="Manage Documents"
                  onClick={() => {
                    dispatch(assetActions.getSingleAsset(params.row));
                    NAVIGATE("/view-associated-documents", {
                      state: params.row,
                    });
                  }}
                >
                  <PostAddIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
    {
      field: "engineeringData",
      headerName: "Engineering Data",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Engineering Data">
              <IconButton
                aria-label="Engineering Data"
                onClick={() => handleEngineeringData(params.row)}
                style={{
                  display: USER_DETAILS.permissions.includes("egd005")
                    ? "block"
                    : "none",
                }}
              >
                <StorageIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const handleDatechange = (value) => {
    console.log("handleDatechange value", value.toDate());
    setcalenderChange(true);
    const date = value.toDate();
    const ISOString = date.toISOString();
    var split = ISOString.split("T");
    var convertedString = `${split[0]}`;
    console.log("split", split);
    setfilterPayload((prev) => ({ ...prev, createdDate: convertedString }));
    setcalendarVal(value);
  };
  const handleTitle = (name) => {
    if (name === "isActive") {
      return null;
    } else if (name === "tagId") {
      return "Tag Id ";
    }
    return name.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
      return str.toUpperCase();
    });
  };

  const handleClearFilter = () => {
    setfilterPayload({
      name: "",
      userId: "",
      designation: "",
      isActive: "",
      createdDate: "",
      assetName: "",
      tagId: "",
      productName: "",
    });
    setcalenderChange(false);
    settypevalue([]);
  };
  const renderDropdownitems = (prop, value) => {
    if (prop === "type") {
      return (
        // <>
        //   <Dropdown.Item
        //     onClick={(e) =>
        //       setfilterPayload((prev) => ({ ...prev, [prop]: "all" }))
        //     }
        //   >
        //     All
        //   </Dropdown.Item>
        //   {assetTypes?.map((type) => {
        //     return (
        //       <Dropdown.Item
        //         onClick={(e) =>
        //           setfilterPayload((prev) => ({ ...prev, [prop]: type.name }))
        //         }
        //       >
        //         {type.name}
        //       </Dropdown.Item>
        //     );
        //   })}
        // </>
        null
      );
    } else {
      return (
        <>
          <Dropdown.Item
            onClick={(e) =>
              setfilterPayload((prev) => ({ ...prev, [prop]: "all" }))
            }
          >
            All
          </Dropdown.Item>
          {value?.map((val) => {
            if (prop === "type") {
              return (
                <>
                  <Dropdown.Item
                    onClick={(e) =>
                      setfilterPayload((prev) => ({ ...prev, [prop]: val }))
                    }
                  >
                    {val}
                  </Dropdown.Item>
                </>
              );
            }
            // if (prop === "type") {
            //   return (
            //     <>
            //       <Dropdown.Item
            //         onClick={(e) =>
            //           setfilterPayload((prev) => ({ ...prev, [prop]: val }))
            //         }
            //       >
            //         {val}
            //       </Dropdown.Item>
            //     </>
            //   );
            // }
            return (
              <>
                <Dropdown.Item
                  onClick={(e) =>
                    setfilterPayload((prev) => ({ ...prev, [prop]: val }))
                  }
                >
                  {val}
                </Dropdown.Item>
              </>
            );
          })}
        </>
      );
    }
  };
  useEffect(() => {
    getAssetFilters()
      .then((res) => {
        console.log("getAssetFilters RESPONSE", res);
        const orderData = {
          tagId: res.data.tagId,
          assetName: res.data.assetName,
          productName: res.data.productName,
          type: res.data.type,
          createdDate: [],
        };
        setfilters(orderData);
      })
      .catch((err) => console.log("getAssetFilters ERROR", err));
    getAllAssetImageDetails()
      .then((res) => {
        console.log("getAllAssetImageDetails res", res);
        setAllAssetImageSource(res.data.result);
      })
      .catch((err) => console.log("getAllAssetsImags err", err));
    getAssetTypes()
      .then((res) => {
        console.log("getAssetTypes RESPONSE", res);
        setassetTypes(res.data.result);
      })
      .catch((err) => console.log("getAssetTypes ERROR", err));
  }, []);

  useEffect(() => {
    getAllAssets()
      .then((res) => {
        console.log("getAllAssets RESPONSE", res);
        dispatch(assetActions.getAllAssets(res.data.rows));
      })
      .catch((err) => console.log("getAllAssets ERROR", err));

    getAllAssetImageDetails()
      .then((res) => {
        console.log("getAllAssetImageDetails RESPONSE", res);
        setallAssetMessages(res.data.result);
      })
      .catch((err) => console.log("getAllAssetImageDetails ERROR", err));
  }, [renderUserTable]);

  const tempHeaders = [
    { label: "Asset Name", key: "first_name" },
    { label: "Product Name", key: "last_name" },
    { label: "Tag ID", key: "email" },
    { label: "Type", key: "phone" },
    // { label: "Height", key: "state" },
    // { label: "Length", key: "BU" },
    // { label: "Breadth", key: "BU" },
    { label: "Short Description", key: "BU" },
  ];
  function toCamel(o) {
    var newO, origKey, newKey, value;
    function camelize(str) {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, "");
    }
    if (o instanceof Array) {
      return o.map(function (value) {
        if (typeof value === "object") {
          value = toCamel(value);
        }
        return value;
      });
    } else {
      newO = {};
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          newKey = (
            origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey
          )
            .toString()
            .replace(/\s(.)/g, function ($1) {
              return $1.toUpperCase();
            })
            .replace(/\s/g, "")
            .replace(/^(.)/, function ($1) {
              return $1.toLowerCase();
            });
          value = o[origKey];
          if (
            value instanceof Array ||
            (value !== null && value.constructor === Object)
          ) {
            value = toCamel(value);
          }

          newO[newKey] = value;
        }
      }
    }

    return newO;
  }
  const handleUploadSheet = (e) => {
    dispatch(commonActions.showApiLoader(true));
    var errorData = false;

    const fileTemp = {
      assetName: "",
      productName: "",
      tagId: "",
      type: "",
      assetId: "",
      assetCategory: "",
      // height: "",
      // length: "",
      // breadth: "",
      shortDescription: "",
    };

    function compareKeys(a, b) {
      var aKeys = Object.keys(a).sort();
      var bKeys = Object.keys(b).sort();
      return JSON.stringify(aKeys) === JSON.stringify(bKeys);
    }
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        console.log("workbook", workbook);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        const convertedJson = json.map((obj) => {
          return toCamel(obj);
        });

        if (convertedJson.length > 0) {
          errorData = compareKeys(convertedJson[0], fileTemp);
        }
        if (errorData) {
          createBulkAssets(convertedJson)
            .then((res) => {
              console.log("createBulkAssets RESPONSE", res);
              dispatch(commonActions.showApiLoader(false));
              dispatch(
                commonActions.handleSnackbar({
                  show: true,
                  message: `${convertedJson.length} ${
                    convertedJson.length > 1 ? "Assets" : "Asset"
                  } created successfully`,
                  type: "success",
                })
              );


              setrenderUserTable((prev) => !prev);
            })
            .catch((err) => {
              console.log("createBulkAssets err", err);
              dispatch(commonActions.showApiLoader(false));
              dispatch(
                commonActions.handleSnackbar({
                  show: true,
                  message: err.response.data.message,
                  type: "error",
                })
              );
              setrenderUserTable((prev) => !prev);
            });
        } else {
          dispatch(commonActions.showApiLoader(false));
          dispatch(
            commonActions.handleSnackbar({
              show: true,
              message: "Wrong File Uploaded",
              type: "error",
            })
          );
        }

        console.log("convertedJson", convertedJson);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  const handleApplyFilters = (filters) => {
    return Object.keys(filters).map((name) => {
      if (filters[name] !== "") {
        if (name === "isActive") {
          return (
            <span style={{ marginLeft: "20px" }}>
              <span style={{ fontWeight: "bold" }}>Asset Status:</span>
              <span style={{ marginLeft: "10px" }}>
                {filters[name] === 1
                  ? "Active"
                  : `${filters[name] === 0 ? "Inactive" : "All"}`}
              </span>
            </span>
          );
        }
        return (
          <span style={{ marginLeft: "20px" }}>
            <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {name}:
            </span>
            <span style={{ marginLeft: "10px" }}>{filters[name]}</span>
          </span>
        );
      } else {
        return "-";
      }
    });
  };
  useEffect(() => {
    let data = {};
    Object.keys(filterPayload).forEach((item) => {
      if (filterPayload[item] !== "" && filterPayload[item] !== "all") {
        data[item] = filterPayload[item];
      }
    });
    console.log("postAssetFilters data", data);
    postAssetFilters(data)
      .then((res) => {
        console.log("postAssetFilters RESPONSE", res);
        dispatch(assetActions.getAllAssets(res?.data?.assets || []));
      })
      .catch((err) => console.log("postAssetFilters ERROR", err));

    return () => {};
  }, [filterPayload]);

  const handleEditIcon = () => {
    const clonedAssets = allAssets.map((a) => ({ ...a }));
    console.log("clonedAssets", clonedAssets);
    let result = clonedAssets.filter((o1) =>
      selectedRows.some((o2) => o1.assetId === o2)
    );
    console.log("result", result);
    // dispatch(assetActions.getSingleAsset(result[0]));
    NAVIGATE("/edit-asset", { state: result[0] });
  };
  const handleDeleteAsset = () => {
    const data = {
      assetId: selectedRows,
      isDeleted: 1,
    };
    deleteAsset(data)
      .then((res) => {
        console.log("deleteUser RESPONSE", res);
        // setrenderUserTable((prev) => !prev);
        setopenDelDialog(false);
        dispatch(
          commonActions.handleSnackbar({
            show: true,
            message: `Successfully Deleted`,
            type: "success",
          })
        );

      })
      .catch((err) => {
        console.log("deleteUser ERROR", err);
        setopenDelDialog(false);
      });
  };
  const handleDownloadTemp = () => {
    window.open(`${configs.url}/api/v1/asset/assetsfile`, "_self");
  };

  const downloadExcel = (data) => {
    console.log("downloadExcel", data);
    const filteredArray = data.map((item) => {
      return {
        assetName: item.assetName,
        productName: item.productName,
        tagId: item.tagId,
        type: item.type,
        // height: item.height,
        // length: item.length,
        // breadth: item.breadth,
        shortDescription: item.shortDescription,
      };
    });
    const worksheet = xlsx.utils.json_to_sheet(filteredArray);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    xlsx.writeFile(workbook, "AssetsData.xlsx");
  };

  const download3dExcel = (data) => {
    console.log("downloadExcel", data);
    const filteredArray = data.map((item) => {
      return {
        uuid: item.assetId,
        assetName: item.assetName,
        productName: item.productName,
        tagId: item.tagId,
        type: item.type,
        shortDescription: item.shortDescription,
      };
    });
    const worksheet = xlsx.utils.json_to_sheet(filteredArray);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    xlsx.writeFile(workbook, "AssetsData-3d-system.xlsx");
  };

  //Export Table Functions ________________________________________________________________________________

  function SplitButton() {
    // const options = ['To CSV', 'To PDF', 'Rebase and merge'];
    let csvdata = [];
    let arrayHeaders = [];
    for (let i = 0; i < tempHeaders.length; i++) {
      arrayHeaders.push(tempHeaders[i].label);
    }
    csvdata.push(arrayHeaders);
    for (let i = 0; i < allAssets.length; i++) {
      let sample = [
        allAssets[i].assetName,
        allAssets[i].productName,
        allAssets[i].tagId,
        allAssets[i].type,
        // allAssets[i].height,
        // allAssets[i].length,
        // allAssets[i].breadth,
        allAssets[i].shortDescription,
      ];
      csvdata.push(sample);
    }

    const options = [
      {
        show: true,
        comp: (
          <CSVLink filename={"assets.csv"} data={csvdata}>
            To CSV
          </CSVLink>
        ),
      },
      {
        show: true,
        comp: (
          <a
            style={{ backgroundColor: "#fff" }}
            onClick={() => downloadExcel(allAssets)}
          >
            To Excel
          </a>
        ),
      },
      {
        show: USER_DETAILS.permissions.includes("e3d009"),
        comp: (
          <a
            style={{ backgroundColor: "#fff" }}
            onClick={() => download3dExcel(allAssets)}
          >
            To Excel - 3d System
          </a>
        ),
      },
    ];
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);
    };

    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    };

    return (
      <div
        style={{
          padding: "15px",
        }}
      >
        <Grid container direction="column">
          <Grid item xs={12}>
            <ButtonGroup
              variant="contained"
              color="primary"
              ref={anchorRef}
              aria-label="split button"
            >
              <Button onClick={handleClick}>{"Export Table"}</Button>
              <Button
                color="primary"
                size="small"
                aria-controls={open ? "split-button-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToggle}
              >
                <ArrowDropDownIcon />
              </Button>
            </ButtonGroup>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              handleClick
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="split-button-menu">
                        {options.map((option, index) => {
                          if (option.show) {
                            return (
                              <MenuItem
                                key={option.comp}
                                // disabled={index === 2}
                                selected={index === selectedIndex}
                                onClick={(event) =>
                                  handleMenuItemClick(event, index)
                                }
                                style={{ backgroundColor: "#fff" }}
                              >
                                {option.comp}
                              </MenuItem>
                            );
                          }
                        })}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Grid>
        </Grid>
      </div>
    );
  }
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //HELP DOcument Functions---------------------------------------------------------------------------------

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    backgroundColor: "white",
    boxShadow: 24,
    p: 10,
    color: "black",
  };

  const printContent = () => {
    // window.print();
    var data = document.getElementById("data").innerHTML;
    var body = document.getElementById("body").innerHTML;
    document.getElementById("body").innerHTML = data;
    window.print();
    document.getElementById("body").innerHTML = body;
  };

  const divRef = useRef(null);

  const printText = () => {
    const text = divRef.current.textContent;
    const doc = new jsPDF();
    doc.setProperties({
      title: "My document",
      subject: "This is the subject",
      author: "John Doe",
      keywords: "pdf, javascript, react",
      creator: "My React app",
      width: 210,
      height: 297,
    });

    const lines = doc.splitTextToSize(text, 250);
    doc.text(lines, 10, 10);
    doc.text(text, 10, 10);
    doc.save("text.pdf");
    doc.textAlign("center");
    window.open(doc.output("bloburl"), "_blank");
  };

  const onButtonClick = () => {
    // using Java Script method to get PDF file
    fetch("SamplePDF.pdf").then((response) => {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "SamplePDF.pdf";
        alink.click();
      });
    });
  };

  const printDiv = () => {
    let mywindow = window.open(
      "",
      "PRINT",
      "height=650,width=900,top=100,left=150"
    );

    mywindow.document.write(`<html><head><title>sample</title>`);
    mywindow.document.write("</head><body >");
    mywindow.document.write(document.getElementById("data").innerHTML);
    mywindow.document.write("</body></html>");

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
    mywindow.close();

    return true;
  };

  const Print = () => {
    //console.log('print');
    let printContents = document.getElementById("printablediv").innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  const state = {
    content:
      "Cras facilisis urna ornare ex volutpat, et convallis erat\nelementum. Ut aliquam, ipsum vitae gravida suscipit, metus dui\nbibendum est, eget rhoncus nibh metus nec massa. Maecenas\nhendrerit laoreet augue nec molestie. Cum sociis natoque\npenatibus et magnis dis parturient montes, nascetur ridiculus\nmus.\nPraesent commodo cursus magna, vel scelerisque nisl consectetur\net.Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.",
  };
  const downloadTXT = (content) => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(state.content)
    );
    element.setAttribute("download", "download.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  if (USER_DETAILS.permissions.includes("ast005")) {
    return (
      <div>
        <div>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              Create Assets - Guide
            </BootstrapDialogTitle>
            <div ref={divRef}>
              <DialogContent dividers>
                <Typography gutterBottom>
                  <p id="data">
                    Cras facilisis urna ornare ex volutpat, et convallis
                    eratelementum. Ut aliquam, ipsum vitae gravida suscipit,
                    metus duibibendum est, eget rhoncus nibh metus nec massa.
                    Maecenashendrerit laoreet augue nec molestie. Cum sociis
                    natoquepenatibus et magnis dis parturient montes, nascetur
                    ridiculusmus.
                  </p>
                </Typography>
                <Typography gutterBottom>
                  Praesent commodo cursus magna, vel scelerisque nisl
                  consectetur et. Vivamus sagittis lacus vel augue laoreet
                  rutrum faucibus dolor auctor.
                </Typography>
                {/* 
          <Typography gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
            magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
            ullamcorper nulla non metus auctor fringilla.
          </Typography> */}
              </DialogContent>
            </div>
            <DialogActions>
              <ButtonGroup
                ref={contentRef}
                className="print-content"
                color="primary"
                aria-label="outlined primary button group"
                style={{ marginRight: "20px" }}
              >
                <Button onClick={downloadTXT}>Download</Button>
                <Button onClick={printDiv}>Print</Button>
              </ButtonGroup>
            </DialogActions>
          </BootstrapDialog>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div style={{ display: "flex" }}>
              <img
                src={ALLASSETIMG}
                style={{ height: "40px", position: "relative", top: "5px" }}
                alt="ALL_USERS"
              />
              <h2
                style={{
                  color: "#3f51b5",
                  textAlign: "center",
                  fontFamily: "calibri",
                  marginLeft: "10px",
                }}
              >
                <i>All Assets</i>
              </h2>
            </div>
            <div>
              <ButtonGroup
                color="primary"
                aria-label="outlined primary button group"
                style={{ marginRight: "20px" }}
              >
                <input
                  style={{ display: "none" }}
                  id="contained-button-file"
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleUploadSheet}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                />
                <label htmlFor="contained-button-file">
                  <Button
                    variant="outlined"
                    color="primary"
                    component="span"
                    style={{
                      display: USER_DETAILS.permissions.includes("ast001") ? "block" : "none",
                    }}
                  >
                    Upload
                  </Button>
                </label>
                <Button
                  onClick={handleDownloadTemp}
                  style={{
                    display: USER_DETAILS.permissions.includes("ast001") ? "block" : "none",
                  }}
                >
                  {/* <CSVLink filename={"assets.csv"} data={[]} headers={tempHeaders}>
                Download Template
              </CSVLink> */}
                  Download Template
                </Button>
              </ButtonGroup>

              {USER_DETAILS.permissions.includes("ast001") ? (
                <button
                  className="createUserBtn"
                  onClick={() => {
                    NAVIGATE("/create-asset");
                  }}
                >
                  <PersonAddIcon
                    style={{
                      fontSize: "1.5em",
                      position: "relative",
                      top: "2px",
                    }}
                  />
                  <span
                    style={{
                      position: "relative",
                      top: "-3px",
                      left: "0.5rem",
                    }}
                  >
                    Create New Asset
                  </span>
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "10px",
              border: "1px solid #bcbcbc",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            <h5 style={{ position: "relative", top: "25px" }}>Filters:</h5>
            <div>
              {Object.keys(filters).map((item) => {
                if (item === "createdDate") {
                  return (
                    <DatePicker
                      style={{
                        padding: "15px 15px",
                        position: "relative",
                        top: "10px",
                        left: "10px",
                        color: !calenderChange ? "#bcbcbc" : "#000",
                        width: "120px",
                      }}
                      placeholder="Created Date"
                      value={calendarVal}
                      onChange={handleDatechange}
                    />
                  );
                } else if (
                  item === "tagId" ||
                  item === "productName" ||
                  item === "assetName"
                ) {
                  return (
                    <input
                      style={{
                        width: "120px",
                        marginLeft: "10px",
                        position: "relative",
                        top: "10px",
                        height: "30px",
                        // left: "10px",
                      }}
                      placeholder={`${
                        item === "userId"
                          ? "User Id"
                          : item
                              .replace(/([A-Z])/g, " $1")
                              .charAt(0)
                              .toUpperCase() +
                            item.replace(/([A-Z])/g, " $1").slice(1)
                      }`}
                      label={`${
                        item
                          .replace(/([A-Z])/g, " $1")
                          .charAt(0)
                          .toUpperCase() +
                        item.replace(/([A-Z])/g, " $1").slice(1)
                      }`}
                      onChange={(e) =>
                        setfilterPayload((prev) => ({
                          ...prev,
                          [item]: e.target.value,
                        }))
                      }
                      type={"text"}
                      id={item}
                      value={filterPayload[item]}
                    />
                  );
                } else if (item === "isActive") {
                  return null;
                } else if (item === "type") {
                  return (
                    <CheckPicker
                      data={assetTypes.map((item) => ({
                        label: item.name,
                        value: item.name,
                      }))}
                      placeholder="Type"
                      style={{ width: 224 }}
                      onChange={(val) => {
                        if (val.length < 1) {
                          setfilterPayload((prev) => ({
                            ...prev,
                            [item]: "",
                          }));
                        } else {
                          setfilterPayload((prev) => ({
                            ...prev,
                            [item]: val,
                          }));
                        }
                        settypevalue(val);
                      }}
                      value={typevalue}
                    />
                  );
                }
                return (
                  <Dropdown
                    title={handleTitle(item)}
                    style={{ margin: "15px 0 0 20px" }}
                  >
                    {renderDropdownitems(item, filters[item])}
                  </Dropdown>
                );
              })}
            </div>
            <div
              style={{
                marginLeft: "50px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                style={{
                  height: "30px",
                  padding: "5px 20px",
                  position: "relative",
                  top: "20px",
                  backgroundColor: "#FFCCCB",
                }}
                onClick={handleClearFilter}
              >
                Clear Filter
              </button>
              <Tooltip title="Help">
                <HelpIcon
                  onClick={handleOpen}
                  style={{
                    marginTop: "20px",
                    marginLeft: "5px",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            </div>
          </div>
        </div>
        <div style={{ height: "700px", width: "100%" }}>
          {selectedRows.length > 0 && (
            <div
              style={{
                backgroundColor: "#3f51b4",
                padding: "0rem 1rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h4 style={{ color: "#fff" }}>
                {`${selectedRows.length} ${
                  selectedRows.length > 1 ? "rows" : "row"
                }`}{" "}
                selected
              </h4>
              <div>
                {selectedRows.length < 2 && USER_DETAILS.permissions.includes("ast002") && (
                  <>
                    <Tooltip title="Edit">
                      <IconButton aria-label="edit" onClick={handleEditIcon}>
                        <EditIcon style={{ color: "#fff" }} />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                {USER_DETAILS.permissions.includes("ast003") ? (
                  <Tooltip title="Delete">
                    <IconButton
                      aria-label="delete"
                      onClick={() => setopenDelDialog(true)}
                    >
                      <DeleteIcon style={{ color: "#fff" }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
          <DataGrid
            rowHeight={100}
            getRowId={(row) => row.assetId}
            rows={allAssets}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection={
              USER_DETAILS.permissions.includes("ast002") || USER_DETAILS.permissions.includes("ast003")
                ? true
                : false
            }
            disableColumnMenu
            disableSelectionOnClick
            onSelectionModelChange={(selection) => {
              console.log("onSelectionModelChange", selection);
              setselectedRows(selection);
            }}
          />
          <div style={{ marginTop: "20px" }}>
            <SplitButton />
          </div>
          <div style={{ padding: "20px" }}>
            <p style={{ marginBottom: "20px" }}>
              Applied Filters: {handleApplyFilters(filterPayload)}
            </p>
          </div>
          <PreviewImage
            handleClosePreview={handleClosePreview}
            openImg={openImg}
            img={img}
            assetImgName={assetImgName}
            assetImgDimentions={assetImgDimentions}
            assetImgSize={assetImgSize}
            assetImgType={assetImgType}
          />
        </div>
        <ClonosConfirmationDialog
          Open={openDelDialog}
          Title="Delete Asset"
          Content="Are you sure, You want to delete this asset ?"
          CloseDialog={() => handleCloseDelDialog}
          ProceedDialog={() => handleDeleteAsset}
        />
      </div>
    );
  }
  {
    return (
      <Container component="main" maxWidth="sm">
        <h1 style={{ color: "#3F51B5", textAlign: "center" }}>Unauthorized</h1>
        <h4 style={{ color: "#3F51B5", textAlign: "center" }}>
          All Assets - No permission to view this page. Please contact admin.
        </h4>
      </Container>
    );
  }
}
