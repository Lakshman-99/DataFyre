import { useEffect, useState } from "react";
import { Form, Button, Steps, message, Row, Col, notification } from "antd";
import ApiDetailsForm from "../../components/api-endpoints/api-details-form";
import ApiDesignInput from "../../components/api-endpoints/api-design-input";
import { useNavigate, useParams } from "react-router-dom";
import { createApiEndpoint, getAPIEndpoints, updateApiEndpointById } from "../../services/api-endpoint-service";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { addApiEndpoint, addApiEndpoints, findApiEndpoint, updateApiEndpoint } from "../../redux/api-endpoint-slice";
import { APIEndpoints } from "../../models/api-endpoint";
import { cleanJson, parseAndGenerateMockData } from "../../services/mock-api-generator";
import { generateForm } from "../../components/api-endpoints/generate-form-fields";
import { incrementEntityCount } from "../../redux/application-slice";
import { useTranslation } from "react-i18next";

const { Step } = Steps;

const ApiEndpointForms = () => {
    const [apiData, setApiData] = useState<APIEndpoints>();
    const [action, setAction] = useState("add");
    const [currentStep, setCurrentStep] = useState(0);
    const [jsonInput, setJsonInput] = useState("");
    const [rawJsonInput, setRawJsonInput] = useState("");
    const [isParsed, setIsParsed] = useState(false);
    const [liveSample, setLiveSample] = useState("");
    const [form1Data, setForm1Data] = useState<APIEndpoints>();
    const [generatedForm, setGeneratedForm] = useState<React.ReactNode>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { applicationId, apiEndpointId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const data = useSelector(findApiEndpoint(apiEndpointId));

    const { t } = useTranslation();

    const [form1] = Form.useForm();
    const [form2] = Form.useForm();

    const initialValues: APIEndpoints = {
        application_id: applicationId || '',  // Reference to an application
        name: data?.name || '',
        route: data?.route || '',
        method: data?.method || 'POST',  // Default method to 'POST' if not provided
        input_data_mapping: data?.input_data_mapping || '',
        headers: data?.headers || '',
        description: data?.description || '',
        auth_type: data?.auth_type || 'Bearer',  // Default auth type to 'Bearer'
    };

    const nextStep = async () => {
        try {
            if (currentStep === 0) {
                await form1.validateFields();
                setForm1Data(form1.getFieldsValue());
            } else {
                await form2.validateFields();
            }
            setCurrentStep(currentStep + 1);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
            message.error("Please fill in all required fields.");
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        try {            
            await form2.validateFields();
            const formData: APIEndpoints = {
                application_id: applicationId,
                ...form1Data,
                input_data_mapping: JSON.stringify(form2.getFieldsValue()),
            } as APIEndpoints;
            
            try {
                if(action === 'add') {
                    const response = await createApiEndpoint(formData);
                    dispatch(addApiEndpoint(response));
                    if(applicationId) {
                        dispatch(incrementEntityCount(applicationId));
                    }
                } 
                else if(action === 'edit') {
                    const response = await updateApiEndpointById(apiData?._id, formData);
                    dispatch(updateApiEndpoint(response));
                }
    
                handleSnackbar('API Endpoint Saved Successfully!');
                navigate(`/applications/${applicationId}`);

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

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error("Please complete the form.");
        }
    };
    const handleSnackbar = (message: string) => {
        notification.info({
            message: message,
            duration: 3,
        });
    };

    useEffect(() => {
        if(applicationId && apiEndpointId && !data) {
            getAPIEndpoints(applicationId).then(apiEndpoints => {
                dispatch(addApiEndpoints(apiEndpoints));
            });
        }
        if(apiEndpointId && data) {
            setApiData(data);
            setAction("edit");
            const json = JSON.parse(data.input_data_mapping);
            setRawJsonInput(JSON.stringify(json, null, 2));
            setJsonInput(JSON.stringify(cleanJson(json), null, 2));
            const formFields = generateForm(json);
            setGeneratedForm(formFields);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mockData = parseAndGenerateMockData(json as Record<string, any>);
            setLiveSample(JSON.stringify(mockData, null, 2));
        }
    }, [apiEndpointId, applicationId, data, dispatch, jsonInput]);

    return (
        <div style={{ margin: "50px auto" }}>
            <div style={{ maxWidth: 600, margin: "50px auto" }}>
                <Steps current={currentStep} style={{ marginBottom: 30 }}>
                    <Step title={t('api_endpoint_form_component.api_details')} />
                    <Step title={t('api_endpoint_form_component.design_api_input')}/>
                </Steps>
            </div>

            {currentStep === 0 && (
                <ApiDetailsForm form={form1} initialValues={initialValues} isEditMode={action === "edit"} />
            )}

            {currentStep === 1 && (
                <ApiDesignInput 
                    form={form2} 
                    jsonInput={jsonInput} 
                    rawJsonInput={rawJsonInput}
                    setJsonInput={setJsonInput} 
                    isParsed={isParsed} 
                    setIsParsed={setIsParsed} 
                    liveSample={liveSample} 
                    setLiveSample={setLiveSample} 
                    generatedForm={generatedForm} 
                    setGeneratedForm={setGeneratedForm} 
                    isModalVisible={isModalVisible} 
                    setIsModalVisible={setIsModalVisible}
                />
            )}

            <div style={{ marginTop: 30 }}>
                <Row
                    gutter={[16, 16]}
                    justify="center"
                    style={{ alignItems: "center" }}
                >
                    <Col>
                    {currentStep > 0 && (
                        <Button style={{ marginRight: 8 }} onClick={prevStep}>
                            {t('api_endpoint_form_component.previous_button')}
                        </Button>
                    )}
                    {currentStep < 1 && (
                        <Button type="primary" onClick={nextStep}>
                            {t('api_endpoint_form_component.next_button')}
                        </Button>
                    )}
                    {currentStep === 1 && (
                        <Button type="primary" onClick={handleSubmit}>
                            {t('api_endpoint_form_component.submit_button')}
                        </Button>
                    )}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ApiEndpointForms;
