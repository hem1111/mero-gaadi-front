import React, { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import {
  Col,
  Divider,
  Row,
  Typography,
  Input,
  Button,
  notification,
  Form,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";

const useStyles = createUseStyles(() => {
  return {
    title: {
      fontSize: 28,
    },
    label: {
      fontSize: 22,
      marginLeft: 40,
    },
    info: {
      fontSize: 18,
      marginLeft: -40,
    },
    editBtn: {
      cursor: "pointer",
    },
    updateBtn: {
      marginRight: 10,
    },
  };
});

const ProfileContent = () => {
  const classes = useStyles();

  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    contactNumber: "",
  });
  const [editName, setEditName] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [editAddress, setEditAddress] = useState(false);

  useEffect(() => {
    var token = localStorage.getItem("ownerToken");

    axios
      .get(`${process.env.REACT_APP_API_URL}/owners`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser({
          ...user,
          name: res.data.data.name,
          email: res.data.data.email,
          address: res.data.data.address || "",
          contactNumber: res.data.data?.contactNumber || "",
        });
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
  }, []);

  const handleUpdateProfile = () => {
    let body = {};
    if (editName) {
      body = { name: user.name };
    } else if (editContact) {
      body = { contactNumber: user.contactNumber };
    } else if (editAddress) {
      body = { address: user.address };
    }
    var token = localStorage.getItem("ownerToken");
    axios
      .put(`${process.env.REACT_APP_API_URL}/owners/update`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        notification["success"]({
          message: "Success",
          description: "Profile updated",
        });
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
    setEditName(false);
    setEditAddress(false);
    setEditContact(false);
  };

  return (
    <>
      <Typography className={classes.title}>Profile</Typography>
      <Divider />
      <Form onFinish={handleUpdateProfile}>
        <Row gutter={16}>
          <Col span={8} className={classes.label}>
            Name
          </Col>

          <Col span={12} className={classes.info}>
            {editName ? (
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Required",
                  },
                ]}
              >
                <Input
                  placeholder="Enter name"
                  value={user.name}
                  onChange={(event) => {
                    const { value } = event.target;
                    setUser({ ...user, name: value });
                  }}
                />
              </Form.Item>
            ) : (
              <>{user.name}</>
            )}
          </Col>

          <Col span={4} className={classes.editBtn}>
            {editName ? (
              <>
                <Button
                  type="primary"
                  className={classes.updateBtn}
                  htmlType="submit"
                >
                  Update
                </Button>
                <Button onClick={() => setEditName(false)}>Cancel</Button>
              </>
            ) : (
              <EditOutlined
                onClick={() => {
                  setEditAddress(false);
                  setEditContact(false);
                  setEditName(true);
                }}
              />
            )}
          </Col>
        </Row>
      </Form>
      <Divider />

      <Row gutter={16}>
        <Col span={8} className={classes.label}>
          Email
        </Col>
        <Col span={12} className={classes.info}>
          {user.email}
        </Col>
      </Row>
      <Divider />

      <Form onFinish={handleUpdateProfile}>
        <Row gutter={16}>
          <Col span={8} className={classes.label}>
            Address
          </Col>

          <Col span={12} className={classes.info}>
            {editAddress ? (
              <Form.Item
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Required",
                  },
                ]}
              >
                <Input
                  placeholder="Enter address"
                  value={user.address}
                  onChange={(event) => {
                    const { value } = event.target;
                    setUser({ ...user, address: value });
                  }}
                />
              </Form.Item>
            ) : (
              <>{user.address}</>
            )}
          </Col>

          <Col span={4} className={classes.editBtn}>
            {editAddress ? (
              <>
                <Button
                  type="primary"
                  className={classes.updateBtn}
                  htmlType="submit"
                >
                  Update
                </Button>
                <Button onClick={() => setEditAddress(false)}>Cancel</Button>
              </>
            ) : (
              <EditOutlined
                onClick={() => {
                  setEditAddress(true);
                  setEditContact(false);
                  setEditName(false);
                }}
              />
            )}
          </Col>
        </Row>
      </Form>
      <Divider />

      <Form onFinish={handleUpdateProfile}>
        <Row gutter={16}>
          <Col span={8} className={classes.label}>
            Contact Number
          </Col>

          <Col span={12} className={classes.info}>
            {editContact ? (
              <Form.Item
                name="contactNumber"
                rules={[
                  {
                    required: true,
                    message: "Required",
                  },
                ]}
              >
                <Input
                  placeholder="Enter contact number"
                  value={user.contactNumber}
                  onChange={(event) => {
                    const { value } = event.target;
                    setUser({ ...user, contactNumber: value });
                  }}
                />
              </Form.Item>
            ) : (
              <>{user.contactNumber}</>
            )}
          </Col>

          <Col span={4} className={classes.editBtn}>
            {editContact ? (
              <>
                <Button
                  type="primary"
                  className={classes.updateBtn}
                  htmlType="submit"
                >
                  Update
                </Button>
                <Button onClick={() => setEditContact(false)}>Cancel</Button>
              </>
            ) : (
              <EditOutlined
                onClick={() => {
                  setEditName(false);
                  setEditContact(true);
                  setEditAddress(false);
                }}
              />
            )}
          </Col>
        </Row>
      </Form>
      <Divider />
    </>
  );
};

export { ProfileContent };
