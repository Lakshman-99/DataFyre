import { useState, useEffect } from "react";
import {
    Row,
    Col,
    Breadcrumb,
    Button,
    Drawer,
    Typography,
    Switch,
    Dropdown,
    Menu,
    Tooltip,
    Space,
    Avatar,
} from "antd";
import {
    SettingOutlined,
    TranslationOutlined,
    HomeOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    LogoutOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../../redux/store";
import { setLanguage } from "../../../redux/language-slice";
import { useMediaQuery } from "react-responsive";
import { logoutUser } from "../../../redux/auth-slice";

const ButtonContainer = styled.div`
    .ant-btn-primary {
        background-color: #1890ff;
    }
    .ant-btn-success {
        background-color: #52c41a;
    }
    .ant-btn-yellow {
        background-color: #fadb14;
    }
    .ant-btn-black {
        background-color: #262626;
        color: #fff;
        border: 0px;
        border-radius: 5px;
    }
    .ant-switch-active {
        background-color: #1890ff;
    }
`;

function Header({
                    onPress,
                    handleSidenavColor,
                    handleSidenavType,
                    handleFixedNavbar,
                }: {
    onPress: () => void;
    handleSidenavColor: (color: string) => void;
    handleSidenavType: (type: string) => void;
    handleFixedNavbar: (fixed: boolean) => void;
}) {
    const { Title, Text } = Typography;
    const language = useSelector((state: AppState) => state.language.language);
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { pathname } = useLocation();
    const isSmallScreen = useMediaQuery({ maxWidth: 992 });

  // Split the pathname into segments
    const pathSegments = pathname.split("/").filter(Boolean);

  // Generate breadcrumb items
    const breadcrumbItems = pathSegments.map((segment, index) => {
        const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
        return (
            <Breadcrumb.Item key={index}>
                <NavLink to={url}>
                  {segment.charAt(0).toUpperCase() + segment.slice(1)} {/* Capitalize segment */}
                </NavLink>
            </Breadcrumb.Item>
        );
    });
  const navigate = useNavigate(); // For navigation

    const [visible, setVisible] = useState(false);
    const [sidenavType, setSidenavType] = useState("transparent");

    useEffect(() => window.scrollTo(0, 0));

    const showDrawer = () => setVisible(true);
    const hideDrawer = () => setVisible(false);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/");
    };

    const menu = (
        <Menu>
            <Menu.Item
                key="view"
                icon={<EyeOutlined />}
                onClick={() => navigate("/profile/view")}
            >
                {t("header_component.view_profile")}
            </Menu.Item>
            <Menu.Item
                key="edit"
                icon={<EditOutlined />}
                onClick={() => navigate("/profile/edit")}
            >
                {t("header_component.edit_profile")}
            </Menu.Item>
            <Menu.Item
                key="delete"
                icon={<DeleteOutlined />}
                onClick={() => navigate("/profile/delete")}
            >
                {t("header_component.delete_profile")}
            </Menu.Item>
            <Menu.Item
                key="billing"
                icon={<DollarOutlined />}
                onClick={() => navigate("/billinginfo")}
            >
                {t("header_component.billing_info")}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                {t("header_component.logout")}
            </Menu.Item>
        </Menu>
    );

    const languageMenu = (
        <Menu>
            <Menu.Item key="english" onClick={() => changeLanguage("en")}>
                English
            </Menu.Item>
            <Menu.Item key="tamil" onClick={() => changeLanguage("ta")}>
                Tamil
            </Menu.Item>
        </Menu>
    );

    const changeLanguage = (lang: string) => {
        dispatch(setLanguage(lang));
    };


  // Sync the language from Redux with i18next
    useEffect(() => {
    // Change language only if it's different from the current language
        if (i18n.language !== language) {
            i18n.changeLanguage(language);
        }
  }, [language, i18n]); // Also listen to location changes to trigger the effect on route change

    return (
        <>
            <Row gutter={[24, 0]}>
                <Col span={24} md={18} style={{ display: "flex", alignItems: "center" }}>
                    <Space align="center">
                        {isSmallScreen && (
                            <Button
                                type="text"
                                icon={<MenuUnfoldOutlined />}
                                onClick={onPress}
                                aria-label="Toggle Sidebar"
                            />
                        )}
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <NavLink to="/">
                                    <HomeOutlined />
                                </NavLink>
                            </Breadcrumb.Item>
                            {breadcrumbItems}
                        </Breadcrumb>
                    </Space>
                </Col>
                <Col
                    span={24}
                    md={6}
                    className="header-control"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                    }}
                >
                    <Tooltip title={t("header_component.settings_tooltip")}>
                        <Button
                            onClick={showDrawer}
                            icon={<SettingOutlined style={{ fontSize: "20px" }} />}
                            shape="circle"
                            style={{
                                backgroundColor: "transparent",
                                border: "none",
                            }}
                        />
                    </Tooltip>
                    <Dropdown overlay={languageMenu} trigger={["click"]}>
                        <Button
                            icon={<TranslationOutlined style={{ fontSize: "20px" }} />}
                            shape="circle"
                            style={{
                                backgroundColor: "transparent",
                                border: "none",
                            }}
                        />
                    </Dropdown>
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <Tooltip title={t("header_component.profile_tooltip")}>
                            <Avatar
                                size="large"
                                icon={<UserOutlined />}
                                style={{ cursor: "pointer" }}
                            />
                        </Tooltip>
                    </Dropdown>
                </Col>
            </Row>
            <Drawer
                className="settings-drawer"
                mask={true}
                width={360}
                onClose={hideDrawer}
                placement="right"
                open={visible}
            >
            <div className="vertical-layout">
              <div className="header-top">
                <Title level={4}>
                  {t("header_component.configurator")}
                  <Text className="subtitle">
                    {t("header_component.configurator_description")}
                  </Text>
                </Title>
              </div>

              <div className="sidebar-color">
                <Title level={5}>{t('header_component.sidebar_color')}</Title>
                  <div className="theme-color mb-2">
                    <ButtonContainer>
                      <Button
                        type="primary"
                        onClick={() => handleSidenavColor("#1890ff")}
                        style={{ backgroundColor: "#1890ff" }}
                      >
                    1
                  </Button>
                  <Button
                      type="primary"
                      onClick={() => handleSidenavColor("#52c41a")}
                      style={{ backgroundColor: "#52c41a" }}
                  >
                    1
                  </Button>
                  <Button
                      type="default"
                      onClick={() => handleSidenavColor("#d9363e")}
                      style={{ backgroundColor: "#d9363e" }}
                  >
                    1
                  </Button>
                  <Button
                      type="default"
                      onClick={() => handleSidenavColor("#fadb14")}
                      style={{ backgroundColor: "#fadb14" }}
                  >
                    1
                  </Button>

                  <Button
                      type="default"
                      onClick={() => handleSidenavColor("#111")}
                      style={{ backgroundColor: "#111" }}
                  >
                    1
                  </Button>
                </ButtonContainer>
              </div>

              <div className="sidebarnav-color mb-2">
                <Title level={5}>{t("header_component.sidenav_type")}</Title>
                <Text>{t("header_component.sidenav_type_description")}</Text>
                <ButtonContainer className="trans">
                  <Button
                      type={sidenavType === "transparent" ? "primary" : "default"}
                      onClick={() => {
                        handleSidenavType("transparent");
                        setSidenavType("transparent");
                      }}
                  >
                    {t("header_component.transparent_button")}
                  </Button>
                  <Button
                      type={sidenavType === "white" ? "primary" : "default"}
                      onClick={() => {
                        handleSidenavType("#fff");
                        setSidenavType("white");
                      }}
                  >
                    {t("header_component.white_button")}
                  </Button>
                </ButtonContainer>
              </div>
              <div className="fixed-nav mb-2">
                <Title level={5}>{t("header_component.navbar_fixed")}</Title>
                <Switch onClick={(e) => handleFixedNavbar(e)} />
              </div>
            </div>
          </div>
            </Drawer>
        </>
    );
}

export default Header;
