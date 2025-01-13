// import { useState } from "react";
import { AppstoreOutlined, DashboardOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getApplications } from "../../../services/application-service";
import { AppDispatch } from "../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { loadApplications, selectApplications } from "../../../redux/application-slice";
import { useTranslation } from "react-i18next";
import DataFyreLogo from "../../../assets/images/logo.svg";

function Sidenav({ color }: { color: string }) {
  const { pathname } = useLocation();  
  const page = pathname.replace("/", "");
  const dispatch = useDispatch<AppDispatch>();
  const applications = useSelector(selectApplications);
  // Use translation hook
  const { t } = useTranslation();

  useEffect(() => {
    getApplications().then(applications => {
      dispatch(loadApplications(applications))
    });
  }, [dispatch]);

  return (
    <>
      <div className="brand">
        <img src="#" alt="" />
        <span>
          <img src={DataFyreLogo} alt="Dashboard" style={{ width: 'auto', height: '61px' }} />
        </span>

      </div>
      <hr />
      <Menu theme="light" mode="inline">
        <Menu.Item key="1">
          <NavLink to="/dashboard">
            <span
              className="icon"
              style={{
                background: page === "dashboard" ? color : "",
              }}
            >
              <DashboardOutlined style={{ fontSize: '20px', color: 'currentColor' }} />
            </span>
            <span className="label">{t('sidenav_component.dashboard')}</span>
          </NavLink>
        </Menu.Item>

        <Menu.Item key="2">
  <NavLink to="/applications">
    <span
      className="icon"
      style={{
        background: page === "applications" ? color : "",
      }}
    >
      <AppstoreOutlined style={{ fontSize: '20px', color: 'currentColor' }} />
    </span>
    <span className="label">{t('sidenav_component.applications')}</span>
  </NavLink>
</Menu.Item>

{/* Separate child items */}
{/* Indented child items under Applications */}
{applications.map((app) => (
    <Menu.Item key={app._id}>
      <NavLink to={`/applications/${app._id}`}>
        <span className="label">{app.name}</span>
      </NavLink>
    </Menu.Item>
))}
        {/* <Menu.Item className="menu-item-header" key="5">
          Applications
        </Menu.Item> */}
      </Menu>
      <div className="aside-footer">
        
      </div>
    </>
  );
}

export default Sidenav;