import { Form, Input, Select, Typography, Row, Col, Card, FormInstance } from "antd";
import { motion } from "framer-motion";
import { APIEndpoints } from "../../models/api-endpoint";
import { useTranslation } from "react-i18next";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 100, damping: 10 },
    },
};

function ApiDetailsForm({ form, initialValues, isEditMode }: { form: FormInstance; initialValues: APIEndpoints; isEditMode: boolean }) {
    const { t } = useTranslation();
    return (
        <Row
            gutter={[16, 16]}
            justify="center"
            style={{ alignItems: "center" }}
        >
            <Col xs={24} sm={20} md={16} lg={12}>
                <Card bordered={false}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={itemVariants}
                        style={{
                            maxWidth: 600,
                            margin: "0 auto",
                            padding: "20px",
                        }}
                    >
                        <Title
                            level={2}
                            style={{
                                marginBottom: 20,
                                background:
                                    "linear-gradient(45deg, #1890ff, #722ed1)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                textAlign: "center",
                            }}
                        >
                            {isEditMode ? t('api_details_form_component.edit_api_endpoint') : t('api_details_form_component.create_api_endpoint')}
                        </Title>

                        <Form
                            form={form}
                            name="createAPIEndpoint"
                            initialValues={initialValues}
                            onFinish={() => {}}
                            layout="vertical"
                            style={{ width: "100%" }}
                        >
                            {/* Name Field */}
                            <motion.div variants={itemVariants}>
                                <Form.Item
                                    name="name"
                                    label={t('api_details_form_component.name')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('api_details_form_component.name_required'),
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={t('api_details_form_component.name_placeholder')}
                                        size="large"
                                        style={{
                                            borderRadius: "8px",
                                        }}
                                    />
                                </Form.Item>
                            </motion.div>

                            {/* Route Field */}
                            <motion.div variants={itemVariants}>
                                <Form.Item
                                    name="route"
                                    label={t('api_details_form_component.route')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('api_details_form_component.route_required'),
                                        },
                                        {
                                            pattern: /^\/.*/,
                                            message:
                                            t('api_details_form_component.route_valid'),
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={t('api_details_form_component.route_placeholder')}
                                        size="large"
                                        style={{
                                            borderRadius: "8px",
                                        }}
                                    />
                                </Form.Item>
                            </motion.div>

                            {/* Method Field */}
                            <motion.div variants={itemVariants}>
                                <Form.Item
                                    name="method"
                                    label={t('api_details_form_component.method')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('api_details_form_component.method_required'),
                                        },
                                    ]}
                                >
                                    <Select
                                        size="large"
                                        style={{ borderRadius: "8px" }}
                                    >
                                        <Option value="POST">{t('api_details_form_component.method_post')}</Option>
                                        <Option value="PUT">{t('api_details_form_component.method_put')}</Option>
                                        <Option value="DELETE">{t('api_details_form_component.method_delete')}</Option>
                                    </Select>
                                </Form.Item>
                            </motion.div>

                            {/* Headers Field */}
                            <motion.div variants={itemVariants}>
                                <Form.Item
                                    name="headers"
                                    label={t('api_details_form_component.headers')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('api_details_form_component.headers_required'),
                                        },
                                        {
                                            validator: (_, value) => {
                                                if (!value)
                                                    return Promise.resolve();
                                                try {
                                                    JSON.parse(value);
                                                    return Promise.resolve();
                                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                } catch (e) {
                                                    return Promise.reject(
                                                        t('api_details_form_component.headers_valid')
                                                    );
                                                }
                                            },
                                        },
                                    ]}
                                >
                                    <TextArea
                                        placeholder={t('api_details_form_component.headers_placeholder')}
                                        rows={4}
                                        style={{
                                            borderRadius: "8px",
                                        }}
                                    />
                                </Form.Item>
                            </motion.div>

                            {/* Description Field */}
                            <motion.div variants={itemVariants}>
                                <Form.Item
                                    name="description"
                                    label={t('api_details_form_component.description')}
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                if (
                                                    !value ||
                                                    value.split(/\s+/).length <=
                                                        250
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    t('api_details_form_component.description_word_limit')
                                                );
                                            },
                                        },
                                    ]}
                                >
                                    <TextArea
                                        placeholder={t('api_details_form_component.description_placeholder')}
                                        rows={4}
                                        style={{
                                            borderRadius: "8px",
                                        }}
                                    />
                                </Form.Item>
                            </motion.div>

                            {/* Auth Type Field */}
                            <motion.div variants={itemVariants}>
                                <Form.Item
                                    name="auth_type"
                                    label={t('api_details_form_component.authentication_type')}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                            t('api_details_form_component.authentication_type_required'),
                                        },
                                    ]}
                                >
                                    <Select
                                        size="large"
                                        style={{ borderRadius: "8px" }}
                                    >
                                        <Option value="Bearer">{t('api_details_form_component.auth_bearer')}</Option>
                                        <Option value="APIKey">{t('api_details_form_component.auth_api_key')}</Option>
                                        <Option value="None">{t('api_details_form_component.auth_none')}</Option>
                                    </Select>
                                </Form.Item>
                            </motion.div>
                        </Form>
                    </motion.div>
                </Card>
            </Col>
        </Row>
    );
}

export default ApiDetailsForm;
