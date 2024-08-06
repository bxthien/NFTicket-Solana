import { Button, Result, Typography } from 'antd';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Result
      extra={
        <Link to="/">
          <Button type="primary">Back Home</Button>
        </Link>
      }
      status="404"
      subTitle={'Empty'}
      title={<Typography.Title level={1}>404</Typography.Title>}
    />
  );
}
