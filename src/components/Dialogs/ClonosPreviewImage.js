import * as React from "react";
import { Box } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import { blue } from "@material-ui/core/colors";
// import { createTheme , ThemeProvider  } from '@material-ui/core/styles';

export default function PreviewImage(props) {
  return (
    <div>
      <Modal
        open={props.openImg}
        onClose={props.handleClosePreview}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onMouseDown={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            backgroundColor: "rgba(0, 0, 0, .5)",

            boxShadow: 24,
            p: 4,
            height: "90%",
            width: "80%"
          }}
        >
          <img
            src={props.img}
            style={{
              position: "relative",
              top: "50.2%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              // border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              maxHeight: "89.75%",
              height: "auto",
              width: "auto",
              maxWidth: "auto"
              // maxWidth: "1800px",
            }}
          ></img>

          <Typography
            id="modal-modal-description"
            variant="BUTTON TEXT"
            component="h4"
            style={{
              position: "absolute",
              color: "white",
              opacity: 0.8,
              top: "-0.0%",
              left: "0%",
              width: "100%",
              border: "2px solid #000",
              // boxShadow: 24,
            }}
          >
              {props.assetImgName}
          </Typography>
          <Box
            style={{
              position: "absolute",
              borderTop: "2px solid #000",
              // boxShadow: 24,
              height: "5%",
              bottom: "-0.2%",
              opacity: 0.8,
              width: "100%",
            }}
          >

            <Box
              style={{
                position: "absolute",
                color: "white",
                opacity: 0.8,
                top: "5%",
                height: "5%",
                // left:"75%",
                width: "50%",
              }}
            >
              <Typography
                id="modal-modal-title"
                sx={{ mt: 2 }}
                style={{
                  position: "relative",
                  color: "white",
                  top: "20%",
                  bottom: "0%",
                  left: "0%",
                  width: "50%",
                }}
              >
                {props.assetImgDimentions}
              </Typography>
            </Box>

            <Box
              variant="body2"
              style={{
                position: "absolute",
                opacity: 0.8,
                top: "5%",
                bottom: "0%",
                height: "5%",
                width: "99%",
                // right: "05%",
              }}
            >
              <Typography
                id="modal-modal-title"
                sx={{ mt: 2 }}
                style={{
                  position: "relative",
                  color: "white",
                  opacity: 0.8,
                  top: "20%",
                  bottom: "0%",
                  // right: "5%",
                  width: "100%",
                  textAlign: "right"
                }}
              >
                {props.assetImgSize}      {props.assetImgType}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
