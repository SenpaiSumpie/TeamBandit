import React, { useState, useEffect, Fragment } from "react";

// MUI Imports
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";

// Datagrid
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
} from "@mui/x-data-grid";

import SetScheduleWeeks from "./SetScheduleWeeks";
import StudentUploadAssignment from "./StudentUploadAssignment";
import SubmittedAssignmentsModal from "./SubmittedAssignmentsModal";

function ScheduleList({ courseInfo, userIdentifier }) {
    const [rows, setRows] = useState([]);
    const [rowChange, setRowChange] = useState(false);
    const [assignments, setAssignments] = useState([]);

    const getProperStartDateFormat = (params) => {
        // 1 week = 604800000 milliseconds
        var millisecondsOfWeek = new Date(params.row.schedule_week).getTime();
        return (
            <div>
                {assignments.map(
                    (assignment) =>
                        Math.abs(
                            Date.parse(
                                assignment.assignment_start_date.split("T")
                            ) - millisecondsOfWeek
                        ) < 604800000 &&
                        (Date.parse(
                            assignment.assignment_start_date.split("T")
                        ) -
                            millisecondsOfWeek) >=
                            0 && (
                            <div key={assignment.assignment_id} style={{display: "flex", flexDirection: "row"}}>
                                <p>Prepare for:&nbsp;</p>
                                <Link
                                    target="_blank"
                                    to={`/assignment/${assignment.assignment_name}-${assignment.assignment_id}`}
                                >
                                    <p>{assignment.assignment_name}</p>
                                </Link>
                                <p>&nbsp;({assignment.submission_type})</p>
                            </div>
                        )
                )}
            </div>
        );
    };

    const getProperDueDateFormat = (params) => {
        // 1 week = 604800000 milliseconds
        var millisecondsOfWeek = new Date(params.row.schedule_week).getTime();
        return (
            <div>
                {assignments.map(
                    (assignment) =>
                        Math.abs(
                            Date.parse(
                                assignment.assignment_due_date.split("T")
                            ) - millisecondsOfWeek
                        ) < 604800000 &&
                        Date.parse(
                            assignment.assignment_due_date.split("T")
                        ) -
                            millisecondsOfWeek >=
                            0 && (
                            <div key={assignment.assignment_id} style={{display: "flex", flexDirection: "row"}}>
                                <Link
                                    target="_blank"
                                    to={`/assignment/${assignment.assignment_name}-${assignment.assignment_id}`}
                                >
                                    <p>{assignment.assignment_name}</p>
                                </Link>
                                <p>&nbsp;due by:&nbsp;{assignment.assignment_due_date.split("T")[1]}&nbsp;MST</p>
                                {userIdentifier == "organizer" && <SubmittedAssignmentsModal assignment={assignment}/>}
                                {userIdentifier == "student" && <StudentUploadAssignment setRowChange={setRowChange} assignment={assignment}/>}
                            </div>
                        )
                )}
            </div>
        );
    };

    const getProperWeekFormat = (params) => {
        const week = params.row.schedule_week;
        var weekArray = week.split("-");
        var newWeek = weekArray[0] + "/" + weekArray[1].split("T")[0];
        return <h3>{newWeek}</h3>;
    };

    const getAssignments = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASEURL}/assignments/${courseInfo.course_id}`,
                { method: "GET", headers: { token: localStorage.token } }
            );
            const jsonData = await response.json();
            setAssignments(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        getAssignments();
    }, []);

    const columns = [
        {
            field: "schedule_week",
            headerName: "Week",
            renderCell: getProperWeekFormat,
            cellClassName: "border",
            flex: 2,
        },
        {
            field: "schedule_description",
            headerName: "Topics and Assignments",
            renderCell: getProperStartDateFormat,
            cellClassName: "border",
            sortable: false,
            flex: 2,
        },
        {
            field: "schedule_deliverables",
            headerName: "Deliverables",
            renderCell: getProperDueDateFormat,
            sortable: false,
            flex: 2,
        },
    ];

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer style={{ backgroundColor: "#FAC01A" }}>
                <Typography sx={{ m: 1 }} variant="h4">
                    Schedule
                </Typography>
                <GridToolbarExport sx={{ m: 1 }} />
                <SetScheduleWeeks
                    courseInfo={courseInfo}
                    rows={rows}
                    setRowChange={setRowChange}
                />
            </GridToolbarContainer>
        );
    };

    const CustomToolbarStudents = () => {
        return (
            <GridToolbarContainer style={{ backgroundColor: "#FAC01A" }}>
                <Typography sx={{ m: 1 }} variant="h4">
                    Schedule
                </Typography>
                <GridToolbarExport sx={{ m: 1 }} />
            </GridToolbarContainer>
        );
    };

    const getSchedule = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASEURL}/schedule/${courseInfo.course_id}`,
                { method: "GET", headers: { token: localStorage.token } }
            );
            const jsonData = await response.json();

            setRows(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    const getStudentSchedule = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASEURL}/schedule/studentSchedule/${courseInfo.course_id}`,
                { method: "GET", headers: { token: localStorage.token } }
            );
            const jsonData = await response.json();

            setRows(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        if (userIdentifier == "organizer"){
            getSchedule();
        }
        else if (userIdentifier == "student"){
            getStudentSchedule();
        }
        setRowChange(false);
    }, [rowChange]);

    if (userIdentifier == "organizer")
    {
        return (
            <div
                style={{
                    padding: "25px",
                    display: "flex",
                    height: "100%",
                    width: "100%",
                }}
            >
            <Box
            sx={{
                height: "100%",
                width: "100%",
                "& .border": {
                    borderRight: 1,
                    borderColor: "#d3d3d3",
                },
            }}
        >
                <DataGrid
                    rows={rows}
                    //rows={[{ schedule_week_id: 1, schedule_week: '3/06', schedule_description: 'Description', schedule_deliverables: 'Assignment', assignment_id: 15, assignment_name: "m" }]}
                    columns={columns}
                    rowHeight={150}
                    getRowId={(rows) => rows.schedule_week_id}
                    components={{ Toolbar: CustomToolbar }}
                    disableSelectionOnClick
                    disableColumnSelector
                />
                </Box>
            </div>
        );
    }
    else if (userIdentifier == "student")
    {
        return (
            <>
                <div
                    style={{
                        padding: "25px",
                        display: "flex",
                        height: "100%",
                        width: "100%",
                    }}
                >
                <Box
                sx={{
                    height: "100%",
                    width: "100%",
                    "& .border": {
                        borderRight: 1,
                        borderColor: "#d3d3d3",
                    },
                }}
            >
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        rowHeight={150}
                        getRowId={(rows) => rows.schedule_week_id}
                        components={{ Toolbar: CustomToolbarStudents }}
                        disableSelectionOnClick
                        disableColumnSelector
                    />
                    </Box>
                </div>
            </>
        );
    }
}
export default ScheduleList;