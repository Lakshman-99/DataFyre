import { Layout, Button, Typography, Row, Col, Card } from "antd";
import { Link } from "react-router-dom";
import "antd/dist/reset.css";
import "../../pages/landingpage/landingpage-main.css"; // Ensure styles remain consistent

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

export const Home = () => {
  return (
    <Content id="homeInfo" className="homeInfo">
      <Row justify="center" align="middle">
        <Col span={24}>
          <img
            src="/src/assets/images/HomeBackground.png"
            alt="DATA-IMG"
            className="home-bg-img"
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} justify="center" align="middle" className="box">
        <Col span={24}>
          <Title className="font-style" level={1}>
            <h1>DataFyre </h1>
            <h2>Enterprise Data Generation and Management Tool</h2>
          </Title>
          <Link to="/signup">
            <Button type="primary" size="large" className="loginbutton">
              Sign Up
            </Button>
          </Link>
          <Paragraph className="login-info">
            Already have an account? &nbsp;
            <Link to="/login">Login</Link>
          </Paragraph>
        </Col>
      </Row>
    </Content>
  );
};

export const AboutUs = () => {
  const handleClick = () => {
    window.location.href =
      "https://github.com/info-6150-fall-2024/final-project-datasmiths/blob/main/README.md";
  };

  return (
    <Content id="aboutUs" className="aboutus-landingpage">
      <Row justify="center">
        <Col className="aboutus-leftpane" span={12}>
          <Title level={2}>
            Welcome to <strong>DataFyre</strong>
          </Title>
          <Paragraph className="paragraph-aboutUs">
            The powerful and intuitive tool designed specifically for developers
            working with data-heavy applications. Created by the DataSmiths team,
            this project is the culmination of our efforts in the INFO6150 Web
            Design and User Experience course.
          </Paragraph><br />
          <Button type="primary" size="large" onClick={handleClick}>
            Learn More
          </Button>
        </Col>
        <Col className="aboutus-rightpane" span={12}>
          <img
            className="aboutus-image"
            src="src/assets/images/AboutUSIMG.jpeg"
            alt="About Us"
          />
        </Col>
      </Row>
    </Content>
  );
};

export const Features = () => {
  const features = [
    {
      title: "Synthetic Data Generation",
      description:
        "Automatically generate customizable, meaningful test data based on user-defined APIs and input formats.",
    },
    {
      title: "Customizable Data",
      description:
        "Tailor the generated data to your application's specific needs, ensuring the data is realistic and useful.",
    },
    {
      title: "Comprehensive Dashboard",
      description:
        "View an interactive, real-time dashboard with detailed insights, analytics, and population status.",
    },
    {
      title: "Role-Based Access Control",
      description:
        "Manage user roles with different access levels and permissions (Admin, Developer, Tester, etc.), ensuring secure, scalable use in an enterprise setting.",
    },
    {
      title: "Logs & Analytics",
      description:
        "Track every data generation event, view logs, and get insights into past populations for efficient debugging and testing.",
    },
    {
      title: "Easy Integration",
      description:
        "Seamlessly integrate with your existing applications, allowing you to populate data whenever required for testing and development.",
    },
  ];

  return (
    <Content id="features" className="features">
      <Title className="align-center" level={1}>
        Our Features
      </Title>
      <Row gutter={[16, 16]} className="features-flex">
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card title={feature.title} hoverable>
              <Paragraph>{feature.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </Content>
  );
};
