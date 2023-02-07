import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Col, Row, Button } from 'antd';
import AppointmentDetail from '../components/Appointment/AppointmentDetail';
import SearchAppointment from '../components/Appointment/SearchAppointment';
import Paginate from '../components/Paginate';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import { FileAddOutlined } from '@ant-design/icons';
import AppointmentForm from 'components/Appointment/AppointmentForm';

function Home() {
  const [appointments, setAppointments] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const showDrawer = (data) => {
    setOpen(true);
    setAppointment(data);
  };
  const onClose = () => {
    setOpen(false);
  };
  console.log('token', localStorage.getItem('token'));

  const getData = async (filter = null) => {
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/appointment/get-all-appointments', filter, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <Layout>
      <Button type="primary" onClick={() => showDrawer(null)} icon={<FileAddOutlined />}>
        Create Appointment
      </Button>
      <br />
      <AppointmentForm getData={getData} onClose={onClose} open={open} appointment={appointment} />
      <br />
      <SearchAppointment getData={getData} />
      <br />
      <Row gutter={20}>
        {appointments.map((appointment) => (
          <Col span={6} xs={24} sm={24} lg={6}>
            <AppointmentDetail
              appointment={appointment}
              getData={getData}
              showDrawer={showDrawer}
            />
          </Col>
        ))}
      </Row>
      {/* <Paginate /> */}
    </Layout>
  );
}

export default Home;
