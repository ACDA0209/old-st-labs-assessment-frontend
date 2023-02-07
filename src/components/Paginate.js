import React from 'react';
import { Pagination } from 'antd';

function Paginate() {
    return <Pagination defaultCurrent={1} total={50} />;
}

export default Paginate;
