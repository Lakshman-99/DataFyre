"use client";

import { Form, Input, Button, Typography, Layout, Space, notification } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { AppState } from "../../redux/store"; // Adjust the import path based on your project structure
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../services/authentication-service";
import { SignUpData } from "../../models/authentication";

const { Title, Text } = Typography;
const { Content } = Layout;

function SignUpPage() {
        // Get current language from Redux state
    const language = useSelector((state: AppState) => state.language.language);
    
    // Use translation hook
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const onFinish = async (values: SignUpData) => {
        try {
            // Call the sign-up service function
            const response = await signUp(values);

            notification.success({
                message: t("signup_page.sign_up_success"),
                description: response.message,
            });

            navigate('/login');  

        } catch (error: unknown) {
            // Show error message if sign-up fails
            if (error instanceof Error) {
                // If error is an instance of Error, display its message
                notification.error({
                    message: t("signup_page.sign_up_failed"),
                    description: error.message,
                    duration: 3,  // Duration of the error message (optional)
                });
            } else {
                // For unknown errors
                notification.error({
                    message: t("signup_page.sign_up_failed"),
                    description: t("signup_page.redirected"),
                    duration: 3,
                });
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: "spring", stiffness: 100, damping: 10 },
        },
    };

    // Sync the language from Redux with i18next
    useEffect(() => {
        // Change language only if it's different from the current language
        if (i18n.language !== language) {
            i18n.changeLanguage(language);
        }
    }, [language, i18n]); // Also listen to location changes to trigger the effect on route change

    return (
        <Layout style={{ minHeight: "100vh", background: "rgb(240, 250, 250)" }}>
            <Content
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    style={{
                        width: "100%",
                        maxWidth: 400,
                        padding: "2rem",
                        background: "white",
                        borderRadius: "15px",
                        boxShadow: "0 5px 10px rgba(0,0,0,0.05)",
                    }}
                >
                    <Space
                        direction="vertical"
                        size="large"
                        style={{ width: "100%", textAlign: "center" }}
                    >
                        <motion.div variants={itemVariants}>
                            <Title
                                level={2}
                                style={{
                                    marginBottom: 0,
                                    background:
                                        "linear-gradient(45deg, #1890ff, #722ed1)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                {t("signup_page.create_account")}
                            </Title>
                        </motion.div>
                        <Form
                            name="signup"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            style={{ width: "100%" }}
                        >
                            <motion.div variants={itemVariants}>
                                <Form.Item
                                    name="first_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("signup_page.first_name_required"),
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={
                                            <UserOutlined
                                                style={{ color: "#1890ff" }}
                                            />
                                        }
                                        placeholder={t("signup_page.first_name")}
                                        size="large"
                                        style={{
                                            borderRadius: "50px",
                                            padding: "10px 20px",
                                        }}
                                    />
                                </Form.Item>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Form.Item
                                    name="last_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("signup_page.last_name_required"),
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={
                                            <UserOutlined
                                                style={{ color: "#1890ff" }}
                                            />
                                        }
                                        placeholder={t("signup_page.last_name")}
                                        size="large"
                                        style={{
                                            borderRadius: "50px",
                                            padding: "10px 20px",
                                        }}
                                    />
                                </Form.Item>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Form.Item
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("login_page.email_required"),
                                        },
                                        {
                                            type: "email",
                                            message: t("login_page.email_invalid"),
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={
                                            <MailOutlined
                                                style={{ color: "#1890ff" }}
                                            />
                                        }
                                        placeholder={t("login_page.email")}
                                        size="large"
                                        style={{
                                            borderRadius: "50px",
                                            padding: "10px 20px",
                                        }}
                                    />
                                </Form.Item>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Form.Item
                                    name="hashed_password"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("login_page.password_required"),
                                        },
                                        {
                                            min: 8,
                                            message: t("login_page.password_min_length"),
                                        }
                                    ]}
                                >
                                    <Input.Password
                                        prefix={
                                            <LockOutlined
                                                style={{ color: "#1890ff" }}
                                            />
                                        }
                                        placeholder={t("login_page.password")}
                                        size="large"
                                        style={{
                                            borderRadius: "50px",
                                            padding: "10px 20px",
                                        }}
                                    />
                                </Form.Item>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Form.Item
                                    name="confirm_password"
                                    dependencies={["password"]}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("signup_page.confirm_password_required"),
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (
                                                    !value ||
                                                    getFieldValue(
                                                        "hashed_password"
                                                    ) === value
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    new Error(
                                                        t("signup_page.confirm_password_mismatch")
                                                    )
                                                );
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        prefix={
                                            <LockOutlined
                                                style={{ color: "#1890ff" }}
                                            />
                                        }
                                        placeholder={t("signup_page.confirm_password")}
                                        size="large"
                                        style={{
                                            borderRadius: "50px",
                                            padding: "10px 20px",
                                        }}
                                    />
                                </Form.Item>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{
                                            width: "100%",
                                            height: "50px",
                                            borderRadius: "50px",
                                            background:
                                                "linear-gradient(45deg, #1890ff, #722ed1)",
                                            border: "none",
                                        }}
                                        size="large"
                                    >
                                        {t("signup_page.signup_btn")}
                                    </Button>
                                </Form.Item>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Form.Item>
                                    <Text>
                                        {t("signup_page.have_account")}{" "}
                                        <Link
                                            to="/login"
                                            style={{ color: "#1890ff" }}
                                        >
                                            {t("signup_page.sign_in")}
                                        </Link>
                                    </Text>
                                </Form.Item>
                            </motion.div>
                        </Form>
                    </Space>
                </motion.div>
            </Content>
        </Layout>
    );
}

export default SignUpPage;