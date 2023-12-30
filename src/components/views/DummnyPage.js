import React from "react";
import { Button, Grid } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

const DummnyPage = () => {
    const classes = useStyles();

  return (
    <div>
      <Grid container style={{ margin: "20px 0" }}>
        <Grid item lg={12}>
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
                    <TableCell>S.No</TableCell>
                    <TableCell>User Name</TableCell>
                    <TableCell>Role Name</TableCell>
                    <TableCell>Assigned By</TableCell>
                    <TableCell>Assigned Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      1
                    </TableCell>
                    <TableCell>Derin</TableCell>
                    <TableCell>Some Role</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>28/11/2021</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      2
                    </TableCell>
                    <TableCell>Derin</TableCell>
                    <TableCell>Some Role</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>28/11/2021</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      3
                    </TableCell>
                    <TableCell>Derin</TableCell>
                    <TableCell>Some Role</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>28/11/2021</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default DummnyPage;
