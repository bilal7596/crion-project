import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { commonActions } from "../Store/Reducers/CommonReducer";
import { globalEntitiesActions } from "../Store/Reducers/ClonosGlobalEntities";
import CryptoJS from "crypto-js";
import { userActions } from "../Store/Reducers/ClonosUserReducer";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import { postAuditLog } from "../Api/User/UserApi";

// import { loginUser } from "../Api/User/UserApi";

// return the user data from the session storage
export const getUser = () => {
  const userStr = localStorage.getItem("loginUser");
  if (userStr) return JSON.parse(userStr);
  else return null;
};

// return the token from the session storage
export const getToken = () => {
  return Cookies.get("token") || null;
};

export const getRefreshToken = () => {
  return Cookies.get("refreshToken") || null;
};

// remove the token and user from the session storage
export const removeUserSession = () => {
  Cookies.remove("token");
  // localStorage.removeItem('loginUser');
  Cookies.remove("refreshToken");
  Cookies.remove("tokenExpires");
};

// set the token and user from the session storage
export const setUserSession = (
  token,
  refreshToken,
  data,
  email,
  permission
) => {
  const tokenDecoded = jwt_decode(token);
  const tokenExpiry = new Date(tokenDecoded.exp * 1000);
  console.log("tokenDecoded:", tokenDecoded);

  console.log("tokenDecoded:", tokenDecoded);
  console.log("tokenExpiry", tokenExpiry);
  console.log("tokenExpiry", tokenExpiry);

  const refreshTokenDecoded = jwt_decode(refreshToken);
  const refreshTokenExpiry = new Date(refreshTokenDecoded.exp * 1000);

  console.log("refreshTokenExpiry", refreshTokenExpiry);

  const loginUser = {
    id: data.id,
    email: email,
    role: data.role,
    userId: data.userId,
    permissions: permission.permissionsArray,
    role_id: permission.role_id,
  };

  Cookies.set("token", token, { expires: tokenExpiry });
  Cookies.set("refreshToken", refreshToken, { expires: refreshTokenExpiry });
  Cookies.set("tokenExpires", JSON.stringify(tokenExpiry));
  localStorage.setItem("loginUser", JSON.stringify(loginUser));
};

export const fileToBinaryData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", (event) => {
      const binaryData = event.target.result;
      resolve(binaryData);
    });

    reader.addEventListener("error", (error) => {
      reject(error);
    });

    reader.readAsArrayBuffer(file);
  });
};

export function binaryDataToFile(binaryData, fileName, fileType) {
  const blob = new Blob([binaryData], { type: fileType });

  // Create a new file upload object with the Blob data
  const file = new File([blob], fileName, { type: fileType });

  return file;
}

export function getFormatedDate(date) {
  const dateObject = new Date(date);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const formattedDate = `${dateObject.getDate()}/${dateObject.getMonth() + 1
    }/${dateObject.getFullYear()}`;
  return `${day}/${month}/${year}`;
}


export const getDayMonthYear = (date) => {
  console.log('date:', date)
  if (date === null) {
    return { day: 31, month: 12, year: 9999 };
  }
  const dateObject = new Date(date);
  console.log("dateObject:", dateObject);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  let hours = dateObject?.getHours();
  hours = String(hours).length == 1 ? `0${hours}` : hours
  let minutes = dateObject?.getMinutes();
  minutes = String(minutes).length == 1 ? `0${minutes}` : minutes
  const seconds = dateObject?.getSeconds();
  const time = `${hours}:${minutes}:${seconds}`
  console.log('time:', time)
  const monthString = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Augest",
    "September",
    "October",
    "November",
    "December",
  ];
  return { day, month, year, monthString: monthString[month - 1], time, hours, minutes, seconds };
};
/**
 *
 * @returns An object with user details like (email,id,name,permissions array, role, role_id, userId)
 */
export const handleLoggedInUser = () => {
  return JSON.parse(localStorage.getItem("loginUser"));
};

export const handleLoginExpiry = (err, dispatch) => {
  if (
    err?.response?.data?.status === 401 &&
    JSON.parse(localStorage.getItem("loginUser")) !== null
  ) {
    dispatch(commonActions.handleExpiryAlert(true));
    removeUserSession();
    localStorage.removeItem("loginUser");
  }
};

// Function to restrict the latitude to values between -90 and 90

export const limitDecimalDigits = (num) => {
  if (num.indexOf(".") !== -1 && num.split(".")[1].length > 4) {
    return num.split(".")[0] + "." + num.split(".")[1].slice(0, 4);
  }
  return num;
};

export const limitLatitude = (num) => {
  if (num < -90) {
    return "-90";
  }
  if (num > 90) {
    return "90";
  }
  return num;
};

export const limitLongitude = (num) => {
  if (num < -180) {
    return -180;
  }
  if (num >= 180) {
    return 180;
  }
  return num;
};

export const handleGetWidthDynamicallyBasedOnWindowWidth = ({
  widthInPercentage,
}) => {
  // Get the width of the screen
  const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  // Calculate 95% of the screen width
  const widthInPixels = (widthInPercentage / 100) * screenWidth;
  return widthInPixels;
};

const handleCollectDocumentsForMultipleDelete = ({
  itemId,
  needToDelete,
  setNeedToDelete,
  setIsEdit,
  setChecked,
  checked,
}) => {
  if (!needToDelete?.includes(itemId)) {
    setNeedToDelete((prev) => {
      let updateValue = [...prev, itemId];
      if (updateValue.length >= 2) setIsEdit(true);
      return updateValue;
    });
  } else {
    let updateValue = needToDelete?.filter((item) => item != itemId);
    if (updateValue.length < 2) {
      setIsEdit(false);
      setChecked(false);
      if (checked) updateValue = [];
    }
    setNeedToDelete(updateValue);
  }
};

export function handleGetRemainingWidthAndHeightOfBody({ width, height }) {
  const bodyWidth = document.body.clientWidth;
  const bodyHeight = window.innerHeight;

  const widthPercent = (width / bodyWidth) * 100;
  const heightPercent = (height / bodyHeight) * 100;

  const widthViewport = (width / bodyWidth) * 100;
  const heightViewport = (height / bodyHeight) * 100;

  const response = {
    pixelUnit: {
      currentPart: {
        height: height + "px",
        width: width + "px",
      },
      remainingPart: {
        height: bodyHeight - height + "px",
        width: bodyWidth - width + "px",
      },
    },
    percentUnit: {
      currentPart: {
        height: `${heightPercent}%`,
        width: `${widthPercent}%`,
      },
      remainingPart: {
        height: `${100 - heightPercent}%`,
        width: `${100 - widthPercent}%`,
      },
    },
    viewPortUnit: {
      currentPart: {
        height: `${heightViewport}vh`,
        width: `${widthViewport}vh`,
      },
      remainingPart: {
        height: `${100 - heightViewport}vh`,
        width: `${100 - widthViewport}vh`,
      },
    },
    remUnit: {
      currentPart: {
        height: height / 16 + "rem",
        width: width / 16 + "rem",
      },
      remainingPart: {
        height: (bodyHeight - height) / 16 + "rem",
        width: (bodyWidth - width) / 16 + "rem",
      },
    },
  };
  return response;
}

export const updateLayout = ({ dispatch }) => {
  let unity = localStorage.getItem("unity");
  let getLayoutDimensions = document.querySelector(".main_toolbar");
  let response = handleGetRemainingWidthAndHeightOfBody({ width: unity ? 0 : getLayoutDimensions?.clientWidth, height: unity ? 0 : getLayoutDimensions?.clientHeight })
  // let response = handleGetRemainingWidthAndHeightOfBody({ width: getLayoutDimensions?.clientWidth, height: getLayoutDimensions?.clientHeight })
  dispatch(globalEntitiesActions.setMainLayoutChildrenPosition(response));
};

export const handleUpdateLayoutDelaySetter = ({ dispatch }) => {
  let interval = setTimeout(() => {
    updateLayout({ dispatch });
  }, 1000);
  return interval;
};

// TO HANDLE DROPDOWN VALUES FOR SINGLE AND MULTIPLE SELECT
// item : item to be added or removed
// setFormData : method to set or remove selected value
//  type : key name for the selected value
// multiSelect : if requirement is multiple select then it should be true.
export const handleSelectvalue = ({
  item,
  setFormData,
  type,
  multiSelect,
  FormData,
  updateLocalData,
  updateChangedData,
  changedData,
}) => {
  setFormData((prev) => {
    const temp = prev[type] || [];
    console.log(item, "temp");
    const isPresent = temp.length
      ? temp?.some((field) => field?.id === item?.id)
      : false;

    if (multiSelect) {
      if (isPresent) {
        const updatedTemp = temp?.filter((field) => field?.id !== item?.id);
        return { ...prev, [type]: updatedTemp };
      } else {
        return { ...prev, [type]: [...temp, item] };
      }
    } else {
      if (updateLocalData) {
        updateLocalData((prev) => ({ ...prev, [type]: item }));
      }
      if (updateLocalData && updateChangedData) {
        let temp = {
          ...prev,
          [type]: item,
        };
        let changeIn = {
          ...changedData,
          [type]: item,
        };
        updateChangedData(changeIn);
        updateLocalData(temp);
      }
      return { ...prev, [type]: item };
    }
  });
};

export const handleDeselectValue = ({
  item: item,
  setFormData,
  type,
  multiSelect,
  formData,
}) => {
  if (!multiSelect) {
    delete formData[type];
    setFormData({ ...formData });
  }
};
const debounce = (func, delay) => {
  let timeoutId;

  return function () {
    const context = this;
    const args = arguments;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
};
const performSearch = (props) => {
  const { e, type, setMethod } = props;
  const { value } = e.target;
  setMethod(value);
};
export const handleSearchedData = debounce(performSearch, 500);

export const getYYYYMMDD_Format = (isoDateString) => {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are zero-based
  const day = date.getDate().toString().padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export const handleDecryptData = async ({ encryptedData, key }) => {
  try {
    let keys = CryptoJS.enc.Utf8.parse(key);
    let base64 = CryptoJS.enc.Base64.parse(encryptedData.toString());

    let src = CryptoJS.enc.Base64.stringify(base64);
    let decrypt = CryptoJS.AES.decrypt(src, keys, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    console.log("decrypt:", decrypt);
    //  var bytes = CryptoJS.AES.decrypt(user.password.toString(), "clonoskeyunity3D", { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    let decryptedData = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  } catch (err) {
    console.log("err:", err);
  }
};

/**
 * This function is getting use to replicate the req.query functionality in the frontend
 * @param {*} url This will contain the url once the request happen from the UNITY SIDE
 * @returns {} Output will look like this {unity:1/0,token:string}
 */
export function handleSegregateURL() {
  let url = window.location.href;
  let output = {};
  let splitedByAnd = url?.split("?")[1]?.split("&"); // First we splitting the url based on "?" then again we are spliting the based on "&"
  splitedByAnd?.map((ele) => {
    // Here we are creating the output object  with time complexity of (n^2)
    let elementArray = ele?.split("=");
    output[elementArray[0]] = elementArray[1];
  });

  let targetRoute = ""; // This will contain that specific path in which Unity want's to jump.
  let flag = false; // This will take or our length of the string that from where to where we need the string.
  let count = 0;
  for (let i = 1; i < url.length; i++) {
    // Iteration on the string
    if (url[i - 1] == "/") {
      count++;
      if (count == 3) flag = true;
    }

    if (url[i] == "?") {
      flag = false;
    }
    if (flag) targetRoute += url[i];
  }
  output["targetRoute"] = targetRoute;
  return output;
}

/**
 * Login session setter function for Unity team.
 * @param {*} token This will contain the token
 */
export function handleSessionForUnity({ token, refreshToken, dispatch }) {
  const tokenDecoded = jwt_decode(token);
  console.log("tokenDecoded:", tokenDecoded);
  let permissions = tokenDecoded?.permissions?.split(", ");
  const tokenExpiry = new Date(tokenDecoded.exp * 1000);

  Cookies.set("token", token, { expires: tokenExpiry });
  Cookies.set("tokenExpires", JSON.stringify(tokenExpiry));

  const refreshTokenDecoded = jwt_decode(refreshToken);
  const refreshTokenExpiry = new Date(refreshTokenDecoded.exp * 1000);

  console.log("refreshTokenExpiry", refreshTokenExpiry);

  const loginUser = {
    id: tokenDecoded?.id,
    email: tokenDecoded?.email,
    role: tokenDecoded?.role,
    userId: tokenDecoded?.userId,
    permissions,
    role_id: tokenDecoded?.role_id,
    email: tokenDecoded?.email,
  };

  // console.log('loginUser:', loginUser)
  Cookies.set("token", token, { expires: tokenExpiry });
  Cookies.set("refreshToken", refreshToken, { expires: refreshTokenExpiry });
  Cookies.set("tokenExpires", JSON.stringify(tokenExpiry));
  console.log("loginUser:", loginUser);
  localStorage.setItem("loginUser", JSON.stringify(loginUser));
  // if (loginUser.length) dispatch(commonActions.handleExpiryAlert(false));
}

/**
 * This function will decrypt the token and resolved the promise also and set the session of the user. (Login Jump)
 * @param {*} param0 it takes one object
 * @returns null
 */

export const handleMakePromiseFullfilled = async ({ dispatch }) => {
  let URL = handleSegregateURL();
  console.log("URL:", URL);
  if (URL?.unity) localStorage.setItem("unity", 1); // If this function is getting use by direct login jump.

  try {
    // let decryptedToken = await handleDecryptData({
    //   encryptedData: URL["token"],
    //   key: "clonoskeyunity3D",
    // }); // Here we are decrypting our token, which are encrypted from the Unity side.
    // let decryptedRefreshToken = await handleDecryptData({
    //   encryptedData: URL["refreshToken"],
    //   key: "clonoskeyunity3D",
    // });
    // console.log('decryptedRefreshToken:', decryptedRefreshToken)
    // if (decryptedRefreshToken.length && decryptedToken.length) {
    //   dispatch(
    //     userActions.setTokenMethod({
    //       decryptedToken,
    //       decryptedRefreshToken,
    //       unity: true,
    //     })
    //   ); // Here we are saving the information of the user in the store.
    //   // dispatch(userActions.setTokenMethod({ decryptedToken: URL.token, decryptedRefreshToken: URL.refreshToken, unity: true, })); // Here we are saving the information of the user in the store.
    //   // handleSessionForUnity({
    //   //   token: decryptedToken,
    //   //   refreshToken: decryptedRefreshToken,
    //   //   dispatch,
    //   // }); // Here we are saving all nessessary information for run our app.
    //   alert("dep")
    // }
    handleSessionForUnity({ token: URL.token, refreshToken: URL.refreshToken, dispatch, }); // Here we are saving all nessessary information for run our app.
  } catch (err) {
    console.log("err:", err);
  }
};

/**
 * "This function stops app loading during login jumps from Unity."
 * @param {Function} setterFunction - Manages component rendering for "Unauthorised" and "Login Jump."
 * @param {timeout} timeout - This will store the interval ID
 * @returns
 */
export const loginJumpLoadingStopper = ({ setterFunction, timeout }) => {
  let timer = null;
  timer = setTimeout(() => {
    setterFunction(true);
  }, timeout || 5000);
  return timer;
};

export const dummyEncryptionToken = ({ token }) => {
  const parsedkey = CryptoJS.enc.Utf8.parse("clonoskeyunity3D");
  const encrypted = CryptoJS.AES.encrypt(token, parsedkey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  const encryptedValue = encrypted.toString();
  return encryptedValue;
};

export function getCurrentDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = today.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

/**
 * Show an error or warning message using a snackbar notification.
 *
 *   @param {Object} options - An object containing the following properties:
 *   @property {function} dispatch - A function to dispatch actions (e.g., Redux dispatch).
 *   @property {string} type - The type of the message (e.g., 'error' or 'warning').
 *   @property {string} message - The message to display in the snackbar.
 *   @property {number} showTime - The duration (in milliseconds) to display the snackbar (optional, default is 500 milliseconds).
 */
export const handleShowErrorAndWarning = ({
  dispatch,
  type,
  message,
  showTime,
}) => {
  // Dispatch an action to show a snackbar notification.
  dispatch(
    commonActions.handleSnackbar({
      show: true, // Show the snackbar.
      message: message, // Set the message.
      type, // Set the message type (e.g., 'error' or 'warning').
      closeIn: showTime || 500, // Set the duration to close the snackbar (default: 500 milliseconds).
    })
  );
};

/**
 * Get the height and width of an HTML element based on its ID.
 *
 * @param {Object} options - An object containing the following property:
 * @property {string} idName - The ID of the HTML element to query.
 *
 * @returns {Object} - Returns an object with the `height` and `width` properties representing the element's client height and width, respectively.
 *                   - Returns null if the element with the specified ID is not found.
 */
export const handleGetHeightOrWidthBasedOnId = ({ idName }) => {
  let element = document.getElementById(idName);
  return { height: element?.clientHeight, width: element?.clientWidth };
};

/**
 * Handle redirection to a target route after a specified timeout.
 *
 * @param {Object} options - An object containing the following properties:
 *   @property {string} targetRoute - The route to navigate to after the timeout.
 *   @property {number} timeout - The timeout duration in milliseconds before redirection.
 *   @property {function} navigate - This is the navigate function which is passing from the parent (react-router-dom)
 * @returns {number} - Returns the ID of the timeout interval, which can be used to cancel the timeout if needed.
 */
export const handleRedirectAfterEvent = ({
  targetRoute,
  timeout,
  navigate,
}) => {
  let interval = null;

  // Set a timeout to navigate to the targetRoute after the specified timeout duration.
  interval = setTimeout(() => {
    navigate(targetRoute);
  }, timeout);

  // Return the ID of the timeout interval for potential cancellation.
  return interval;
};

export const handleMakeCamelCase = ({ string }) => {
  let splittedString = string?.split(" ");
  console.log("splittedString:", splittedString);
  splittedString = splittedString?.map((ele, index) => {
    console.log('splittedString:', splittedString)
    if (index === 0) return ele?.toLowerCase();
    else
      return ele?.charAt(0)?.toUpperCase() + ele?.split("")?.slice(1)?.join("");
  });
  console.log('splittedString:', splittedString)
  return splittedString?.join("");
};

/**
 * Compare two date strings to check if the first date is greater than the second date.
 *
 * @param {string} dateString1 - The first date string (e.g., "2023-10-27").
 * @param {string} dateString2 - The second date string (e.g., "2023-10-26").
 * @returns {boolean} - `true` if the first date is greater than the second date, `false` otherwise.
 */
export function isDate1GreaterThanDate2(dateString1, dateString2) {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);
  return date1 > date2;
}

/**
 *
 * @param {Object} => An object which contain "data" and "type"
 * @property {Array} data => "data" will be Array that will contain and object and all object will contain the keys and values , All keys will denote the column name and values will be as the value of the keys
 * @property {String} type => type will be the type of format in which you want to export details exp. ("xlsx","pdf","csv","excel").
 * @property {String} fileName => Name of that file which you want to download.
 */
export const exportInformation = ({
  data,
  type,
  fileName = "data",
  pageType,
}) => {
  if (type === "xlsx") {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "data");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } else if (type === "pdf") {
    handleGeneratePDF({ childRefs: data, layout: pageType, fileName });
  } else if (type === "csv") {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (type === "excel") {
  }
};

/**
 * Generate a PDF document from an array of child components using jsPDF and html2canvas.
 * @param {Object} options - The options for generating the PDF.
 * @param {Array} options.childRefs - An array of refs to child components to include in the PDF.
 * @param {string} options.layout - The layout of the PDF ("a4" for portrait, "l" for landscape).
 * @param {string} options.fileName - The desired name for the generated PDF file.
 * @param {string} options.pageType - This will be type of page exp: a4 / horizontal
 */
export const handleGeneratePDF = async ({
  childRefs,
  layout,
  fileName,
  pageType,
}) => {
  console.log("childRefs:", childRefs);

  // Create a new instance of jsPDF
  let dimensions = layout === pageType ? [210, 297] : [297, 210];
  let lcLayout = layout === pageType ? "p" : "l";
  const pdf = new jsPDF(lcLayout, "mm", dimensions, true);

  // Get the width and height of the PDF page
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Loop through each child component
  for (let index = 0; index < childRefs.length; index++) {
    const childRef = childRefs[index];

    // Retrieve the input element from the childRef
    const input = childRef;

    // Convert the input element to a canvas using html2canvas library with higher scale
    const canvas = await html2canvas(input, { useCORS: true, scale: 2 });

    // Get the data URL of the canvas as an image
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calculate the scaling ratio for the image to fit in the PDF page
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    // Set the initial position of the image in the PDF
    const imgX = 0;
    const imgY = 0;

    // Add a new page for each child component, except the first one
    if (index !== 0) {
      pdf.addPage();
    }

    // Add the image to the PDF with potentially higher DPI
    const dpi = 300; // Experiment with this value
    pdf.addImage(
      imgData,
      "PNG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio
    );

    // Save the PDF if it's the last child component
    if (index === childRefs.length - 1) {
      pdf.save(`${fileName}.pdf`);
    }
  }
};

/**
 * Generate a unique ID of the specified length using random alphanumeric characters.
 * @param {number} length - The length of the desired unique ID.
 * @returns {string} - The generated unique ID.
 */
export const generateUniqueId = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueId += characters.charAt(randomIndex);
  }

  return uniqueId;
};

export const toCamelCase = (inputString) => {
  console.log(inputString, "inputString");
  // Split the string into an array of words
  const words = inputString.split(" ");

  // Capitalize the first letter of each word (except the first one)
  const camelCaseWords = words.map((word, index) =>
    index === 0
      ? word.toLowerCase()
      : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  // Join the words back into a single string
  const camelCaseString = camelCaseWords.join("");

  return camelCaseString;
};

export const handleGetENVVariables = () => {
  return process.env;
};

// Decripting the id for direct login
export const handleDecryptURLKeys = async ({ URLkeyName, stringValue }) => {
  const URL = handleSegregateURL();
  const descriptedKey = await handleDecryptData({
    encryptedData: URL[URLkeyName] ? URL[URLkeyName] : stringValue,
    key: handleGetENVVariables().REACT_APP_SECRET_KEY_FOR_UNITY,
  });
  return descriptedKey;
};

export const handleEncryptionURLKeys = ({ needToEncrypt }) => {
  let encrypted = dummyEncryptionToken({ token: needToEncrypt });
  return encrypted;
};

export const handleCreateURLForDirectLogingJump = ({ pathParam }) => {
  let refreshToken = Cookies.get("refreshToken");
  let token = Cookies.get("token");
  localStorage.setItem(
    "lcCred",
    `localhost:3000/work-order-view?unity=1&token=${token}&refreshToken=${refreshToken}${pathParam}`
  );
};

export const handleAllowDirectAccessPage = async ({ keyName }) => {
  try {
    const URL = handleSegregateURL();
    const decryptdId = await handleDecryptURLKeys({
      stringValue: URL[keyName],
    });
    return decryptdId;
  } catch (err) {
    console.log("err:", err);
  }
};

export const globalHandleSearch = ({ typedString, withCompareString }) => {
  let needToSearch = typedString.toUpperCase();
  let element = withCompareString.toUpperCase();
  let count = 0;
  for (let i = 0; i < needToSearch.length; i++) {
    if (element[i] == needToSearch[i]) count++;
  }
  if (count == needToSearch.length) return true;
  return false;
};

export const getFormattedTime = ({ timestampString, timeZone }) => {
  const date = new Date(timestampString);

  const options = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone,
  };

  const formattedTime = date.toLocaleString("en-US", options);

  // Extract hours, minutes, seconds, and zone (AM/PM)
  const [timePart, zone] = formattedTime.split(" ");
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  return { hours, minutes, seconds, zone };
};

export const restrictSpecialCharacters = ({ value, specialCharacters }) => {
  let charArr = value.split("");
  const newValue = charArr
    .filter((char) => {
      return !specialCharacters.includes(char);
    })
    .join("");
  return newValue;
};



/**
 * This function will return the current date and time.
 * @returns 'yyyy-mm-ddT00:00'
 */
export const globalHandleGetCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};



// export const globalHandleCatchError = ({ dispatch, error, status, errorMessage, isSnackbar, snackbarMessage, snackbarType, snackbarTimeout, isPostAuditLog, postAuditLogActionTitle }) => {
//   handleLoginExpiry(error, dispatch)
//   if (status !== 401) {
//     isSnackbar && handleShowErrorAndWarning({ dispatch, type: snackbarType, message: snackbarMessage, showTime: snackbarTimeout })
//     if (isPostAuditLog) {
//       const lcError = error.response.data.error ? error.response.data.error : errorMessage;
//       postAuditLog({ action: postAuditLogActionTitle, message: lcError });
//     }
//   }
// }