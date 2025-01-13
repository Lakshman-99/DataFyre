import { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Upload,
    Select,
    message,
    Card,
    Divider,
    Avatar,
    Row,
    Col,
    Spin,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    selectUserProfile,
    selectUserLoading,
    selectUserUpdateSuccess,
    clearUpdateSuccess,
} from "../../redux/userSlice";
import "./EditProfile.css";

const { Dragger } = Upload;

const EditProfile = () => {
    const { t } = useTranslation(); // i18n hook
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize navigate hook
    const profile = useSelector(selectUserProfile);
    const isLoading = useSelector(selectUserLoading);
    const updateSuccess = useSelector(selectUserUpdateSuccess);

    const [form] = Form.useForm();
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        if (profile) {
            form.setFieldsValue(profile);
            setUserRole(profile.role);
        }
    }, [profile, form]);

    useEffect(() => {
        if (updateSuccess) {
            message.success(t("edit_profile.success_message"));
            dispatch(clearUpdateSuccess());
            navigate("/profile/view"); // Navigate to the view profile page
        }
    }, [updateSuccess, dispatch, navigate, t]); // Add navigate as a dependency



    const validateFileType = (file: File) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error(t("edit_profile.invalid_file_error"));
        }
        return isImage;
    };

    const onFinish = (values: any) => {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (key === "profilePictureUrl" || key === "coverPictureUrl") {
                if (values[key]?.file?.originFileObj) {
                    formData.append(key, values[key].file.originFileObj);
                }
            } else {
                formData.append(key, values[key]);
            }
        });

    };

    return (
        <Spin spinning={isLoading}>
            <Card
                title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: 16 }} />
                        <h2 style={{ margin: 0 }}>{t("edit_profile.title")}</h2>
                    </div>
                }
                style={{
                    maxWidth: 800,
                    margin: "20px auto",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="first_name"
                                label={t("edit_profile.first_name")}
                                rules={[{ required: true, message: t("edit_profile.first_name_required") }]}
                            >
                                <Input placeholder={t("edit_profile.first_name_placeholder")} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="last_name"
                                label={t("edit_profile.last_name")}
                                rules={[{ required: true, message: t("edit_profile.last_name_required") }]}
                            >
                                <Input placeholder={t("edit_profile.last_name_placeholder")} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="email"
                        label={t("edit_profile.email")}
                        rules={[{ type: "email", required: true, message: t("edit_profile.email_required") }]}
                    >
                        <Input placeholder={t("edit_profile.email_placeholder")} />
                    </Form.Item>
                    <Form.Item name="contactInfo" label={t("edit_profile.contact_info")}>
                        <Input placeholder={t("edit_profile.contact_info_placeholder")} />
                    </Form.Item>
                    <Form.Item name="about" label={t("edit_profile.about")}>
                        <Input.TextArea rows={4} placeholder={t("edit_profile.about_placeholder")} />
                    </Form.Item>

                    <Divider />

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="profilePictureUrl" label={t("edit_profile.profile_picture")}>
                                <Dragger
                                    name="profile"
                                    maxCount={1}
                                    beforeUpload={validateFileType}
                                    accept="image/*"
                                    multiple={false}
                                    style={{ padding: "20px" }}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <UploadOutlined />
                                    </p>
                                    <p className="ant-upload-text">{t("edit_profile.drag_profile_picture")}</p>
                                    <p className="ant-upload-hint">
                                        {t("edit_profile.drag_profile_hint")}
                                    </p>
                                </Dragger>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="coverPictureUrl" label={t("edit_profile.cover_picture")}>
                                <Dragger
                                    name="cover"
                                    maxCount={1}
                                    beforeUpload={validateFileType}
                                    accept="image/*"
                                    multiple={false}
                                    style={{ padding: "20px" }}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <UploadOutlined />
                                    </p>
                                    <p className="ant-upload-text">{t("edit_profile.drag_cover_picture")}</p>
                                    <p className="ant-upload-hint">
                                        {t("edit_profile.drag_cover_hint")}
                                    </p>
                                </Dragger>
                            </Form.Item>
                        </Col>
                    </Row>

                    {userRole === "manager" || userRole === "admin" ? (
                        <>
                            <Divider />
                            <Form.Item name="subordinates" label={t("edit_profile.subordinates")}>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    placeholder={t("edit_profile.select_subordinates_placeholder")}
                                    style={{ width: "100%" }}
                                >
                                </Select>
                            </Form.Item>
                        </>
                    ) : null}

                    <Divider />
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading} block>
                            {t("edit_profile.save_changes")}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Spin>
    );
};

export default EditProfile;
