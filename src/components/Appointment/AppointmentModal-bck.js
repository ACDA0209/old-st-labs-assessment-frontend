import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Button, Modal, Form, Input, DatePicker, TimePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { hideLoading, showLoading } from 'redux/alertsSlice';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

function AppointmentModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const bookNow = async () => {
    setIsAvailable(false);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        '/api/appointment/book-appointment',
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/appointments');
      }
    } catch (error) {
      toast.error('Error booking appointment');
      dispatch(hideLoading());
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <Row justify="end">
        <Col span={5}>
          <Button type="primary" onClick={showModal}>
            Create Appointment
          </Button>
        </Col>
      </Row>

      <Modal
        title="New Appointment"
        open={isModalOpen}
        onOk={bookNow}
        onCancel={handleCancel}
        okText="Book Now"
      >
        <Form.Item label="Patient: ">
          <Input />
        </Form.Item>
        <Form.Item label="Date">
          <DatePicker format="DD-MM-YYYY" />
        </Form.Item>
        <Form.Item label="Time">
          <TimePicker.RangePicker format="HH:mm" className="mt-3" />
        </Form.Item>
        <Form.Item label="Comments">
          <TextArea rows={4} />
        </Form.Item>
      </Modal>
    </>
  );
}

export default AppointmentModal;
