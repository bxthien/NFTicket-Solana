/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable multiline-comment-style */
import { DeleteOutlined, InfoCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Form, Image, Input, Modal, notification, Tooltip, Upload } from 'antd';
import dayjs from 'dayjs';
import { child, getDatabase, ref, set } from 'firebase/database';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import type { PropsWithChildren } from 'react';
import { useMemo, useState } from 'react';
import ReactS3Client from 'react-aws-s3-typescript';
import { v4 as uuidv4 } from 'uuid';
import { s3Config } from '../../../../configs/aws';
import uploadIcon from '../../../../assets/images/upload.png';

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface Files {
  avatar?: string;
  docs?: { doc1?: string; doc2?: string; doc3?: string };
}

export enum UploadType {
  Avatar = 'avatar',
  Doc1 = 'doc1',
  Doc2 = 'doc2',
  Doc3 = 'doc3',
}

function isImage(url: string) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

export default function RegisterModal({ isOpen, onOpen, onClose }: Props) {
  const [files, setFiles] = useState<Files>({});
  const [uploadType, setUploadType] = useState<string>('');
  const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { publicKey } = useWallet();
  const dbRef = ref(getDatabase());
  const address = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!files.avatar) {
      notification.open({
        description: 'Please upload avatar !',
        message: 'Error',
        type: 'error',
      });

      return;
    }

    form.validateFields();
    const fields = form.getFieldsValue() ?? {};

    if (!Object.values(fields).length) return;
    if (!fields.businessName) return;

    setIsSubmitting(true);
    const id = uuidv4();

    set(child(dbRef, `Register-Certificate/${id}`), {
      createTime: dayjs().unix(),
      description: fields.description,
      docs: files.docs ?? [],
      id,
      image: files.avatar,
      status: 'pending',
      symbol: fields.symbol,
      title: fields.businessName,
      wallet: address,
    }).then(() => {
      notification.open({
        description: 'Successfully !',
        message: 'Notification',
        type: 'success',
      });
      setIsSubmitting(false);
    });

    setIsSubmitting(false);
  };

  function UploadView({ text, customRequest }: { text: string; customRequest: (options: UploadRequestOption) => void }) {
    return (
      <div className='flex h-[281px] w-[281px] flex-col items-center justify-center border-2 border-dashed'>
        <Image height={88} preview={false} src={uploadIcon} width={110} />
        <div className='text-lg text-white'>Upload {text}</div>
        <div className='mt-6 flex items-center gap-3'>
          <Upload customRequest={customRequest} name='avatar' showUploadList={false}>
            <Button className='w-32 rounded-sm' loading={uploadType === text && isLoadingUpload} size='middle' type='primary'>
              Upload
            </Button>
          </Upload>
          <Tooltip placement='top' title={text}>
            <InfoCircleOutlined className='text-[22px] text-white' style={{ color: 'white' }} />
          </Tooltip>
        </div>
      </div>
    );
  }

  const handleUploadAvatar = async ({ file }: UploadRequestOption, type: UploadType) => {
    if (file) {
      const s3 = new ReactS3Client(s3Config);

      const formData = new FormData();
      formData.append('photo', file);
      setIsLoadingUpload(true);
      setUploadType(type);
      const res = await s3.uploadFile(file as File);
      if (type === UploadType.Avatar) {
        setFiles((prev) => ({ ...prev, avatar: res.location }));
      } else {
        setFiles((prev) => ({
          ...prev,
          docs: { ...(prev.docs ?? {}), [type]: res.location },
        }));
      }

      setIsLoadingUpload(false);
    }
  };

  function FileContainer({ children, onRemove }: PropsWithChildren<{ onRemove: () => void }>) {
    return (
      <div className={`relative border-2 border-dashed`}>
        <div
          className={`absolute z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-red-500 bg-white`}
          onClick={onRemove}
          style={{ right: 10, top: 10 }}
        >
          <DeleteOutlined className='text-red-500' />
        </div>
        {children}
      </div>
    );
  }

  const docs = Object.values(UploadType).splice(1, Object.values(UploadType).length);
  return (
    <Modal footer={false} onCancel={onClose} onOk={onOpen} open={isOpen} title='Register Certificate Form' width={1100}>
      <div className='mt-3 flex justify-center gap-[100px]'>
        <div>
          {files.avatar ? (
            <FileContainer
              onRemove={() => {
                setFiles((prev) => ({ ...prev, avatar: '' }));
              }}
            >
              <Image className='h-[341px] w-[341px] object-cover' preview={false} src={files.avatar} />
            </FileContainer>
          ) : (
            <div className='flex h-[341px] w-[341px] flex-col items-center justify-center border-2 border-dashed'>
              <Image height={88} preview={false} src={uploadIcon} width={110} />
              <div className='text-lg text-white'>Drag and drop logo to upload</div>
              <div className='mt-3 mb-4 text-white '> OR </div>
              <Upload customRequest={(event) => handleUploadAvatar(event, UploadType.Avatar)} name='avatar' showUploadList={false}>
                <Button
                  className='w-32 rounded-sm'
                  loading={uploadType === UploadType.Avatar && isLoadingUpload}
                  size='middle'
                  type='primary'
                >
                  Upload
                </Button>
              </Upload>
            </div>
          )}
        </div>
        <div>
          <Form
            autoComplete='off'
            form={form}
            initialValues={{ remember: true }}
            labelCol={{ span: 12 }}
            layout='vertical'
            name='basic'
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              label='Business Name :'
              name='businessName'
              rules={[
                {
                  message: 'Please input your Business Name!',
                  required: true,
                },
              ]}
            >
              <Input className='mt-4 w-[336px] rounded-sm' size='middle' />
            </Form.Item>

            <Form.Item
              label='Symbol:'
              name='symbol'
              rules={[
                {
                  message: 'Please input your Symbol!',
                  required: true,
                },
              ]}
            >
              <Input className='w-[336px] rounded-sm' size='middle' />
            </Form.Item>

            <Form.Item
              label='Description:'
              name='description'
              rules={[
                {
                  message: 'Please input your Description!',
                  required: true,
                },
              ]}
            >
              <Input.TextArea className='w-[500px] rounded-sm' size='middle' />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className='mt-[50px] flex flex-wrap justify-center gap-[50px]'>
        {docs.map((item) => (
          <div key={item}>
            {/*  @ts-ignore --> */}
            {files.docs?.[item] ? (
              <FileContainer
                onRemove={() => {
                  setFiles((prev) => ({
                    ...prev,
                    docs: { ...(prev.docs ?? {}), [item]: '' },
                  }));
                }}
              >
                {/*  @ts-ignore --> */}
                {isImage(files.docs[item] ?? '') ? (
                  <Image
                    className='h-[281px] w-[281px] object-cover'
                    preview={false}
                    /*  @ts-ignore --> */
                    src={files.docs[item]}
                  />
                ) : (
                  <div className='flex h-[281px] w-[281px] items-center justify-center'>
                    <FileTextOutlined className='text-3xl text-white' style={{ color: 'white' }} />
                  </div>
                )}
              </FileContainer>
            ) : (
              <UploadView customRequest={(event) => handleUploadAvatar(event, item)} text={String(item)} />
            )}
          </div>
        ))}
      </div>

      <div className='mt-[30px] flex w-full justify-center'>
        <Button className='w-[460px]' htmlType='submit' loading={isSubmitting} onClick={handleSubmit} type='primary'>
          Submit
        </Button>
      </div>
    </Modal>
  );
}
