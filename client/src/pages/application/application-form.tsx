import { useState } from 'react';
import { Form, Input, Select, Button, Row, Space, Radio, Modal, notification, Flex } from 'antd';
import { MailOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Application, ApplicationFormData } from '../../models/application';
import { motion } from 'framer-motion';
import { createApplication, updateApplicationById } from '../../services/application-service';
import { addApplication, updateApplication } from '../../redux/application-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { useTranslation } from 'react-i18next';

// You can adjust this to use your local imports as needed for animation and other components

const ApplicationForm = ({ applicationData, isOpened, onClose, mode }: ApplicationFormData ) => {
    const [form] = Form.useForm();
    const [collaborators, setCollaborators] = useState(mode === 'Edit' ? applicationData?.type === 'private' : false);
    const dispatch = useDispatch<AppDispatch>();

    const { t } = useTranslation();

    // Initial values for the form
    const initialValues = {
        name: applicationData?.name || '',
        description: applicationData?.description || '',
        icon_url: applicationData?.icon_url || '',
        api_key: applicationData?.api_key || '',
        environment: applicationData?.environment || 'staging',
        api_endpoint_url: applicationData?.api_endpoint_url || '',
        type: applicationData?.type || 'public',
        collaborators: applicationData?.collaborations || [
            { email: '', role: ['view'], is_invite_accepted: false },
        ],
    };

    const handleChange = (changedValues: object) => {
        if ('type' in changedValues) {
            setCollaborators(!collaborators);
        }
    };

    const handleSubmit = async (values: Application) => {
        try {
            if(mode === 'Add') {
                const response = await createApplication(values);
                dispatch(addApplication(response));
            } 
            else if(mode === 'Edit') {
                const response = await updateApplicationById(applicationData?._id, values);
                dispatch(updateApplication(response));
            }

            handleSnackbar('Application Saved Successfully!');
        } catch (error: unknown) {
            // Show error message if sign-up fails
            if (error instanceof Error) {
                // If error is an instance of Error, display its message
                handleSnackbar(error.message);
            } else {
                // For unknown errors
                handleSnackbar('An unknown error occurred. Please try again later.');
            }
        }

        onClose();
    };

    const handleSnackbar = (message: string) => {
        notification.info({
            message: message,
            duration: 3,
        });
    };

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
        visible={isOpened}
        title={`${mode} ${t('application_modes.application')}`}
        onCancel={handleClose}
        footer={null}
        centered
        width={700}
        destroyOnClose
        style={{ padding: '24px', top: 20 }}
        >
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Form
            form={form}
            initialValues={initialValues}
            layout="vertical"
            onFinish={handleSubmit}
            size='middle'
            onValuesChange={handleChange}
            >
            {/* Name Field */}
            <Form.Item
                label={t('add_application_component.name')}
                name="name"
                rules={[{ required: true, message: t('add_application_component.name_required') }]}
            >
                <Input placeholder={t('add_application_component.name_placeholder')} />
            </Form.Item>

            {/* Icon URL Field */}
            <Form.Item
                label={t('add_application_component.icon_url')}
                name="icon_url"
                rules={[{ type: 'url', message: t('add_application_component.icon_url_valid') }]}
            >
                <Input placeholder={t('add_application_component.icon_url_placeholder')} />
            </Form.Item>

            {/* Description Field */}
            <Form.Item label={t('add_application_component.description')} name="description">
                <Input.TextArea placeholder={t('add_application_component.description_placeholder')} rows={4} />
            </Form.Item>

            {/* API Key Field */}
            <Form.Item
                label={t('add_application_component.api_key')}
                name="api_key"
                rules={[{ required: true, message: t('add_application_component.api_key_required') }]}
            >
                <Input placeholder={t('add_application_component.api_key_placeholder')} />
            </Form.Item>

            {/* Endpoint URL Field */}
            <Form.Item
                label={t('add_application_component.api_endpoint_url')}
                name="api_endpoint_url"
                rules={[{ required: true, type: 'url', message: t('add_application_component.api_endpoint_url_valid') }]}
            >
                <Input placeholder={t('add_application_component.api_endpoint_url_placeholder')} />
            </Form.Item>

            {/* Environment Field */}
            <Form.Item
                label={t('add_application_component.environment')}
                name="environment"
                rules={[{ required: true, message: t('add_application_component.environment_required') }]}
            >
                <Select placeholder={t('add_application_component.environment_placeholder')}>
                <Select.Option value="staging">{t('add_application_component.staging')}</Select.Option>
                <Select.Option value="production">{t('add_application_component.production')}</Select.Option>
                <Select.Option value="development">{t('add_application_component.environment')}</Select.Option>
                </Select>
            </Form.Item>

            {/* Type Field (Private / Public) */}
            <Form.Item label={t('add_application_component.application_type')} name="type">
                <Radio.Group>
                <Radio value="public">{t('add_application_component.application_type_public')}</Radio>
                <Radio value="private">{t('add_application_component.application_type_private')}</Radio>
                </Radio.Group>
            </Form.Item>

            {/* Collaborators Section */}
            {collaborators && (
                <Form.Item
                label={t('add_application_component.collaborators')}
                tooltip={{
                    title: t('add_application_component.collaborators_tooltip'),
                    icon: <InfoCircleOutlined />,
                }}
                >
                <Form.List
                    name="collaborations"
                    initialValue={initialValues.collaborators}
                    rules={[
                    {
                        validator: async(_, collaborators) => {
                            if (!collaborators || collaborators.length < 1) {
                                return Promise.reject(new Error(t('add_application_component.collaborator_required')));
                            }
                            else if(collaborators.length > 5) {
                                return Promise.reject(new Error(t('add_application_component.collaborators_allowed')));
                            }
                        },
                    },
                    ]}
                >
                    {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name }) => (
                            <Flex key={key} align='start' justify='space-around'>
                                <Form.Item
                                    name={[name, 'email']}
                                    label={t('add_application_component.collaborator_email')}
                                    style={{ width: '40%' }}
                                    rules={[
                                        { required: true, message: t('add_application_component.collaborator_email_required') },
                                        { type: 'email', message: t('add_application_component.collaborator_email_valid') },
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined />}
                                        placeholder={t('add_application_component.collaborator_email_placeholder')}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name={[name, 'role']}
                                    label={t('add_application_component.permission')}
                                    style={{ width: '40%' }}
                                    rules={[{ required: true, message: t('add_application_component.permission_required') }]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder={t('add_application_component.permission_placeholder')}
                                        style={{ fontSize: '16px', height: '50px' }}
                                        options={[
                                            { value: 'view', label: t('add_application_component.view_permission') },
                                            { value: 'add', label: t('add_application_component.add_permission') },
                                            { value: 'edit', label: t('add_application_component.edit_permission') },
                                            { value: 'delete', label: t('add_application_component.delete_permission') },
                                        ]}
                                        value={form.getFieldValue(['collaborators', name, 'role']) || []}
                                    />
                                </Form.Item>

                                <Button onClick={() => remove(name)} icon={<DeleteOutlined />} danger style={{ marginTop: '35px' }} />
                            </Flex>
                        ))}
                        <Button type="dashed" onClick={() => add()} block>
                        {t('add_application_component.add_collaborator_button')}
                        </Button>
                    </>
                    )}
                </Form.List>
                </Form.Item>
            )}

            {/* Submit Button */}
            <Row justify="end">
                <Space>
                <Button onClick={handleClose}>{t('add_application_component.add_application_cancel')}</Button>
                <Button type="primary" htmlType="submit">
                    {mode} {t('application_modes.application')}
                </Button>
                </Space>
            </Row>
            </Form>
        </motion.div>
        </Modal>
    );
};
export default ApplicationForm;
