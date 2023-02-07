import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Card, Descriptions, Row, Col, Tag, Modal, Divider } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import { ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
const { confirm } = Modal;

function AppointmentDetail({ appointment, getData, showDrawer }) {
  const [badgeColor, setBadgeColor] = useState('orange');
  const editAction = (status) => {
    if (status == 'pending') {
      return <EditOutlined key="edit" onClick={() => showDrawer(appointment)} />;
    }
    return;
  };

  const deleteAction = (status) => {
    if (status == 'pending') {
      return (
        <DeleteOutlined
          twoToneColor="#eb2f96"
          key="setting"
          onClick={() => deleteAppointment(appointment._id)}
        />
      );
    }
    return;
  };

  const deleteAppointment = (appointmentId) => {
    confirm({
      title: 'Do you want to delete this appointment?',
      icon: <ExclamationCircleFilled />,
      okText: 'Delete',
      okType: 'danger',
      onOk() {
        // return new Promise((resolve, reject) => {
        //   onDelete(appointmentId);
        // }).catch(() => console.log('Oops errors!'));
        return new Promise((resolve, reject) => {
          return axios
            .delete(`/api/appointment/delete-appointment/${appointmentId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            })
            .then((response) => {
              setTimeout(Math.random() > 0.5 ? resolve : reject, 500);
              if (response.data.success) {
                getData();
                toast.success(response.data.message);
              }
            });
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  };
  useEffect(() => {
    if (appointment.status == 'approved') {
      setBadgeColor('cyan');
    }
    if (appointment.status == 'rejected') {
      setBadgeColor('red');
    }
    if (appointment.status == 'pending') {
      setBadgeColor('orange');
    }
  }, [appointment.status]);
  return (
    <>
      <Badge.Ribbon text={appointment.status} color={badgeColor}>
        <Card
          size="small"
          className="card cursor-pointer mb-3"
          actions={[deleteAction(appointment.status), editAction(appointment.status)]}
        >
          <Badge count={' ' + appointment.patient || ''} status="warning" />
          <br />
          <Badge count={'Doc: ' + appointment.doctorInfo.name} status="default" />
          <br />
          <small>Comments :</small>
          <br />
          <Card>
            <small>{appointment.comments} </small>
          </Card>

          <Row justify="end" className="mt-2">
            <Col>
              <Tag color="red">
                <i className="ri-calendar-check-fill"></i>
                {moment(appointment.date).format('MM-DD-YYYY') + ' '}
              </Tag>
            </Col>
            <Col>
              <Tag color="red">
                <i className="ri-time-fill"></i>
                {moment(appointment?.timeFrom, 'HH:mm').format('HH:mm') +
                  ' - ' +
                  moment(appointment?.timeTo, 'HH:mm').format('HH:mm')}
              </Tag>
            </Col>
          </Row>
        </Card>
      </Badge.Ribbon>
    </>
  );
}

export default AppointmentDetail;
