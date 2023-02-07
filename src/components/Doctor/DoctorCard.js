import React from 'react';
// import { Descriptions, Card, DatePicker, TimePicker, Col, Row, Divider } from 'antd';

function DoctorCard({ doctor }) {
  const gridStyle = {
    textAlign: 'left',
    cursor: 'pointer',
  };
  return (
    <>
      <i className="ri-profile-fill"></i> {`${doctor.name} `}
      <br />
      <br />
      {/* <Card
        title={`${doctor.firstName} ${doctor.lastName}`}
        size="small"
        className="card cursor-pointer mb-2"
        onClick={() => selectDoc(`${doctor.firstName} ${doctor.lastName}`, doctor._id)}
      >
        <Descriptions.Item label="Config Info">
          <b>Phone Number:</b>
          <small>{doctor.phoneNumber}</small>
          <br />
          <b>Address:</b>
          <small>{doctor.address}</small>
          <br />
          <b>Fee per Visit:</b>
          <small>{doctor.feePerCunsultation}</small>
          <br />
          <b>Availability:</b>
          <small>
            {doctor.availability[0]} - {doctor.availability[1]}
          </small>
        </Descriptions.Item>
      </Card> */}
    </>
  );
}

export default DoctorCard;
