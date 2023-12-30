export const removeAnyKeyFromAnObject = (key, object) => {
  let updatedValues = {}
  let removedElement = null
  for (let iteratorKey in object) {
    if (key != iteratorKey) {
      console.log("inside the loop", key, iteratorKey)
      console.log(typeof key)
      console.log(typeof iteratorKey)
      updatedValues[iteratorKey] = object[iteratorKey]
    }
    else removedElement = { [iteratorKey]: object[iteratorKey] }
  }
  return { updatedValues, removedElement }
};

export const handleTimeTimeISOToLocalFormat = (dateTimeString) => {
  const dateTime = new Date(dateTimeString);
  const currentTime = new Date();

  const timeDifferenceInMilliseconds = currentTime - dateTime;
  const timeDifferenceInSeconds = Math.floor(timeDifferenceInMilliseconds / 1000);
  const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
  const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
  const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

  const formattedDateTime = {
    date: `${dateTime.getMonth() + 1}/${dateTime.getDate()}/${dateTime.getFullYear()}`,
    time: `${(dateTime.getHours() < 10 ? '0' : '') + dateTime.getHours()}:${(dateTime.getMinutes() < 10 ? '0' : '') + dateTime.getMinutes()}:${(dateTime.getSeconds() < 10 ? '0' : '') + dateTime.getSeconds()}`,
    zone: dateTime.getHours() >= 12 ? 'PM' : 'AM',
  };

  if (timeDifferenceInMinutes < 1) {
    formattedDateTime.ago = "just now";
  }
  else if (timeDifferenceInMinutes > 1 && timeDifferenceInMinutes < 60) {
    formattedDateTime.ago = `${timeDifferenceInMinutes} minute${timeDifferenceInMinutes > 1 ? 's' : ''} ago`;
  }
  else if (timeDifferenceInHours > 1 && timeDifferenceInHours < 24) {
    formattedDateTime.ago = `${timeDifferenceInHours} hour${timeDifferenceInHours > 1 ? 's' : ''} ago`;
  }
  else {
    formattedDateTime.ago = `${timeDifferenceInDays} day${timeDifferenceInDays > 1 ? 's' : ''} ago`;
  }

  console.log('formattedDateTime:', formattedDateTime)
  return formattedDateTime;
};



