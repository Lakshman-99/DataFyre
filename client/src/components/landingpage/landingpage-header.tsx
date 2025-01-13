import { Layout, Menu } from "antd";
import "antd/dist/reset.css";
import "../../pages/landingpage/landingpage-header.css"; // Ensure your styles are compatible with Ant Design

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Layout>
      <Header className="header_container">
        <div className="header_leftpane">
          <h3 className="img_logo">DATAFYRE</h3>
          {/* <img src="../src/assets/images/DataLogo.webp" alt="DATAFYRE" id="logo_img" /> */}
        </div>

        <Menu
          theme="light"
          mode="horizontal"
          className="header_rightpane"
          defaultSelectedKeys={['home']}
          items={[
            { label: <a href="#homeInfo">Home</a>, key: "home" },
            { label: <a href="#aboutUs">About Us</a>, key: "about" },
            { label: <a href="#features">Features</a>, key: "features" },
            { label: <a href="#contactUs">Contact Us</a>, key: "contact" },
          ]}
        />
      </Header>
    </Layout>
  );
};

export default AppHeader;