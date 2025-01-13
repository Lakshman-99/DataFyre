import { Row, Col, Button, Result, Flex } from "antd";
import { useState } from "react";

// project import
import ApplicationCard from "./application-card";
import ApplicationForm from "./application-form";
import { useSelector } from "react-redux";
import { selectApplications } from "../../redux/application-slice";
import { useTranslation } from "react-i18next";

const Application = () => {
    const { t } = useTranslation();
    const [showApplicationForm, setShowApplicationForm] = useState(false);

    const applications = useSelector(selectApplications);

    const toggleApplicationForm = () => {
        setShowApplicationForm(!showApplicationForm);
    };

    return (
        <>
            <ApplicationForm
                isOpened={showApplicationForm}
                onClose={toggleApplicationForm}
                mode={t('application_modes.add_mode')}
            />
            <Row justify="end" style={{ marginBottom: "16px" }}>
                <Col>
                    <Button type="primary" onClick={toggleApplicationForm}>
                    {t('applications_component.add_application_button')}
                    </Button>
                </Col>
            </Row>
            <Row gutter={16}>
                {applications.length === 0 && (
                    <>
                            <Flex justify="center" align="center" style={{ width: "100%" }}>
                                <Result
                                    status="404"
                                    title={t('applications_component.no_application_title')}
                                    subTitle={t('applications_component.no_application_subtitle')}
                                    extra={<Button type="primary" onClick={toggleApplicationForm}>
                                        {t('applications_component.add_application')}
                                    </Button>}
                                />
                            </Flex>
                    </>
                )}
                {applications.map((app, index) => (
                    <Col xs={24} sm={24} md={12} lg={8} key={index}>
                        <ApplicationCard appData={app} />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default Application;
