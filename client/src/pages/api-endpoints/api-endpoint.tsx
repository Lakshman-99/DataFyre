import { Card, Table, Tag, Button, Typography, Space, Flex, Tooltip, notification, Divider, Result, Popconfirm, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { Application } from "../../models/application";
import ApplicationForm from "../application/application-form";
import { useEffect, useState } from "react";
import CommonDialog from "../../components/common-dialog";
import { deleteApplicationById } from "../../services/application-service";
import { decrementEntityCount, deleteApplication, findApplication } from "../../redux/application-slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { APIEndpoints, TriggerPopulation } from "../../models/api-endpoint";
import { deleteApiEndpointById, getAPIEndpoints, triggerPopulation } from "../../services/api-endpoint-service";
import { addApiEndpoints, deleteApiEndpoint, selectApiEndpointsByApplicationId } from "../../redux/api-endpoint-slice";
import { useTranslation } from "react-i18next";
import TriggerPopulationModal from "../../components/api-endpoints/trigger-population";

const { Title, Paragraph } = Typography;

const animationVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
};

function ApiEndpoint() {
    const [appData, setAppData] = useState<Application>();
    const [curAppId, setCurAppId] = useState<string | undefined>(undefined);
    const [curApiId, setCurApiId] = useState<string | undefined>(undefined);
    const [openDialog, setOpenDialog] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { id } = useParams();
    const { t } = useTranslation();
    const data = useSelector(findApplication(id));
    const dataSource = useSelector(selectApiEndpointsByApplicationId(id));

    const toggleApplicationForm = () => {
        setShowApplicationForm(!showApplicationForm);
    };

    const handleDelete = async () => {
        try {
            // Call the sign-up service function
            if (id) {
                deleteApplicationById(id).then(() => {
                    dispatch(deleteApplication(id))
                    handleSnackbar(t('application_card_component.application_deleted'));
                    navigate('/applications');
                });
            }
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

    const handleApiEndpointDelete = async (apiEndpointId: string) => {
        try {
            // Call the sign-up service function
            if (apiEndpointId) {
                deleteApiEndpointById(apiEndpointId).then(() => {
                    dispatch(deleteApiEndpoint(apiEndpointId))
                    handleSnackbar(t('add_application_component.api_endpoint_deleted'));
                    if(id) {
                        dispatch(decrementEntityCount(id));
                    }
                });
            }
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
    };

    const handleEdit = (applicationId: string, endpointId: string) => {
        navigate(`/applications/${applicationId}/edit/${endpointId}`);
    };
    
    const handleSnackbar = (message: string) => {
        notification.info({
            message: message,
            duration: 3,
        });
    };

    // Define columns
    const columns: ColumnsType<APIEndpoints> = [
        {
            title: t('add_application_component.name'),
            dataIndex: "name",
            key: "name",
            render: (name: string, record: APIEndpoints) => (
                <Tooltip title={record.description}>
                    <Typography.Text strong>{name}</Typography.Text>
                </Tooltip>
            ),
        },
        {
            title: t('add_application_component.route'),
            dataIndex: "route",
            key: "route",
            render: (route: string) => <Typography.Text>{route}</Typography.Text>,
        },
        {
            title: t('add_application_component.method'),
            dataIndex: "method",
            key: "method",
            render: (method: string) => {
                const color = method === "POST" ? "green" : method === "PUT" ? "blue" : "red";
                return (
                    <Tag color={color}>
                        <Typography.Text>{method}</Typography.Text>
                    </Tag>
                );
            },
        },
        {
            title: t('add_application_component.auth_type'),
            dataIndex: "auth_type",
            key: "auth_type",
            render: (authType: string) => <Typography.Text>{authType}</Typography.Text>,
        },
        {
            title: t('add_application_component.created_by'),
            dataIndex: "created_by",
            key: "created_by",
            render: (createdBy: string) => <Typography.Text>{createdBy}</Typography.Text>,
        },
        {
            title: t('add_application_component.updated_on'),
            dataIndex: "updated_at",
            key: "updated_at",
            render: (updatedAt: Date) => (
                <Typography.Text>{new Date(updatedAt).toLocaleString()}</Typography.Text>
            ),
        },
        {
            title: t('add_application_component.actions'),
            key: "actions",
            render: (record: APIEndpoints) => (
                <Space size="middle">
                    {appData && appData.role?.includes('edit') && (
                    <Tooltip title={t('add_application_component.edit')}>
                        <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record.application_id, record._id || "")}/>
                    </Tooltip>
                    )}
                    {appData && appData.role?.includes('delete') && (
                    <Popconfirm
                        title={t('add_application_component.delete_tooltip')}
                        onConfirm={() => handleApiEndpointDelete(record._id || "")}
                        okText={t('add_application_component.yes')}
                        cancelText={t('add_application_component.no')}
                    >
                    <Tooltip title={t('add_application_component.delete')}>
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Tooltip>
                    </Popconfirm>
                    )}
                    <Tooltip title={t('add_application_component.trigger_population')}>
                        <Button type="text" icon={<PlayCircleOutlined />} onClick={() => handleOpenModal(record.application_id, record._id || "")} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const handleOpenModal = (applicationId: string, endpointId: string) => {
        setIsModalVisible(true);
        setCurAppId(applicationId);
        setCurApiId(endpointId);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setCurAppId(undefined);
        setCurApiId(undefined);
    };

    const handlePopulate = (values: TriggerPopulation) => {
        if(curAppId && curApiId) {
            const data = {
                api_endpoint_id: curApiId,
                records_to_process: values.records_to_process,
                language: values.language,
                is_xss_mode: values.is_xss_mode
            }

            try {
                triggerPopulation(curApiId, data).then(() => {
                    message.success("We'll notify you via email once population is over!");
                });
            } catch (error: unknown) {
                if (error instanceof Error) {
                    handleSnackbar(error.message);
                } else {
                    handleSnackbar(t('application_card_component.unknown_error'));
                }
            }
        }

        handleCloseModal();
    };

    useEffect(() => {
        if(id && data) {
            setAppData(data);
            getAPIEndpoints(id).then(ApiEndpoints => {
                dispatch(addApiEndpoints(ApiEndpoints));
            })
        }
    }, [id, data, dispatch]);

    return (
        <>
            <ApplicationForm applicationData={appData} isOpened={showApplicationForm} onClose={toggleApplicationForm} mode={t('application_modes.edit_mode')} />
            <CommonDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onConfirm={handleDelete}
                question="Are you sure you want to delete this entity?"
                info="This action cannot be undone. This will permanently delete the entity and all its associated data."
                button1="Cancel"
                button2="Delete"
            />
            <TriggerPopulationModal
                visible={isModalVisible}
                onCancel={handleCloseModal}
                onPopulate={handlePopulate}
            />
            {appData ? (
                <>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={animationVariants}
                    transition={{ duration: 0.5 }}
                >
                    <Flex justify="space-between" align="center" style={{ paddingLeft: "26px", paddingRight: "26px" }}>
                        <div>
                            <Title level={2}>{appData.name}</Title>
                            <Paragraph>{appData.description}</Paragraph>
                        </div>
                        <div>
                            {appData.role?.includes('edit') && (
                                <Tooltip title={t("application_card_component.edit_application_tooltip")}>
                                    <Button
                                        icon={<EditOutlined />}
                                        onClick={toggleApplicationForm}
                                        style={{ marginRight: 8 }}
                                    />
                                </Tooltip>
                            )}
                            {appData.role?.includes('delete') && (
                                <Tooltip title={t("application_card_component.delete_application_tooltip")}>
                                    <Button
                                        icon={<DeleteOutlined />}
                                        onClick={() => setOpenDialog(true)}
                                        type="primary"
                                        danger
                                        style={{ marginRight: 8, border: "none" }}
                                    />
                                </Tooltip>
                            )}
                        </div>

                    </Flex>
                </motion.div>
                <Divider />
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={animationVariants}
                    transition={{ duration: 0.5 }}
                >
                    <Card>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <Title level={3}>APIs</Title>
                                <Paragraph type="secondary">
                                    {t("application_column.manage_apis")} {appData.name}
                                </Paragraph>
                            </div>
                            {appData.role?.includes('add') && (
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/applications/${id}/add`)}>
                                    {t("application_column.create_api")}
                                </Button>
                            )}
                        </div>
                        <Table
                            dataSource={dataSource}
                            columns={columns}
                            pagination={false}
                            rowKey={(record) => record._id || ""}
                            style={{ marginTop: 20 }}
                        />
                    </Card>
                </motion.div>
                </>
            ) : (
                <>
                    <Flex justify="center" align="center" style={{ width: "100%" }}>
                        <Result
                            status="404"
                            title="Application not Found!"
                            extra={<Button type="primary" onClick={() => navigate("/applications")}>
                                Go Back
                            </Button>}
                        />
                    </Flex>
                </>
            )}
        </>
    );
};

export default ApiEndpoint;
