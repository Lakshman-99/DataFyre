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

  const billing = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z"
        fill={color}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z"
        fill={color}
      ></path>
    </svg>,
  ];


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