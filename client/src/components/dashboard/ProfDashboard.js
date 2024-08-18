import React, { useState } from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import swal from "sweetalert";
import { logoutUser } from "../../actions/authActions";
import LogsTable from "./LogsTable.js";
import { connect } from "react-redux";

function ProfDashboard(props) {
  const [examDialogOpen, setExamDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [examLink, setExamLink] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(0);
  const [examCode, setExamCode] = useState("");
  const [errorText, setErrorText] = useState("");
  const [examCodeSearch, setExamCodeSearch] = useState("");
  const axios = require("axios");

  function openExamDialog() {
    setExamDialogOpen(true);
  }

  function closeExamDialog() {
    setName("");
    setExamLink("");
    setDate("");
    setTime("");
    setDuration(0);
    setExamCode("");
    setErrorText("");
    setExamDialogOpen(false);
  }

  function isUrl(s) {
    const regexp =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
  }

  function createExam() {
    if (name === "") {
      setErrorText("Name of Exam cannot be empty");
      return;
    }
    if (examLink === "") {
      setErrorText("Exam Link cannot be empty");
      return;
    }
    if (!isUrl(examLink)) {
      setErrorText("Exam Link must be a valid url");
      return;
    }
    if (duration === 0) {
      setErrorText("Duration cannot be 0");
      return;
    }
    if (examCode === "") {
      setErrorText("Click Generate exam code to get an exam code first");
      return;
    }
    const dateTimeStart = new Date(`${date}T${time}`);
    const currentDateTime = new Date();
    if (dateTimeStart < currentDateTime) {
      setErrorText("Please select a date and time in the future");
      return;
    }
    axios
      .post("/api/exams/createExam", {
        name: name,
        exam_link: examLink,
        date_time_start: dateTimeStart,
        duration: duration,
        exam_code: examCode,
        prof_email: props.prof_email,
      })
      .then(function (response) {
        console.log(response);
        swal(
          "Exam has been created. Your exam code has been copied to your clipboard, please share it with the students."
        );
      })
      .catch(function (error) {
        console.log(error);
        swal("Some error occurred in creating the exam");
      });

    closeExamDialog();
  }

  function generateCode() {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    const length = 5;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setExamCode(result);
    navigator.clipboard.writeText(result);
  }

  return (
    <div style={{ height: "100%" }} className="container valign-wrapper">
      <div className="row">
        <div className="col s12 center-align">
          <h4>
            <b>Hey there,</b> {props.name.split(" ")[0]}
            <p className="flow-text grey-text text-darken-1">
              You can create a new exam and see the results of previous exams.
            </p>
          </h4>
          <button
            style={{
              width: "200px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "1rem",
            }}
            onClick={openExamDialog}
            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
          >
            Create Exam
          </button>
          <button
            style={{
              width: "200px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginLeft: "10px",
              marginTop: "1rem",
            }}
            onClick={props.logoutUser}
            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
          >
            Logout
          </button>
          <br />
          <br />
          <LogsTable exam_code={examCodeSearch} prof_email={props.prof_email} />

          <Dialog
            open={examDialogOpen}
            onClose={closeExamDialog}
            aria-labelledby="form-dialog-title"
            repositionOnUpdate={false}
            style={{ padding: "10px 10px 10px 10px" }}
          >
            <DialogTitle id="form-dialog-title">Create Exam</DialogTitle>
            <DialogContent margin="20px" style={{ padding: "30px" }}>
              <DialogContentText>
                Enter details for the exam. Press Generate to generate the exam
                code and share it with the students.
              </DialogContentText>
              <TextField
                autoFocus
                padding="10px"
                margin="dense"
                variant="standard"
                id="name"
                label="Exam Name"
                type="text"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                id="examLink"
                name="examLink"
                label="Exam Link"
                margin="dense"
                variant="standard"
                value={examLink}
                onChange={(e) => setExamLink(e.target.value)}
                required
                fullWidth
              />
              <TextField
                id="date"
                name="date"
                label="Exam Date"
                margin="dense"
                variant="standard"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                fullWidth
              />
              <TextField
                id="time"
                name="time"
                label="Exam Time"
                margin="dense"
                variant="standard"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                fullWidth
              />
              <TextField
                id="duration"
                name="duration"
                label="Exam duration (minutes)"
                margin="dense"
                variant="standard"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
              <TextField
                id="examCode"
                name="examCode"
                label="Exam Code"
                margin="dense"
                variant="standard"
                value={examCode}
                disabled
                required
                fullWidth
              />
              <p style={{ color: "red" }}> {errorText}</p>
              <Button onClick={generateCode}>Generate Exam Code</Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeExamDialog} color="secondary">
                Close
              </Button>
              <Button onClick={createExam} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

ProfDashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(ProfDashboard);
