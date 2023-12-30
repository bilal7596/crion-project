import { IconButton, Popover, Popper, TableCell } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postUserFilters } from "../../Api/User/UserApi";

export const SupervisorPopOver = ({ data, id, open, anchorEl, classes , handleSupervisorEmail}) => {
  const [showPopover, setShowPopOver] = useState(false);
  const NAVIGATE = useNavigate();

  const handleClose = () => {
    if (data.superiorUsers.length > 1) {
        if (!showPopover) {
          setShowPopOver(true);
        } else {
          setShowPopOver(false);
        }
      }
  }
  return (
    <>
      <TableCell 
        aria-describedby={id}
        onClick={handleClose}
        style={{ cursor: "pointer",position:"relative" }}
      >
        {data.superiorUsers[0].name}
        {data.superiorUsers.length > 1 && " and "}
        {data.superiorUsers.length > 1
          ? data.superiorUsers.length - 1 + " more"
          : ""}
      </TableCell>
      <Popover style={{position:"absolute",left:"60% ",transform: "translate(-50%, 0)",top:"50%",zIndex:"100"}} id={id} open={showPopover} anchorEl={anchorEl} onClose={handleClose} >
        <div className={classes}>
            <div style={{display:"flex",justifyContent:"space-between",borderBottom:"1px solid ",alignItems:"center",padding:"0px 10px"}}>
            <h4 style={{color:"#3F51B5"}}>Supervisors </h4>
            <IconButton onClick={handleClose}>
              <CloseOutlined/>
            </IconButton>
            </div>
            <div>
          {showPopover ? (
            data.superiorUsers.map((user, index) => {
              return (
                <div
                  style={{
                    borderBottom: "1px solid #CCC",
                    marginTop: "0px",
                    padding: "10px",
                    background: "#FFFF",
                    fontSize: "16px",
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center"
                  }}
                  key={index}
                >
                  <p>{user.name}</p>
                  <p style={{marginTop: "0px",}}>-</p>
                  <p className="user-email" style={{marginTop: "0px",}} onClick={() => handleSupervisorEmail(user.userId)}>{user.email}</p>
                </div>
              );
            })
          ) : (
            <></>
          )}
            </div>
        </div>
      </Popover>
    </>
  );
};
