import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Button, Table, Typography, notification } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const useStyles = createUseStyles(() => {
  return {
    titleWrapper: {
      marginBottom: 15,
      display: "flex",
      justifyContent: "space-between",
    },
    title: {
      color: "#1890ff",
      fontSize: 24,
      fontWeight: 600,
    },
    actionWrapper: {
      display: "flex",
    },
    editAction: {
      marginRight: 40,
      cursor: "pointer",
      color: "#1890ff",
    },
    deleteAction: {
      cursor: "pointer",
      color: "#ff4d4f",
    },
    icon: {
      marginRight: 5,
    },
  };
});

const VehicleList = () => {
  const classes = useStyles();
  const nav = useNavigate();

  const [vehicles, setVehicles] = useState({});
  const [reload, setReload] = useState("");

  useEffect(() => {
    var token = localStorage.getItem("ownerToken");
    axios
      .get(`${process.env.REACT_APP_API_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setVehicles(res?.data);
      })
      .catch((err) => {
        let message = "Something is wrong! Please try again later.";
        if (err.response.data.status < 500) {
          message = err.response.data.error;
        }
        notification["error"]({
          message: "Error Occured",
          description: message,
        });
      });
  }, [reload]);

  const deleteVehicle = (id) => {
    var token = localStorage.getItem("ownerToken");
    axios
      .delete(`${process.env.REACT_APP_API_URL}/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        notification["success"]({
          description: "Vehicle has been removed",
        });
        setReload(id);
      })
      .catch((err) => {
        let message = "Something is wrong! Please try again later.";
        if (err.response.data.status < 500) {
          message = err.response.data.error;
        }
        notification["error"]({
          message: "Error Occured",
          description: message,
        });
      });
  };

  const columns = [
    {
      title: "Vehicle Type",
      dataIndex: "type",
    },
    {
      title: "Vehicle Number",
      dataIndex: "number",
    },
    {
      title: "Driver",
      dataIndex: "currentDriver",
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (text, record) => (
        <div className={classes.actionWrapper}>
          <Typography
            className={classes.editAction}
            onClick={() => nav(`/vehicles/edit/${record._id}`)}
          >
            <EditOutlined className={classes.icon} />
            Edit
          </Typography>
          <Typography
            className={classes.deleteAction}
            onClick={() => deleteVehicle(record._id)}
          >
            <DeleteOutlined className={classes.icon} />
            Delete
          </Typography>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={classes.titleWrapper}>
        <Typography className={classes.title}>List of vehicles</Typography>
        <Button type="primary" onClick={() => nav("/vehicles/add")}>
          Add Vehicle
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={vehicles?.data || []}
        rowKey="_id"
        pagination={{
          position: ["bottomCenter"],
          showSizeChanger: false,
          total: vehicles?.data?.length,
        }}
      />
    </>
  );
};

export { VehicleList };
