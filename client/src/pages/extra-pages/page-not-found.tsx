import { Button, Result } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined, FrownOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store"; // Adjust the import path based on your project structure
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom"; // Import useLocation
import "./not-found.css"; // Import custom CSS

const NotFoundPage = () => {
    // Get current language from Redux state
    const language = useSelector((state: AppState) => state.language.language);
    
    // Use translation hook
    const { t, i18n } = useTranslation();

    // Get current route location (to detect route change)
    const location = useLocation();

    // Sync the language from Redux with i18next
    useEffect(() => {
        // Change language only if it's different from the current language
        if (i18n.language !== language) {
            i18n.changeLanguage(language);
        }
    }, [language, i18n, location]); // Also listen to location changes to trigger the effect on route change

    return (
        <div className="not-found-page">
            <Result
                status="404"
                title={
                    <>
                        <h1 className="icon-sad">404 <FrownOutlined className="icon-sad" /></h1>
                        <div className="title-text">{t('404_not_found_page.title')}</div>
                    </>
                }
                subTitle={t('404_not_found_page.helper')}
                extra={
                    <Link to="/">
                        <Button
                            type="primary"
                            size="large"
                            icon={<HomeOutlined />}
                            className="go-home-btn"
                        >
                            {t('404_not_found_page.btn')}
                        </Button>
                    </Link>
                }
                className="result-card"
            />
        </div>
    );
};

export default NotFoundPage;
