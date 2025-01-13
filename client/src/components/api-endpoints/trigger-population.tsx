import { Modal, Form, Select, Button, InputNumber } from "antd";
import { motion } from "framer-motion";
import { TriggerPopulation } from "../../models/api-endpoint";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const languages = [
    "en", 
    "fr",
    "de",
    "es",
    "zh",
    "ja",
    "it",
    "ru",
];

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 100, damping: 10 },
    },
};

interface TriggerPopulationModalProps {
    visible: boolean;
    onCancel: () => void;
    onPopulate: (values: TriggerPopulation) => void;
}

function TriggerPopulationModal ({visible, onCancel, onPopulate}: TriggerPopulationModalProps) {
    const { t } = useTranslation();

    const [form] = Form.useForm();

    const handlePopulate = () => {
        form.validateFields().then((values) => {
            onPopulate(values); // Pass values to the parent
            form.resetFields();
        });
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="Trigger Population"
            open={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    {t('trigger_population_component.cancel')}
                </Button>,
                <Button key="populate" type="primary" onClick={handlePopulate}>
                    {t('trigger_population_component.populate')}
                </Button>,
            ]}
        >
            <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={itemVariants}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="trigger_population_form"
                >
                    {/* Count Field */}
                    <Form.Item
                        label={t('trigger_population_component.count')}
                        name="records_to_process"
                        rules={[
                            { required: true, message: t('trigger_population_component.count_required') },
                        ]}
                    >
                        <InputNumber
                            placeholder={t('trigger_population_component.count_placeholder')}
                            min={1} 
                            max={1000} 
                            style={{ width: "100%" }} 
                        />
                    </Form.Item>

                    {/* Language Field */}
                    <Form.Item
                        label={t('trigger_population_component.language')}
                        name="language"
                        rules={[{ required: true, message: t('trigger_population_component.language_required') }]}
                    >
                        <Select placeholder={t('trigger_population_component.language_placeholder')}>
                            {languages.map((lang) => (
                                <Option key={lang} value={lang}>
                                    {lang.toUpperCase()}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    
                </Form>
            </motion.div>
        </Modal>
    );
};

export default TriggerPopulationModal;
