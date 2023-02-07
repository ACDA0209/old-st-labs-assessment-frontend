import React from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';

const { confirm } = Modal;

const deleteAppointment = () => {
  confirm({
    title: 'Do you want to delete this appointment?',
    icon: <ExclamationCircleFilled />,
    okText: 'Delete',
    okType: 'danger',
    onOk() {
      return new Promise((resolve, reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      }).catch(() => console.log('Oops errors!'));
    },
    onCancel() {},
  });
};

function DeleteModal() {
  return (
    <Space wrap>
      <Button danger onClick={deleteAppointment}>
        Delete
      </Button>
    </Space>
  );
}

export default DeleteModal;
