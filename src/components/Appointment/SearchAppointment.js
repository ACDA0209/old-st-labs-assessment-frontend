import React, { useEffect, useState } from 'react';
import { Col, Select, Row, DatePicker, Space, Input, Button } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
const { Option } = Select;

function SearchAppointment({ getData }) {
  const [filter, setFilter] = useState({});
  const [ascending, setAscending] = useState(true);

  const filterAppointment = (name, value) => {
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleChange = (e) => {
    const { value } = e.target;
    filterAppointment('patient', value);
  };

  const changeOrder = () => {
    setAscending(!ascending);
    filterAppointment('sort', { date: ascending ? 'ascending' : 'descending' });
  };

  useEffect(() => {
    getData(filter);
  }, [filter]);

  return (
    <>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <label>
            Filter by Date:
            <Space direction="horizontal" size={12}>
              <Button style={{ width: 80 }} onClick={changeOrder}>
                {ascending ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
              </Button>
              <RangePicker format={'MM-DD-YYYY'} onChange={(e) => filterAppointment('date', e)} />
            </Space>
          </label>
        </Col>

        <Col className="gutter-row" span={6}>
          <label>
            Search:
            <Input placeholder="Patient name" onChange={handleChange} />
          </label>
        </Col>

        <Col span={6} offset={6}>
          <label>
            Status:
            <Select placeholder="filter by status" onChange={(e) => filterAppointment('status', e)}>
              <Option value="">All</Option>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </label>
        </Col>
      </Row>
    </>
  );
}

export default SearchAppointment;
