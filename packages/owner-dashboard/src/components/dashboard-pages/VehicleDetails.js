import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Button, Table, Typography, Form, Divider, notification } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";

const useStyles = createUseStyles(() => {
  return {
    title: {
      color: "#1890ff",
      fontSize: 24,
      fontWeight: 600,
    },
    form: {
      maxWidth: 600,
      "& .ant-form-item-label>label": {
        color: "red",
        fontSize: "20px",
      },
      "& .ant-typography": {
        fontSize: "18px",
        fontWeight: "500",
      },
    },
    backArrow: {
      cursor: "pointer",
      marginRight: 10,
    },
    uploader: {
      "& .ant-upload.ant-upload-select-picture-card": {
        height: 200,
        width: 200,
      },
    },
    travelHistoryWrapper: {
      display: "flex",
      width: "100%",
    },
    mapWrapper: {
      width: "50%",
      margin: 20,
    },
    tableWrapper: {
      width: "50%",
      margin: 20,
    },
  };
});

const VehicleDetails = () => {
  const classes = useStyles();
  let { id } = useParams();

  const [imageURL, setImageURL] = useState(null);

  const [form] = Form.useForm();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (id) {
      getVehicleDetails();
    }
  }, [id]);

  const getVehicleDetails = async () => {
    var token = localStorage.getItem("ownerToken");
    await axios
      .get(`${process.env.REACT_APP_API_URL}/vehicles/${id}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        let data = res?.data?.data?.vehicle;
        if (data) {
          form.setFieldsValue({
            type: data?.type,
            number: data?.number,
            currentDriver: data?.currentDriver,
          });
          if (data?.image)
            setImageURL(`${process.env.REACT_APP_API_URL}/${data?.image}`);
        }
        let his = res?.data?.data?.travelHistory;
        if (his?.length > 0) {
          setHistory(his);
        }
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
      title: "Date and Time",
      dataIndex: "dateAndTime",
    },
    {
      title: "View in Map",
      render: () => <Button type="primary">{"View"}</Button>,
    },
  ];

  return (
    <>
      <Typography className={classes.title}>{"Basic Information"}</Typography>
      <Form form={form} name="sign-up" className={classes.form}>
        <Form.Item id="type" label="Vehicle Type">
          <Typography>{form.getFieldValue("type")}</Typography>
        </Form.Item>

        <Form.Item label="Number" name="number">
          <Typography>{form.getFieldValue("number")}</Typography>
        </Form.Item>

        <Form.Item label="Current Driver" name="currentDriver">
          <Typography>{form.getFieldValue("currentDriver")}</Typography>
        </Form.Item>

        <Form.Item label="Image">
          {imageURL && <img src={imageURL} height={200} width={200} />}
        </Form.Item>

        <Divider />
      </Form>

      <Typography className={classes.title}>{"Travel History"}</Typography>
      <div className={classes.travelHistoryWrapper}>
        <div className={classes.mapWrapper}>I am MAP</div>
        <div className={classes.tableWrapper}>
          <Table columns={columns} dataSource={history} rowKey="_id" />
        </div>
      </div>
    </>
  );
};

export { VehicleDetails };
