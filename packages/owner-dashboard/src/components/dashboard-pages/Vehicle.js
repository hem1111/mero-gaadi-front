import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import {
  Typography,
  Form,
  Input,
  Button,
  Divider,
  Switch,
  Row,
  Col,
  notification,
  Upload,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

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
  const [facilities, setFacilities] = useState({
    inRent: false,
    negotiable: false,
    water: false,
    internet: false,
    parking: false,
    terrace: false,
  });

  useEffect(() => {
    if (id) {
      getRoomDetails();
    }
  }, [id]);

  const getRoomDetails = async () => {
    var token = localStorage.getItem("ownerToken");
    await axios
      .get(`${process.env.REACT_APP_API_URL}/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        let data = res?.data?.data;
        if (data) {
          form.setFieldsValue({
            location: data?.location,
            numberOfRooms: data?.numberOfRooms,
            pricePerRoom: data?.pricePerRoom,
            description: data?.description,
          });
          setFacilities({
            inRent: data?.inRent,
            negotiable: data?.negotiable,
            water: data?.water,
            internet: data?.internet,
            parking: data?.parking,
            terrace: data.terrace,
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
    formData.append("inRent", facilities.inRent);
    formData.append("location", values.location);
    formData.append("numberOfRooms", values.numberOfRooms);
    formData.append("pricePerRoom", values.pricePerRoom);
    formData.append("description", values.description);
    formData.append("negotiable", facilities.negotiable);
    formData.append("water", facilities.water);
    formData.append("internet", facilities.internet);
    formData.append("parking", facilities.parking);
    formData.append("terrace", facilities.terrace);
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
          `${process.env.REACT_APP_API_URL}/rooms/${id}`,
          formData,
          reqHeader
        )
        .then(() => {
          notification["success"]({
            message: "Success",
            description: "Room updated",
          });
          nav("/rooms");
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
        .post(`${process.env.REACT_APP_API_URL}/rooms`, formData, reqHeader)
        .then(() => {
          notification["success"]({
            message: "Success",
            description: "Room added",
          });
          nav("/rooms");
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
          onClick={() => nav("/rooms")}
        />
        {id ? "Edit Room" : "Add Room"}
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
        <Form.Item label="For Rent">
          <Switch
            checked={facilities.inRent}
            onChange={(value) => {
              setFacilities({
                ...facilities,
                inRent: value,
              });
            }}
          />
        </Form.Item>

        <Form.Item
          id="location"
          label="Location"
          name="location"
          rules={[
            {
              required: true,
              message: "Required",
            },
          ]}
        >
          <Input name="location" />
        </Form.Item>

        <Form.Item
          label="Number of Rooms"
          name="numberOfRooms"
          rules={[
            {
              required: true,
              message: "Required",
            },
          ]}
        >
          <Input type="number" min={1} />
        </Form.Item>

        <Form.Item
          label="Price per Room"
          name="pricePerRoom"
          rules={[
            {
              required: true,
              message: "Required",
            },
          ]}
        >
          <Input type="number" min={1} />
        </Form.Item>

        <Row>
          <Col span={9}>
            <Form.Item label="Negotiable">
              <Switch
                checked={facilities.negotiable}
                onChange={(value) => {
                  setFacilities({
                    ...facilities,
                    negotiable: value,
                  });
                }}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Water">
              <Switch
                checked={facilities.water}
                onChange={(value) => {
                  setFacilities({
                    ...facilities,
                    water: value,
                  });
                }}
              />
            </Form.Item>
          </Col>

          <Col span={7}>
            <Form.Item label="Internet">
              <Switch
                checked={facilities.internet}
                onChange={(value) => {
                  setFacilities({
                    ...facilities,
                    internet: value,
                  });
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={9}>
            <Form.Item label="Parking">
              <Switch
                checked={facilities.parking}
                onChange={(value) => {
                  setFacilities({
                    ...facilities,
                    parking: value,
                  });
                }}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Terrace">
              <Switch
                checked={facilities.terrace}
                onChange={(value) => {
                  setFacilities({
                    ...facilities,
                    terrace: value,
                  });
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item id="description" label="Description" name="description">
          <TextArea name="description" rows={3} />
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
