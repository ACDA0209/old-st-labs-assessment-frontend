import React, { useState } from 'react';
import '../layout.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from 'antd';
import { hideLoading, showLoading } from 'redux/alertsSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [widthh, setwidthh] = useState(200);
  const [sideWidth, setSideWidth] = useState(300);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const doctorMenu = [
    {
      name: 'Appointments',
      path: '/doctor/appointments',
      icon: 'ri-file-list-line',
    },
  ];

  const schedulerMenu = [
    {
      name: 'Appointment',
      path: '/',
      icon: 'ri-file-list-line',
    },
    {
      name: 'Doctors',
      path: '/scheduler/doctorslist',
      icon: 'ri-user-star-line',
    },
  ];

  const toggleSwitch = async (e) => {
    const newStatus = e ? 'active' : 'inactive';
    try {
      dispatch(showLoading());
      const resposne = await axios.post(
        '/api/user/change-doctor-account-status',
        { doctorId: user._id, userId: user._id, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (resposne.data.success) {
        toast.success('Successfully updated your status!');
      }
    } catch (error) {
      toast.error('Error changing your account status');
      dispatch(hideLoading());
    }
  };

  const userType = user?.type;
  const userStatus = user?.status;
  const menuToBeRendered = userType == 'scheduler' ? schedulerMenu : doctorMenu;
  const renderSwitchActive = (
    <Switch
      checkedChildren="Active"
      unCheckedChildren="Not Active"
      defaultChecked
      onChange={(e) => toggleSwitch(e)}
    />
  );

  const renderSwitchNotActive = (
    <Switch
      checkedChildren="Active"
      unCheckedChildren="Not Active"
      onChange={(e) => toggleSwitch(e)}
    />
  );
  // const role = user?.isAdmin ? 'Admin' : user?.isDoctor ? 'Doctor' : 'User';
  return (
    <div className="main">
      <div className="d-flex layout">
        <div className="sidebar" style={{ width: sideWidth }}>
          <div className="sidebar-header">
            <h1 className="logo">
              <img
                width={widthh}
                src="https://uploads-ssl.webflow.com/6284d0479ed3b7a70d15aad6/62861431472cc9bc1995979a_Old.St%20Labs%20logo.svg"
              />
            </h1>
            <h1 className="role" style={{ width: widthh }}>
              Type: {userType}
            </h1>
            {userType == 'doctor'
              ? userStatus == 'active'
                ? renderSwitchActive
                : renderSwitchNotActive
              : ''}
          </div>

          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div className={`d-flex menu-item ${isActive && 'active-menu-item'}`}>
                  <i className={menu.icon}></i>
                  {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}
            <div
              className={`d-flex menu-item `}
              onClick={() => {
                localStorage.clear();
                navigate('/login');
              }}
            >
              <i className="ri-logout-circle-line"></i>
              {!collapsed && <Link to="/login">Logout</Link>}
            </div>
          </div>
        </div>

        <div className="content">
          <div className="header">
            {collapsed ? (
              <i
                className="ri-menu-2-fill header-action-icon"
                onClick={() => {
                  setCollapsed(false);
                  setwidthh(200);
                  setSideWidth(300);
                }}
              ></i>
            ) : (
              <i
                className="ri-close-fill header-action-icon"
                onClick={() => {
                  setCollapsed(true);
                  setwidthh(100);
                  setSideWidth(130);
                }}
              ></i>
            )}

            <div className="d-flex align-items-center px-4">
              <b> {user?.name.charAt(0).toUpperCase() + user?.name.slice(1)} </b>
            </div>
          </div>

          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
