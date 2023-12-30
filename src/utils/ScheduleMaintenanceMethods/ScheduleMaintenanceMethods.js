import { saveAsDraftOrCreateMaintenanceTask } from "../../Api/ScheduleMaintenance/ScheduleMaintenance";
import { postAuditLog } from "../../Api/User/UserApi";
import { handleLoginExpiry, handleShowErrorAndWarning } from "../clonosCommon";

export const saveAsDraftOrCreateMaintenanceTaskMethod = async ({formData,dispatch,setFormData,Navigate}) => {
    try {
        let newPayload = {};
        if(formData?.maintenancePlanName) newPayload.maintenancePlanName = formData?.maintenancePlanName;
        if(formData?.description) newPayload.description = formData?.description;
        if(formData?.asset?.length) newPayload.asset = formData?.asset[0];
        // if(formData?.priority.id) newPayload.priority = formData?.priority?.id;
        if(formData?.team?.length) newPayload.team =  formData?.team //JSON.stringify(formData?.team);
        if(formData?.assignee) newPayload.assignee = formData?.assignee // JSON.stringify(formData?.assignee);
        if(formData?.priority.id) newPayload.priority = formData?.priority;
        if(formData?.department.id) newPayload.department = formData?.department;
        if(formData?.startDate) newPayload.startDate = formData?.startDate;
        if(formData?.endDate) newPayload.endDate = formData?.endDate;
        if(formData?.isRecurring){
            if(formData?.frequencyType?.id) newPayload.frequencyType = formData?.frequencyType?.id;
            if(formData?.isCustomFrequency){
                newPayload.frequencyPeriod = formData?.frequencyPeriod
            } else {
                newPayload.frequencyPeriod = 1
            }
        } 
        newPayload.status = formData?.status
        newPayload.isRecurring = formData?.isRecurring
        let validatedTasks = [];
        formData?.tasks?.map((task) => {
            if(task?.name) validatedTasks.push(task)
        })
        if(validatedTasks?.length) newPayload.maintenanceTask = validatedTasks
        console.log(newPayload,"newPaylaosd")
        const response = await saveAsDraftOrCreateMaintenanceTask(newPayload);
        if(response.data.status == 200 || response.data.status == 201){
          setFormData({})
          Navigate("/all-assets")
          handleShowErrorAndWarning({ dispatch, type: "success", message: "Maintenance Task Created successfully", showTime: 5000 })
        }
    } catch (err) {
        console.log(err)
         // Handle errors, including login expiration and display error messages.
         handleLoginExpiry(err, dispatch)

         // Check if the error status is not 401 (Unauthorized).
         if (err?.response?.data?.status !== 401) {
             // Show an error message with the specific error details.
             handleShowErrorAndWarning({ dispatch, type: "error", message: `${err.response.data.message}`, showTime: 5000 })
 
             // Log the error in the audit log.
             const error = err.response.data.error; 
             postAuditLog({ action: "Maintenance Task Created", message: error });
         }
    }
}

export const handleGetValuesOfMaintenanceTaskMethod = ({val,formData,setFormData,setTasks}) => {
  const { type } = val;
  if (type === "dynamicDropdown") {
      const { uniqueKey, selectedOption } = val;
      if(selectedOption?.length){
        setFormData((prev) => {
            return {
              ...prev,
              [uniqueKey]: selectedOption // { name: selectedOption[0]?.name, id: selectedOption[0]?.id },
            };
          });
      } else {
        delete formData[uniqueKey]
      }
    } else if (type === "select") {
      const { uniqueKey, updatedValue } = val;
      setFormData((prev) => {
        return {
          ...prev,
          [uniqueKey]: { name: updatedValue?.label, id: updatedValue?.value },
        };
      });
    } else if (type === "text" || type === "date" || type === "number" || type ===  "datetime-local") {
      const { uniqueKey, updatedValue } = val;
      setFormData((prev) => {
        return {
          ...prev,
          [uniqueKey]: updatedValue,
        };
      });
    } else if(type === "taskLibrary"){
      let taskSelectedFromLibrary = val?.selectedOption[0]?.preview || [];
      console.log(taskSelectedFromLibrary,"taskSelectedFromLibrary");
      setFormData((prev) => {
        return {
          ...prev,
          tasks : prev?.tasks?.length > 0 ? [...prev?.tasks,...taskSelectedFromLibrary] : taskSelectedFromLibrary
        }
      })
        // setTasks((prev) => {
        //     let temp = [
        //         ...prev,
        //         ...taskSelectedFromLibrary
        //     ]
            
        //     return temp
        // });
    }
}