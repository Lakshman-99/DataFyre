import { Modal, Button, Typography, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { CommonDialogProps } from '../models/dialog';
import { useState } from 'react';

const { Text } = Typography;

const CommonDialog = ({ open, onClose, onConfirm, question, info, button1, button2 }: CommonDialogProps) => {
    const [loadings, setLoadings] = useState(false);

    const action = () => {
        setLoadings(true);
        onConfirm();
    };

    return (
        <Modal
            visible={open}
            onCancel={onClose}
            footer={null}
            title={
                <Space>
                    <ExclamationCircleOutlined style={{ color: 'red' }} />
                    <Text strong>{question}</Text>
                </Space>
            }
            centered
            style={{
                borderRadius: '16px',
                boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Text>{info}</Text>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onClose} style={{ marginRight: '8px' }}>
                    {button1}
                </Button>
                <Button onClick={action} type="primary" danger loading={loadings} >
                    {button2}
                </Button>
            </div>
        </Modal>
    );
};

export default CommonDialog;
