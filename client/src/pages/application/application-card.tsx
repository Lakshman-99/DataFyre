import { useState, MouseEvent } from 'react';
import { Avatar, Button, Card, Flex, notification, Progress, Tag, Tooltip, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, AppstoreAddOutlined, ApiOutlined, UserSwitchOutlined, ClockCircleOutlined } from '@ant-design/icons';
import CommonDialog from '../../components/common-dialog';
import ApplicationForm from './application-form';
import { Application } from '../../models/application';
import Title from 'antd/lib/typography/Title';
import { deleteApplicationById } from '../../services/application-service';
import { deleteApplication } from '../../redux/application-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const getColorFromHash = (str: string) => {
    // A simple hashing function to get consistent colors
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 100%, 70%)`;
    return color;
};

const getProgressColor = (percentage: number) => {
    if (percentage >= 90) {
        return '#ff4d4f';
    } else if (percentage >= 70) {
        return '#faad14';
    } else {
        return '#52c41a';
    }
};

const ApplicationCard = ({ appData }: { appData: Application }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleDelete = async () => {
        // Add your delete logic here
        try {
            // Call the sign-up service function
            deleteApplicationById(appData._id).then(() => {
                dispatch(deleteApplication(appData._id))
                handleSnackbar(t('application_card_component.application_deleted'));
            });
        } catch (error: unknown) {
            // Show error message if sign-up fails
            if (error instanceof Error) {
                // If error is an instance of Error, display its message
                handleSnackbar(error.message);
            } else {
                // For unknown errors
                handleSnackbar(t('application_card_component.unknown_error'));
            }
        }
        setOpenDialog(false);
    };

    const handleSnackbar = (message: string) => {
        notification.info({
            message: message,
            duration: 3,
        });
    };

    const handleDialog = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setOpenDialog(!openDialog);
    };

    const toggleApplicationForm = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setShowApplicationForm(!showApplicationForm);
    };

    const avatarColor = getColorFromHash(appData.name);
    const avatarLetter = appData.name.charAt(0).toUpperCase();
    const apiUsagePercentage = (appData.entity_count / 10) * 100;
    const progressColor = getProgressColor(apiUsagePercentage);
    const typeColor = appData.type === 'public' ? 'cyan' : 'gold';
    const envColor = appData.environment === 'production' ? 'red' : appData.environment === 'staging' ? 'orange' : 'green';
    const countAcceptedInvites = appData.collaborations.reduce((count, collaboration) => {
        return collaboration.is_invite_accepted ? count + 1 : count;
    }, 0);

    return (
        <>
            <ApplicationForm applicationData={appData} isOpened={showApplicationForm} onClose={() => setShowApplicationForm(false)} mode={t('application_modes.edit_mode')} />
            <CommonDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onConfirm={handleDelete}
                question= {t('application_card_component.question')}
                info={t('application_card_component.info')}
                button1={t('application_card_component.cancel')}
                button2={t('application_card_component.delete')}
            />
            <Card
                hoverable
                style={{
                    marginBottom: 16,
                    border: 'none', 
                    transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onClick={() => navigate(`/applications/${appData._id}`)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <Card.Meta
                    avatar={
                        appData.icon_url !== '' ? (
                            <Avatar size="large" src={appData.icon_url} />
                        ) : (
                            <Avatar size="large" style={{ backgroundColor: avatarColor, color: '#000' }} aria-label="name-avatar">
                                <b>{avatarLetter}</b>
                            </Avatar>
                        )
                    }
                    title={<>
                        <Flex justify='space-between' align='start'>
                            <Title level={4}>{appData.name}</Title>
                            <div>
                                {appData.role?.includes('edit') && (
                                    <Tooltip title={t('application_card_component.edit_application_tooltip')}>
                                        <Button
                                            icon={<EditOutlined />}
                                            onClick={toggleApplicationForm}
                                            shape="circle"
                                            style={{ marginRight: 8 }}
                                        />
                                    </Tooltip>
                                )}
                                {appData.role?.includes('delete') && (
                                    <Tooltip title={t('application_card_component.delete_application_tooltip')}>
                                        <Button
                                            icon={<DeleteOutlined />}
                                            onClick={handleDialog}
                                            shape="circle"
                                            danger
                                            style={{ marginRight: 8 }}
                                        />
                                    </Tooltip>
                                )}
                            </div>
                        </Flex>
                        </>}
                    description={<>
                    <span style={{ color: 'rgba(0, 0, 0, 0.45)', top: -10 }}>
                        <Flex gap="4px 0" wrap>
                            <Tag color={typeColor}>{appData.type}</Tag>
                            <Tag color={envColor}>{appData.environment}</Tag>
                        </Flex>
                        </span>
                    </>}
                />
                <div style={{ marginTop: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ marginRight: 8 }}>{Math.round(apiUsagePercentage)}%</span>
                        <Progress
                            percent={apiUsagePercentage}
                            showInfo={false}
                            strokeWidth={12}
                            strokeColor={progressColor}
                            style={{ flexGrow: 1 }}
                        />
                    </div>
                    <Text type="secondary"><ApiOutlined /> {t('application_card_component.apis_created')} </Text> 
                    <Text><CountUp end={appData.entity_count} separator="," /> / 10</Text> 
                    <br />
                    <Text type="secondary"><UserSwitchOutlined /> {t('application_card_component.collaborators')} </Text>
                    <Text><CountUp end={countAcceptedInvites} separator="," /></Text> 
                </div>
                <Flex style={{ marginTop: 16 }} justify="space-between">
                    <div>
                        <Text><AppstoreAddOutlined /> {t('application_card_component.created_by')} {appData.created_by}</Text>
                    </div>
                    <div>
                        <Text><ClockCircleOutlined /> {t('application_card_component.updated')} {new Date(appData.last_updated_at).toLocaleDateString()} </Text>
                    </div>
                </Flex>
            </Card>
        </>
    );
};
export default ApplicationCard;
