import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Badge, Button, Table } from 'antd';
import moment from 'moment';

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const resposne = await axios.post(
        '/api/user/get-all-doctors',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (resposne.data.success) {
        setDoctors(resposne.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const resposne = await axios.post(
        '/api/user/change-doctor-account-status',
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (resposne.data.success) {
        toast.success(resposne.data.message);
        getDoctorsData();
      }
    } catch (error) {
      toast.error('Error changing doctor account status');
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => <span>{record.name}</span>,
    },

    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (record, text) => moment(record.createdAt).format('DD-MM-YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => (
        <Badge status={record.status == 'active' ? 'success' : 'error'} count={record.status} />
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex">
          {record.status === 'inactive' && (
            <Button type="default" block onClick={() => changeDoctorStatus(record, 'active')}>
              Activate
            </Button>
          )}
          {record.status === 'active' && (
            <Button danger ghost block onClick={() => changeDoctorStatus(record, 'inactive')}>
              Deactivate
            </Button>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h2 className="page-header textColor">Doctors List</h2>
      <hr />
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  );
}

export default DoctorsList;
