import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { MdVerifiedUser } from "react-icons/md";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";
import { useLocation, useNavigate } from "react-router-dom";
import NOIMG from "../../assets/images/noImg.jpg";
import PersonIcon from "@material-ui/icons/Person";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useState } from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useEffect } from "react";
import { getUserSessions } from "../../Api/User/UserApi";
import { removeUserSession } from "../../utils/clonosCommon";
import { commonActions } from "../../Store/Reducers/CommonReducer";

const useStyles = makeStyles((theme) => ({
  editIcon: {
    position: "absolute",
    top: "0",
    right: "1rem",
    backgroundColor: "#007bfd",
    padding: "0.5rem",
    borderRadius: "50%",
    boxShadow: "0px 0px 5px #ccc",
    cursor: "pointer",
    transition: "0.3s",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  root: {
    width: "350px",
  },
  container: {
    maxHeight: 250,
  },
}));

const ClonosViewUserDetail = () => {
  // const userDetail = useSelector((state) => state.userData.userDetail);
  const LOCATION = useLocation();
  const dispatch = useDispatch();
  const [userDetail, setuserDetail] = useState(LOCATION?.state);
  const [userSessions, setuserSessions] = useState([]);

  const classes = useStyles();

  const NAVIGATE = useNavigate();

  console.log("userDetail", userDetail);

  useEffect(() => {
    getUserSessions(LOCATION?.state?.userId)
      .then((res) => {
        console.log("getUserSessions RESPONSE", res);
        setuserSessions(res?.data?.rows);
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0rem 15rem",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            color: "#3f51b5",
            fontFamily: "calibri",
          }}
        >
          User Details
        </h2>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowBackIcon>send</ArrowBackIcon>}
          onClick={() => NAVIGATE(-1)}
        >
          Back
        </Button>
      </div>
      {/* <h1 style={{ textAlign: "center", color: "#707d91" }}>User Details</h1> */}

      <div className="userDetailsBox">
        {/* <Tooltip title="Edit Profile">
          <p className={classes.editIcon} onClick={() => NAVIGATE("/EditUser")}>
            <EditIcon style={{ color: "#fff", fontSize: "1.5em" }} />
          </p>
        </Tooltip> */}
        <Grid container>
          <Grid
            item
            xs={12}
            lg={6}
            style={{
              maxWidth: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Grid justifyContent="right">
              <img
                onMouseDown={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                src={userDetail.displaypic || NOIMG}
                alt="User Image"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "20px",
                  background: "#ffffff",
                  boxShadow: " 5px 5px 10px #cccccc,-5px -5px 10px #ffffff",
                }}
              />
            </Grid>
            <Grid
              style={{
                minWidth: "100%",
                padding: "0% 0% 0% 5%",
              }}
            >
              <Grid
                style={{
                  minWidth: "100%",
                  padding: "0% 0% 10% 0%",
                }}
              >
                <Typography
                  style={{
                    textTransform: "uppercase",
                    marginTop: "1rem",
                    letterSpacing: "1px",
                    fontSize: "1.8em",
                    color: "#3c54b4",
                    fontWeight: "bold",
                  }}
                >
                  {userDetail !== {} && userDetail.name}
                </Typography>
                <Typography
                  style={{
                    fontSize: "1em",
                    color: "gray",
                    letterSpacing: "1px",
                    padding: "0% 0% 0% 1%",
                  }}
                >
                  {userDetail !== {} && userDetail.email}
                </Typography>
              </Grid>
              <p
                style={{
                  margin: "0.5rem 0 0 0",
                  color: "gray",
                  letterSpacing: "2px",
                }}
              >
                {userDetail.Is_Admin === 1 ? (
                  <MdVerifiedUser
                    style={{ color: "#6de03a", fontSize: "1.2em" }}
                  />
                ) : (
                  <PersonIcon style={{ color: "#007bfd", fontSize: "1.2em" }} />
                )}
                <span
                  style={{
                    position: "relative",
                    top: "-0.2rem",
                    left: "0.3rem",
                  }}
                >
                  {userDetail !== {} && userDetail.Is_Admin === 1
                    ? "Admin"
                    : "User"}
                </span>
              </p>
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} lg={5}>
            <div style={{ padding: "5rem 0.5rem", width: "200%" }}>
              <div
                style={{
                  display: "flex",
                  // justifyContent: "space-between",
                  // padding: "0 3rem",
                  margin: "0 0 5px",
                }}
              >
                <Typography style={{ width: "30%" }}>Designation: </Typography>

                <Typography>
                  {userDetail !== {} && userDetail.designation}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  // justifyContent: "space-between",
                  // padding: "0 3rem",
                  margin: "0 0 5px",
                }}
              >
                <Typography style={{ width: "30%" }}>Role: </Typography>

                <Typography>
                  {userDetail !== {} && userDetail.roleName}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  // justifyContent: "space-between",
                  // padding: "0 3rem",
                  margin: "0 0 5px",
                }}
              >
                <Typography style={{ width: "30%" }}>
                  Business Unit:{" "}
                </Typography>

                <Typography>
                  {userDetail !== {} && userDetail.businessUnit}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  // justifyContent: "space-between",
                  // padding: "0 3rem",
                  margin: "0 0 5px",
                }}
              >
                <Typography style={{ width: "30%" }}>Mobile: </Typography>

                <Typography>{userDetail !== {} && userDetail.phone}</Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  // justifyContent: "space-between",
                  // padding: "0 3rem",
                  margin: "0 0 5px",
                }}
              >
                <Typography style={{ width: "30%" }}>State: </Typography>

                <Typography>{userDetail !== {} && userDetail.state}</Typography>
              </div>
              <div
                style={{
                  padding: "0 0rem",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseDown={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
              >
                <Typography style={{ fontWeight: "bold", width: "30%" }}>
                  Signature:{" "}
                </Typography>
                <img
                  style={{
                    width: "auto",
                    height: "100px",
                    marginTop: "0.2rem",
                  }}
                  src={userDetail.signature || NOIMG}
                  alt="Signature"
                />
              </div>
            </div>
          </Grid>
          <Grid item lg={7}>
            {userSessions.length > 0 && (
              <div style={{ marginLeft: "70px",padding: "5rem 0.5rem" }}>
                <Typography style={{ fontWeight: "bold" }}>
                  User Sessions:
                </Typography>
                <Paper className={classes.root}>
                  <TableContainer className={classes.container}>
                    <Table
                      className={classes.table}
                      size="small"
                      stickyHeader
                      aria-label="sticky table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Login</TableCell>
                          <TableCell>Logout</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userSessions?.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                              {new Date(`${row.loginTime}`).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {row.logoutTime ? new Date(`${row.logoutTime}`).toLocaleString() : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            )}
          </Grid>
        </Grid>
        {/* <p
          style={{
            color: "#007bfd",
            position: "absolute",
            right: "1rem",
            fontWeight: "bold",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          View User Documents
        </p> */}
      </div>
    </>
  );
};

export default ClonosViewUserDetail;
