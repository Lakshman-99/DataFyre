import { Modal, Typography, List, Button } from "antd";
import { useTranslation } from "react-i18next";

export const HelpCard = ({isModalVisible, handleOk, handleCancel}: {isModalVisible: boolean, handleOk: () => void, handleCancel: () => void}) => {    

    const { t } = useTranslation();

    const patternInfo = [
        { pattern: "#", description: t('helper_component.hash') },
        { pattern: "?", description: t('helper_component.question_mark') },
        { pattern: "*", description: t('helper_component.asterisk') },
        { pattern: "|", description: t('helper_component.pipe') },
    ];

    const examples = [
        { example: "###", result: "123" },
        { example: "??", result: "AB" },
        { example: "***", result: "7A9" },
        { example: '"Product Number: ????-########"', result: '"Product Number: EwLn-66048764"' },
        { example: "cat|dog|parrot|fish", result: "dog" },
    ];

    return (
        <>
            <Modal
                title={t('helper_component.helper_title')}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        {t('helper_component.ok_button')}
                    </Button>,
                ]}
                width={900}
                style={{ marginTop: "-50px" }}
            >
                <Typography.Title level={4}>{t('helper_component.supported_patterns')}</Typography.Title>
                <List
                    bordered
                    dataSource={patternInfo}
                    renderItem={(item) => (
                        <List.Item>
                            <code>{item.pattern}</code>: {item.description}
                        </List.Item>
                    )}
                />

                <Typography.Title level={4} style={{ marginTop: "16px" }}>
                    {t('helper_component.example_usage')}
                </Typography.Title>
                <List
                    bordered
                    dataSource={examples}
                    renderItem={(item) => (
                        <List.Item>
                            <code>{item.example}</code> → <code>{item.result}</code>
                        </List.Item>
                    )}
                />

                <Typography.Title level={4} style={{ marginTop: "16px" }}>
                    {t('helper_component.faker_module_reference')}
                </Typography.Title>
                <Typography.Text>
                    {t('helper_component.faker_module_reference_para')}
                </Typography.Text>
            </Modal>
        </>
    );
};

export default HelpCard;
