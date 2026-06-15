  import { EyeOutlined } from '@ant-design/icons';
  
  export const columns = [
        { title: 'Валюта', dataIndex: 'currency', key: 'currency' },
        { title: 'Курс', dataIndex: 'rate', key: 'rate' },
        { title: 'Действие', key: 'action', render: () => <a><EyeOutlined /></a> }
    ];