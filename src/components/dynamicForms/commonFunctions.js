export const uid = function () {
  return (
    Date.now().toString(36) +
    Math.floor(
      Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
    ).toString(36)
  );
};

export function deepCopy(obj) {
  var rv;

  switch (typeof obj) {
    case "object":
      if (obj === null) {
        // null => null
        rv = null;
      } else {
        switch (toString.call(obj)) {
          case "[object Array]":
            // It's an array, create a new array with
            // deep copies of the entries
            rv = obj.map(deepCopy);
            break;
          case "[object Date]":
            // Clone the date
            rv = new Date(obj);
            break;
          case "[object RegExp]":
            // Clone the RegExp
            rv = new RegExp(obj);
            break;
          // ...probably a few others
          default:
            // Some other kind of object, deep-copy its
            // properties into a new object
            rv = Object.keys(obj).reduce(function (prev, key) {
              prev[key] = deepCopy(obj[key]);
              return prev;
            }, {});
            break;
        }
      }
      break;
    default:
      // It's a primitive, copy via assignment
      rv = obj;
      break;
  }
  return rv;
}

export const insertAttrValue = (arr, path, newField) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === path.id) {
      arr[i].fieldValue = [...arr[i].fieldValue, newField];
    }
    if (Array.isArray(arr[i].fieldValue)) {
      insertAttrValue(arr[i].fieldValue, path, newField);
    }
  }

  return arr;
};

export const insertErr = (arr, errField) => {
  let attrNameErr = false;

  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].fieldName) {
      arr[i].attrNameErr = true;
      attrNameErr = true
    }
    if (Array.isArray(arr[i].fieldValue)) {
      insertErr(arr[i].fieldValue, errField);
    }
  }

  // const errInsertedArr = arr?.map((item) => {
  //   if (!item.fieldName) {
  //     attrNameErr = true;
  //     return {
  //       ...item,
  //       attrNameErr: true,
  //     };
  //   }
  //   if (Array.isArray(item.fieldValue)) {
  //     console.log("item", item);
  //     insertErr(item.fieldValue, errField);
  //   }

  //   return item;
  // });

  return {
    error: attrNameErr,
    attributes: arr,
  };
};

//GET MULTIPLE NESTED LEVEL ARRAY LENGTH


export function getNestedArrayLength(arr) {
  let length = 0;

  function getLength(arr) {
    arr.forEach((item) => {
      if (Array.isArray(item.fieldValue)) {
        length++;
        getLength(item.fieldValue);
      }
    });
  }

  getLength(arr)
  

  return length;
}
