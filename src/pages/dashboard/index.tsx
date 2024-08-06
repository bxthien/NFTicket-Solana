import { FileTextOutlined } from '@ant-design/icons';
import { Avatar, Button, notification, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';
import { child, get, getDatabase, ref, update } from 'firebase/database';
import { useEffect, useState } from 'react';

interface UserDetail {
  createTime: number;
  description: string;
  docs?: {
    doc1?: string;
    doc2?: string;
    doc3?: string;
  };
  id: string;
  image: string;
  status: string;
  symbol: string;
  title: string;
  wallet: string;
}

export default function DashboardPage() {
  const [userList, setUserList] = useState<UserDetail[]>();
  const dbRef = ref(getDatabase());
  const [count, setCount] = useState(0);

  useEffect(() => {
    get(child(dbRef, 'Register-Certificate')).then(async (snapshot) => {
      const currenNfts: UserDetail[] = Object.values(snapshot.val());
      setUserList(currenNfts);
    });
  }, [dbRef, count]);

  const columns: ColumnsType<UserDetail> = [
    {
      dataIndex: 'title',
      render: (_, { title, image }) => (
        <div className='flex flex-row items-center justify-start space-x-3'>
          <Avatar src={image || 'https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg'} />
          <a className='flex items-center justify-center text-gray-200'>{title}</a>
        </div>
      ),
      title: <p className='m-0 flex items-center justify-center text-lg font-normal text-[#6C7293]'>Client Name</p>,
    },
    {
      dataIndex: 'symbol',
      render: (_, { symbol }) => <a className='flex items-center justify-center text-gray-200'>{symbol}</a>,
      title: <p className='m-0 flex items-center justify-center text-lg font-normal text-[#6C7293]'>Bussiness Name</p>,
    },
    {
      dataIndex: 'description',
      render: (_, { description }) => <a className='flex items-center justify-center text-gray-200'>{description}</a>,
      title: <p className='m-0 flex items-center justify-center text-lg font-normal text-[#6C7293]'>Description</p>,
    },
    {
      dataIndex: 'docs',
      render: (_, { docs }) => (
        <div className='flex items-center justify-center gap-3'>
          {docs?.doc1 && (
            <a className='text-gray-200' href={docs.doc1}>
              <FileTextOutlined className='text-2xl text-white' />
            </a>
          )}
          {docs?.doc2 && (
            <a className='text-gray-200' href={docs.doc2}>
              <FileTextOutlined className='text-2xl text-white' />
            </a>
          )}
          {docs?.doc3 && (
            <a className='text-gray-200' href={docs.doc3}>
              <FileTextOutlined className='text-2xl text-white' />
            </a>
          )}
        </div>
      ),
      title: <p className='m-0 flex items-center justify-center text-lg font-normal text-[#6C7293]'>Link Docs</p>,
    },
    {
      dataIndex: 'createTime',
      render: (_, { createTime }) => {
        const date = new Date(createTime);
        const dateFormat = `${date.toDateString()}`;
        return <a className='flex items-center justify-center text-gray-200'>{dateFormat}</a>;
      },
      title: <p className='m-0 flex items-center justify-center text-lg font-normal text-[#6C7293]'>Created Time</p>,
    },
    {
      dataIndex: 'status',
      render: (status, row) => {
        if (!status) return null;
        return (
          <div
            className={classNames({
              'border-green-500 text-green-500': status === 'approved',
              'border-red-500 text-red-500': status === 'rejected',
              'border-yellow-500 text-yellow-500': status === 'pending',
            })}
          >
            <Tag
              className={`flex items-center`}
              color={classNames({
                green: status === 'approved',
                red: status === 'rejected',
                yellow: status === 'pending',
              })}
            >
              <p
                className={classNames({
                  'm-0 text-gray-200': true,
                  'text-green-500': status === 'approved',
                  'text-red-500': status === 'rejected',
                  'text-yellow-500': status === 'pending',
                  'text-gray-700': status === 'minted',
                })}
                style={{ textTransform: 'uppercase' }}
              >
                {status}
              </p>
            </Tag>

            {(status === 'pending' || !status) && (
              <Button
                style={{ height: 22, marginTop: 10 }}
                className='ml-2 flex h-6 items-center text-base'
                onClick={() => {
                  const updates = {};
                  // @ts-ignore
                  updates[`Register-Certificate/${row.id}`] = { ...row, status: 'approved' };
                  update(dbRef, updates);
                  notification.open({
                    description: 'Successfully !',
                    message: 'Notification',
                    type: 'success',
                  });

                  setCount((prev) => prev + 1);
                }}
              >
                <div className='mt-[-4px] text-sm'>Approve</div>
              </Button>
            )}
          </div>
        );
      },
      title: <p className='m-0 flex items-center justify-center text-lg font-normal text-[#6C7293]'>Status</p>,
    },
  ];

  return (
    <div className='flex justify-center'>
      <div className='container flex w-full flex-col p-20'>
        <Table columns={columns} dataSource={userList as readonly UserDetail[] | undefined} pagination={false} />
      </div>
    </div>
  );
}
