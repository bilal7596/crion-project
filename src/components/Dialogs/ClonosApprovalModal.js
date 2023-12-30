import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Grid, IconButton, Tooltip } from '@material-ui/core';
import NOIMAGE from "../../assets/images/No_image_available.png"
import DoneAllIcon from "@material-ui/icons/DoneAll";
import CloseOutlined from "@material-ui/icons/CloseOutlined";
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modalContainer:{
    display:"flex",
    width:"100%",
    height:"100vh",
    justifyContent:"center",
    alignItems:"center"
  }
}))

export default function ClonosApprovalModal(props) {
  const classes = useStyles();
  const keys = Object.keys(props?.data)
  const [zoomImg,setZoomImg] = useState(false);
  const [isRightImg,setIsRightImg] = useState(null);
  console.log(keys,props.data)
  return (
    <div className={classes.modalContainer}>
      <Modal
        open={props.open}
        onClose={() => props.handleModal(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={classes.modalContainer}
      >
            <div style={{width:"50%",margin:"auto",height:"80vh",background:"#FFF",overflow:"auto"}}>
                <h3 style={{textAlign:"center",padding:"1em",color:"#3F51B5"}}>Asset Details</h3>
                {
                  keys.map((key) =>{
                    const fieldValue = props.data[key];
                    let date = null;
                    let time =null;
                    if(key === "createdDate"){
                      let createdDate = new Date(
                        props.data[key]
                      );
                      createdDate.setHours(createdDate.getHours() + 5);
                      createdDate.setMinutes(createdDate.getMinutes() + 29)
                      const isoDateStringWithHours =
                        createdDate.toISOString();
                      let dateTime =
                        isoDateStringWithHours.split("T");
                      date = dateTime[0].split("-");
                      let hhmmss = dateTime[1].split(".")[0];
                      time = hhmmss.split(":");
                    }
                    return (
                     (typeof(fieldValue) ==="string" || typeof(fieldValue) === "number") && <Grid key = {key} container style={{display:"flex",padding:"10px 50px"}}>
                        <Grid lg={6}>
                        <p style={{fontSize:"16px",fontWeight:"600"}}>{key}</p>
                        </Grid>
                        <Grid lg={6}>
                        {
                          (typeof(fieldValue) ==="string" && fieldValue.includes("http")) || (key === "assetImage" || key === "assetLayoutImage" || key === "asset3dModel")  ? <div style={{position:"relative"}}>
                          <img onMouseOver={() =>{ setZoomImg(true)
                          setIsRightImg(key)
                          }} onMouseOut={() => setZoomImg(false)} style={{width:"100px",height:"100px",borderRadius:"12px",overflow:"hidden"}} src={fieldValue || NOIMAGE}></img>
                          {zoomImg  && isRightImg === key && <div style={{position:"absolute",top:"-250px",right:"-40px"}}>
                            <img style={{width:"300px",height:"300px",borderRadius:"12px",overflow:"hidden"}}  src={fieldValue || NOIMAGE}></img>
                          </div>}
                        </div> : key === "createdDate" ? <div>
                            <p>{date[2]}{"/"}{date[1]}{"/"}{date[0]} - {time[0]}{":"}{time[1]}{":"}{time[2]}</p>
                          </div> :  <div>
                          <p>{fieldValue}</p> 
                          </div>
                        }
                        </Grid>
                      </Grid> 
                    )
                  })
                }
                <Grid container style={{display:"flex",justifyContent:"flex-end"}}>
                        <Grid lg={3} style={{display:"flex",justifyContent:"space-evenly",padding:"20px 10px"}}>
                        <Tooltip title="Approve ">
                        <IconButton
                          aria-label="approve "
                          onClick={() => {
                            props.setAction("approve");
                            props.setApprovalIds([props.data.approvalId])
                            props.setShowDailog(true)
                            props.setShowModal(false)
                          }}
                          onMouseOver={() => {
                            props.setIsApproveHovered(true)
                          }}
                          onMouseOut={() => {
                            props.setIsApproveHovered(false)
                          }}
                          style={{
                            color:props.isApproveHovered ? "#FFF": "black",
                            background: props.isApproveHovered   ? "#54B435":"#CCC",
                            borderRadius: "50%",
                            width:"48px",
                            height:"48px"
                          }}
                        >
                          <DoneAllIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject ">
                        <IconButton
                          aria-label="reject"
                          onClick={() => {
                            props.setAction("reject");
                            props.setApprovalIds([props.data.approvalId])
                            props.setShowDailog(true);
                            props.setShowModal(false)
                          }}
                          onMouseOver={() => {
                            props.setIsRejectHovered(true)
                          }}
                          onMouseOut={() =>{
                            props.setIsRejectHovered(false)
                          }}
                          style={{
                            color: props.isRejectHovered  ? "#FFF" :"#CF0A0A",
                            background: props.isRejectHovered  ? "#CF0A0A":"#CCC",
                            borderRadius: "50%",
                          }}
                        >
                          <CloseOutlined fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                        </Grid>
                      </Grid>
            </div>
      </Modal>
    </div>
  );
}
