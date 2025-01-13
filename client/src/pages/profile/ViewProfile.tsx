import { Avatar, Descriptions, List, Spin, Typography, Card, Row, Col, Tag, Empty } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectUserProfile, selectUserLoading, selectUserError } from '../../redux/userSlice';
import './ViewProfile.css';

const { Title, Text } = Typography;

const ViewProfile = () => {
    const { t } = useTranslation();
    const userProfile = useSelector(selectUserProfile);
    const loading = useSelector(selectUserLoading);
    const error = useSelector(selectUserError);

    if (loading) {
        return (
            <div className="spinner-container">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                <Empty description={`${t('view_profile.error')}: ${error}`} />
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="no-data">
                <Empty description={t('view_profile.no_data')} />
            </div>
        );
    }

    return (
        <div className="view-profile-content">
            {/* Hero Section */}
            <div className="hero-section">
                {userProfile.coverPictureUrl ? (
                    <img
                        src={`/src${userProfile.coverPictureUrl}`}
                        alt={t('view_profile.cover_image_alt')}
                        className="cover-image"
                    />
                ) : (
                    <div className="default-cover">
                        <UserOutlined style={{ fontSize: '48px', color: '#8c8c8c' }} />
                    </div>
                )}
                <div className="avatar-container">

                    <Avatar
                        src={userProfile.profilePictureUrl ? `/src${userProfile.profilePictureUrl}` : null}
                        size={150}
                        icon={!userProfile.profilePictureUrl && <UserOutlined />}
                        className="profile-avatar"
                    />

                    <Title level={2} className="user-name">
                        {`${userProfile.first_name} ${userProfile.last_name}`}
                    </Title>
                    <Tag color="blue" className="user-role">
                        {t(`view_profile.roles.${userProfile.role}`)}
                    </Tag>
                </div>
            </div>

            {/* Information Sections */}
            <Row gutter={[16, 16]} justify="center">
                {/* User Info */}
                <Col xs={24} md={16}>
                    <Card title={t('view_profile.user_info')} bordered={false}>
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label={t('view_profile.email')}>
                                {userProfile.email}
                            </Descriptions.Item>
                            <Descriptions.Item label={t('view_profile.contact_info')}>
                                {userProfile.contactInfo || t('view_profile.not_available')}
                            </Descriptions.Item>
                            <Descriptions.Item label={t('view_profile.about')}>
                                {userProfile.about || t('view_profile.not_available')}
                            </Descriptions.Item>
                            <Descriptions.Item label={t('view_profile.organization_hierarchy')}>
                                {userProfile.organizationHierarchy || t('view_profile.not_available')}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* Additional Info */}
                <Col xs={24} md={8}>
                    <Card title={t('view_profile.additional_info')} bordered={false}>
                        <Text strong>{t('view_profile.joined')}:</Text>{' '}
                        <Text>{userProfile.joinedDate || t('view_profile.not_available')}</Text>
                        <br />
                        <Text strong>{t('view_profile.status')}:</Text>{' '}
                        <Tag color={userProfile.is_active ? 'green' : 'red'}>
                            {t(`view_profile.statuses.${userProfile.is_active ? 'active' : 'inactive'}`)}
                        </Tag>
                    </Card>
                </Col>
            </Row>

            {/* Subordinates Section */}
            <Card
                title={t('view_profile.subordinates')}
                bordered={false}
                className="subordinates-card"
                style={{ marginTop: '20px' }}
            >
                {userProfile.subordinates && userProfile.subordinates.length > 0 ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={userProfile.subordinates}
                        renderItem={(sub) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            src={sub.profilePictureUrl}
                                            icon={!sub.profilePictureUrl && <UserOutlined />}
                                        />
                                    }
                                    title={`${sub.first_name} ${sub.last_name}`}
                                    description={`${t('view_profile.role')}: ${t(
                                        `view_profile.roles.${sub.role}`
                                    )}`}
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty description={t('view_profile.no_subordinates')} />
                )}
            </Card>
        </div>
    );
};

export default ViewProfile;
