import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Drawer, Form, Input, DatePicker, TimePicker, Divider, Card, Alert } from 'antd';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import DoctorCard from 'components/Doctor/DoctorCard';
import { hideLoading, showLoading } from 'redux/alertsSlice';
import moment from 'moment';

const { TextArea } = Input;
function AppointmentForm({ getData, onClose, open, appointment }) {
  const [doctors, setDoctors] = useState([]);
  const [dateAvailable, setDateAvailable] = useState(appointment ? true : false);
  const [dateVal, setDateVal] = useState();
  const dispatch = useDispatch();
  // const form = Form.useFormInstance();
  const [form] = Form.useForm();
  const gridStyle = {
    textAlign: 'left',
    cursor: 'pointer',
  };
  const getDoctors = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        '/api/user/get-all-doctors',
        {},
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const selectDoc = (val, id) => {
    form.setFieldsValue({ doctor: val, doctorId: id });
  };

  const checkBookingAvilability = async (date) => {
    try {
      const appointmentDate = moment(appointment?.date).format('YYYY-MM-DD');
      const formDate = moment(date).format('YYYY-MM-DD');
      console.log('appointmentDate', appointmentDate);
      console.log('formDate', formDate);
      if (appointmentDate == formDate) {
        setDateAvailable(true);
        return;
      }

      dispatch(showLoading());
      const resposne = await axios.post(
        '/api/appointment/check-booking-avilability',
        { date },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (resposne.data.appointmentCount < 5) {
        setDateAvailable(true);
      } else {
        setDateAvailable(false);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const newAppointment = async (payload, headers) => {
    try {
      return await axios.post('/api/appointment/book-appointment', payload, {
        headers: headers,
      });
    } catch (error) {
      return error;
    }
  };

  const updateAppointment = async (appointmentId, payload, headers) => {
    try {
      return await axios.patch(`/api/appointment/update-appointment/${appointmentId}`, payload, {
        headers: headers,
      });
    } catch (error) {
      return error;
    }
  };
  const onFinish = async (values) => {
    checkBookingAvilability(dateVal);
    const payload = {
      patient: values.patient,
      doctorId: values.doctorId,
      date: values.date,
      timeFrom: values.timeFrom.format('HH:mm'),
      timeTo: values.timeTo.format('HH:mm'),
      comments: values.comments,
    };
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    try {
      dispatch(showLoading());
      const response = appointment
        ? await updateAppointment(appointment._id, payload, headers)
        : await newAppointment(payload, headers);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        console.log('test');
        getData();
      }
    } catch (error) {
      toast.error('Error booking appointment');
      dispatch(hideLoading());
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    toast.error('Error booking appointment');
  };

  useEffect(() => {
    console.log(appointment);
    form.setFieldsValue({
      patient: appointment?.patient,
      date: appointment?.date ? moment(appointment.date) : '',
      timeFrom: appointment?.timeFrom ? moment(appointment?.timeFrom, 'HH:mm') : '',
      timeTo: appointment?.timeTo ? moment(appointment?.timeTo, 'HH:mm') : '',
      doctor: appointment?.doctorInfo?.name,
      doctorId: appointment?.doctorId,
      comments: appointment?.comments,
    });
    getDoctors();
  }, [appointment]);
  return (
    <>
      <Drawer
        title={(appointment ? 'Edit' : 'New') + ' Appointment'}
        size="large"
        placement="right"
        onClose={onClose}
        open={open}
      >
        {dateAvailable ? (
          ''
        ) : (
          <Alert message="Selected date is not available" type="warning" showIcon closable />
        )}
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Patient"
            name="patient"
            rules={[{ required: true, message: 'Please enter name of patience!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Date is required!' }]}
          >
            {/* <DatePicker format="YYYY-MM-DD" /> */}
            <DatePicker
              format="MM-DD-YYYY"
              disabledDate={(current) =>
                current.isBefore(moment().subtract(1, 'day')) || moment(current).day() === 0
              }
              onChange={(e) => {
                checkBookingAvilability(e);
                setDateVal(e);
              }}
            />
          </Form.Item>
          <Form.Item
            label="From time"
            name="timeFrom"
            rules={[{ required: true, message: 'Time is required!' }]}
          >
            <TimePicker
              format="HH:mm"
              className="mt-3"
              hideDisabledOptions={true}
              disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23]}
            />
          </Form.Item>

          <Form.Item
            label="To time"
            name="timeTo"
            rules={[{ required: true, message: 'Time is required!' }]}
          >
            <TimePicker
              format="HH:mm"
              className="mt-3"
              hideDisabledOptions={true}
              disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23]}
            />
          </Form.Item>

          <Divider />

          <Form.Item
            label="DoctorId"
            name="doctorId"
            hidden={true}
            rules={[{ required: true, message: 'Time is required!' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Doctor"
            name="doctor"
            rules={[{ required: true, message: 'Time is required!' }]}
          >
            <Input disabled />
          </Form.Item>

          <p>Doctor List</p>

          <Card>
            {doctors.map((doctor) => (
              <Card.Grid style={gridStyle} onClick={() => selectDoc(`${doctor.name}`, doctor._id)}>
                <DoctorCard doctor={doctor} />
              </Card.Grid>
            ))}
          </Card>
          {/* <Row gutter={16}>
            {doctors.map((doctor) => (
              <Col span={8}>
                <DoctorCard doctor={doctor} selectDoc={selectDoc} />
              </Col>
            ))}
          </Row> */}

          <Divider />
          <Form.Item label="comments" name="comments">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            {dateAvailable ? (
              <Button type="primary" htmlType="submit">
                {appointment ? 'Update Appointment' : 'Book Now'}
              </Button>
            ) : (
              <Button type="primary" danger disabled>
                {appointment ? 'Update Appointment' : 'Book Now'}
              </Button>
            )}
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
export default AppointmentForm;
