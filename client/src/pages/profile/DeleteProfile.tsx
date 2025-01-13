import { useState } from 'react';
import { Button, Modal, Spin, Typography, notification, Card, Row, Col, Divider } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
// import { useDispatch, useSelector } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { deleteUserProfile, selectUserLoading, selectUserError } from '../../redux/userSlice';
import { selectUserLoading } from '../../redux/userSlice';
import { useTranslation } from 'react-i18next';
import './DeleteProfile.css';

const { Title, Text } = Typography;
const { confirm } = Modal;

const DeleteProfile = () => {
    const { t } = useTranslation();
    // const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectUserLoading);
    // const error = useSelector(selectUserError);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = () => {
        confirm({
            title: t('delete_profile.confirm_title'),
            icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
            content: (
                <>
                    <Text type="danger" style={{ display: 'block', marginBottom: '10px' }}>
                        {t('delete_profile.confirm_message')}
                    </Text>
                    <Text style={{ color: '#8c8c8c' }}>
                        {t('delete_profile.warning_details')}
                    </Text>
                </>
            ),
            okText: t('delete_profile.confirm_button'),
            okButtonProps: {
                danger: true,
                loading: isLoading,
            },
            cancelText: t('delete_profile.cancel_button'),
            onOk: async () => {
                setIsLoading(true);
                // try {
                //     const result = dispatch(deleteUserProfile());
                //     if (result.meta.requestStatus === 'fulfilled') {
                //         notification.success({
                //             message: t('delete_profile.success_message'),
                //             description: t('delete_profile.success_description'),
                //             placement: 'topRight',
                //         });
                //         navigate('/');
                //     } else {
                //         notification.error({
                //             message: t('delete_profile.error_message'),
                //             description: error,
                //             placement: 'topRight',
                //         });
                //     }
                // } catch (e) {
                //     notification.error({
                //         message: t('delete_profile.error_message'),
                //         description: t('delete_profile.error_details'),
                //         placement: 'topRight',
                //     });
                // } finally {
                //     setIsLoading(false);
                // }
            },
            onCancel: () => {
                notification.info({
                    message: t('delete_profile.cancelled_message'),
                    description: t('delete_profile.cancelled_description'),
                    placement: 'topRight',
                });
            },
        });
    };

    const handleCancel = () => {
        navigate(-1); // Navigate to the previous page in the history stack
    };

    return (
        <div className="delete-profile-container">
            {isLoading && (
                <div className="loading-overlay">
                    <Spin size="large" tip={t('delete_profile.loading')} />
                </div>
            )}
            <Card
                title={
                    <Title level={2}>
                        <span style={{ color: '#ff4d4f' }}>{t('delete_profile.title')}</span>
                    </Title>
                }
                bordered={false}
                style={{
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    padding: '20px',
                }}
            >
                <div className="warning-message">
                    <ExclamationCircleOutlined className="warning-icon" />
                    <Text className="warning-text">{t('delete_profile.warning_message')}</Text>
                </div>
                <Divider />
                <Row justify="center">
                    <Col>
                        <Button
                            type="primary"
                            danger
                            size="large"
                            onClick={handleDelete}
                            loading={loading}
                            style={{ width: '100%', marginBottom: '10px' }}
                        >
                            {t('delete_profile.delete_button')}
                        </Button>
                        <Button
                            type="default"
                            size="large"
                            onClick={handleCancel}
                            className="cancel-button"
                            style={{ width: '100%' }}
                        >
                            {t('delete_profile.cancel_button')}
                        </Button>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default DeleteProfile;
