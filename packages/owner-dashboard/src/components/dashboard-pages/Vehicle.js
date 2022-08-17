import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import {
  Typography,
  Form,
  Input,
  Button,
  Divider,
  notification,
  Upload,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";

const useStyles = createUseStyles(() => {
  return {
    title: {
      color: "#1890ff",
      fontSize: 24,
      fontWeight: 600,
    },
    form: {
      maxWidth: 600,
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
  };
});

const Vehicle = () => {
  const classes = useStyles();
  const nav = useNavigate();
  let { id } = useParams();

  const [file, setFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      getVehicleDetails();
    }
  }, [id]);

  const getVehicleDetails = async () => {
    var token = localStorage.getItem("ownerToken");
    await axios
      .get(`${process.env.REACT_APP_API_URL}/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        let data = res?.data?.data;
        if (data) {
          form.setFieldsValue({
            type: data?.type,
            number: data?.number,
            currentDriver: data?.currentDriver,
          });
          if (data?.image)
            setImageURL(`${process.env.REACT_APP_API_URL}/${data?.image}`);
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

  const onSubmitForm = (values) => {
    const formData = new FormData();
    formData.append("type", values.type);
    formData.append("number", values.number);
    formData.append("currentDriver", values.currentDriver);
    formData.append("file", file);

    var token = localStorage.getItem("ownerToken");
    let reqHeader = {
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
    };

    if (id) {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/vehicles/${id}`,
          formData,
          reqHeader
        )
        .then(() => {
          notification["success"]({
            message: "Success",
            description: "Vehicle updated",
          });
          nav("/vehicles");
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
    } else {
      axios
        .post(`${process.env.REACT_APP_API_URL}/vehicles`, formData, reqHeader)
        .then(() => {
          notification["success"]({
            message: "Success",
            description: "Vehicle added",
          });
          nav("/vehicles");
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
    }
  };

  const handleImageUpload = (info) => {
    setImageURL(URL.createObjectURL(info.file.originFileObj));
    setFile(info.file.originFileObj);
  };

  const dummyRequest = () => {
    return;
  };

  return (
    <>
      <Typography className={classes.title}>
        <ArrowLeftOutlined
          className={classes.backArrow}
          onClick={() => nav("/vehicles")}
        />
        {id ? "Edit Vehicle" : "Add Vehicle"}
      </Typography>
      <Divider />
      <Form
        form={form}
        name="sign-up"
        layout="vertical"
        labelCol={{
          span: 8,
        }}
        onFinish={onSubmitForm}
        autoComplete="off"
        className={classes.form}
      >
        <Form.Item
          id="type"
          label="Vehicle Type"
          name="type"
          rules={[
            {
              required: true,
              message: "Required",
            },
          ]}
        >
          <Input name="type" />
        </Form.Item>

        <Form.Item
          label="Number"
          name="number"
          rules={[
            {
              required: true,
              message: "Required",
            },
          ]}
        >
          <Input name="number" />
        </Form.Item>

        <Form.Item
          label="Current Driver"
          name="currentDriver"
          rules={[
            {
              required: true,
              message: "Required",
            },
          ]}
        >
          <Input name="currentDriver" />
        </Form.Item>

        <Form.Item label="Image">
          <Upload
            name="avatar"
            listType="picture-card"
            accept=".jpeg,.jpg,.png"
            showUploadList={false}
            onChange={(info) => {
              handleImageUpload(info);
            }}
            maxCount={1}
            customRequest={dummyRequest}
            className={classes.uploader}
          >
            {imageURL ? (
              <img src={imageURL} height={200} width={200} />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {id ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export { Vehicle };
