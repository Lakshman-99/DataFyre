import { Row, Col, Card, Input, Button, Form, FormInstance, message, Divider, Space } from "antd";
import { CopyOutlined, EditOutlined, PlusOutlined, QuestionCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import React from "react";
import { FakerField } from "./input-items";
import HelpCard from "./helpcard";
import { parseAndGenerateMockData } from "../../services/mock-api-generator";
import { generateForm } from "./generate-form-fields";
import { useTranslation } from "react-i18next";

interface ApiDesignInputProps {
    form: FormInstance;
    jsonInput: string;
    rawJsonInput: string;
    setJsonInput: React.Dispatch<React.SetStateAction<string>>;
    isParsed: boolean;
    setIsParsed: React.Dispatch<React.SetStateAction<boolean>>;
    liveSample: string;
    setLiveSample: React.Dispatch<React.SetStateAction<string>>;
    generatedForm: React.ReactNode;
    setGeneratedForm: React.Dispatch<React.SetStateAction<React.ReactNode>>;
    isModalVisible: boolean;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

function ApiDesignInput({ 
    form, 
    jsonInput, 
    rawJsonInput, 
    setJsonInput, 
    isParsed, 
    setIsParsed, 
    liveSample, 
    setLiveSample, 
    generatedForm, 
    setGeneratedForm, 
    isModalVisible, 
    setIsModalVisible, 
} : ApiDesignInputProps) {

    const { t } = useTranslation();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleCopy = () => {
        // Copy the content of the TextArea to the clipboard
        navigator.clipboard.writeText(liveSample).then(() => {
            // Show the success message using Ant Design's message component
            message.success('Copied to clipboard');
        }).catch(() => {
            message.error('Failed to copy');
        });
    };

    const onFormChange = () => {
        const formValues = form.getFieldsValue();
        const mockData = parseAndGenerateMockData(formValues);
        setLiveSample(JSON.stringify(mockData, null, 2));
    }

    const parseJson = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            setJsonInput(JSON.stringify(parsed, null, 2));
            const formFields = generateForm(parsed);
            setGeneratedForm(formFields);
            setIsParsed(true);
            message.success("Form configuration loaded successfully!");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            message.error("Invalid JSON format. Please check your input.");
        }
    };

    const clearJson = () => {
        setJsonInput("");
        setGeneratedForm(null);
        setIsParsed(false);
        generateForm({});
        setLiveSample("");
        message.info("Form configuration cleared.");
    };

    return (
        <Row gutter={[16, 16]} style={{ height: "100vh" }}>
            {/* Left Column */}
            <HelpCard isModalVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} />
            <Col
                span={12}
                style={{
                    height: "100%",
                    overflowY: "auto",
                    paddingRight: "8px", // Prevent gutter overlap
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card title={t('API_design_input.api_input_data')} bordered={false}>
                            <Input.TextArea
                                rows={10}
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder={t('API_design_input.api_input_data_placeholder')}
                                style={{ marginBottom: "10px" }}
                                disabled={isParsed}
                            />
                            <Button
                                icon={isParsed ? <ReloadOutlined /> : <PlusOutlined />}
                                onClick={parseJson}
                                style={{ marginRight: "10px" }}
                            >
                                {isParsed ? "Reload Form" : t('API_design_input.parse_json')}
                            </Button>
                            <Button
                                icon={<EditOutlined />}
                                onClick={clearJson}
                                style={{ marginRight: "10px" }}
                                disabled={!isParsed}
                            >
                                {t('API_design_input.clear_json')}
                            </Button>

                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card 
                        title={
                            <Space>
                                {t('API_design_input.dynamic_form')}
                                <QuestionCircleOutlined onClick={showModal} style={{ cursor: "pointer" }} />
                            </Space>
                        } 
                        bordered={false} 
                        style={{ marginBottom: "16px" }}>
                            <Form form={form} layout="horizontal" onChange={onFormChange} initialValues={JSON.parse(rawJsonInput || "{}")}>
                                {/* Dynamically generated form fields */}
                                <FakerField />
                                <Divider />
                                {generatedForm}
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Col>

            {/* Right Column */}
            <Col
                span={12}
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Card
                    title={t('API_design_input.live_mock_sample')}
                    bordered={false}
                    style={{ flex: 1, overflow: "hidden" }}
                    extra={
                        <Button 
                            onClick={handleCopy}
                            icon={<CopyOutlined />}
                        >
                            {t('API_design_input.copy')}
                        </Button>
                    }
                >
                    <Input.TextArea
                        rows={26}
                        value={liveSample}
                        placeholder={t('faker.fake_api_data_placeholder')}
                        style={{ marginBottom: "10px" }}
                        readOnly
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default ApiDesignInput;
