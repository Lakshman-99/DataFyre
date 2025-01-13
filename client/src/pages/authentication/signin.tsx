"use client";

import { Form, Input, Button, Checkbox, Typography, Layout, Space, notification } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { AppState } from "../../redux/store"; // Adjust the import path based on your project structure
import { Link, useNavigate } from "react-router-dom";
import { signIn } from '../../services/authentication-service';
import { SignInPayload } from '../../models/authentication';
import { setAccessToken, clearAccessToken } from "../../redux/auth-slice";

const { Title, Text } = Typography;
const { Content } = Layout;

function SignInPage() {
    // Get current language from Redux state
    const language = useSelector((state: AppState) => state.language.language);
    
    // Use translation hook
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFinish = async (values: SignInPayload) => {
        console.log("Success:", values);
        // Here you would typically handle the sign-in logic
        try {
            // Call the sign-in service
            const response = await signIn(values);
                        
            if (response.status === 200) {
                // Show success toast notification
                dispatch(clearAccessToken());
                dispatch(setAccessToken(response.data.token));

                notification.success({
                    message: t('signup_page.login_success'),
                    description: t('signup_page.redirected'),
                    duration: 2, 
                });

                setTimeout(() => {
                    navigate('/dashboard');  
                }, 2000);
            }
        } catch (error: unknown) {
            // Handle error (e.g., show error message to user)
            if (error instanceof Error) {
                // If error is an instance of Error, display its message

                if (error.message=="Server responded with status 403: Forbidden"){
                    error.message="Please Verify your Email";
                }
                notification.error({
                    message: t('signup_page.sign_in_failed'),
                    description: error.message,
                    duration: 3,  // Duration of the error message (optional)
                });
            } else {
                // For unknown errors
                notification.error({
                    message: t('signup_page.sign_in_failed'),
                    description: t('signup_page.unknown_error'),
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
                                {t("login_page.welcome")}
                            </Title>
                        </motion.div>
                        <Form
                            name="signin"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            style={{ width: "100%" }}
                        >
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
                                            message:  t("login_page.email_invalid"),
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
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("login_page.password_required"),
                                        },
                                        {
                                            min: 8,
                                            message: t("login_page.password_min_length"),
                                        },
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
                                <Form.Item>
                                    <Form.Item
                                        name="remember"
                                        valuePropName="checked"
                                        noStyle
                                    >
                                        <Checkbox>{t("login_page.remember_me")}</Checkbox>
                                    </Form.Item>
                                    <Link style={{ float: "right" }} to="#">
                                        {t("login_page.forgot_password")}
                                    </Link>
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
                                        {t("login_page.login_btn")}
                                    </Button>
                                </Form.Item>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Form.Item>
                                    <Text>
                                        {t("login_page.no_account")}{" "}
                                        <Link
                                            to="/signup"
                                            style={{ color: "#1890ff" }}
                                        >
                                            {t("login_page.sign_up")}
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

export default SignInPage;