import { Layout, Typography, Row, Col } from "antd";
import "antd/dist/reset.css";
import "./landingpage-header";

const { Footer } = Layout;
const { Title, Paragraph } = Typography;

const ContactUs = () => {
  return (
    <Footer id="contactUs" className="footer">
      <Row gutter={[16, 16]} justify="space-around" className="footer-flex">
        <Col xs={24} sm={12} md={8} className="footer-box-features">
          <Title level={2}>DataFyre</Title>
          <Paragraph>
            Whether you're building an app from scratch or maintaining an existing one, DataFyre provides the tools to make your data management easier and more effective.
          </Paragraph>
        </Col>

        <Col xs={24} sm={12} md={8} className="footer-box-features">
          <Title level={2}>Help</Title>
          <Paragraph>About Us</Paragraph>
          <Paragraph>FAQs</Paragraph>
          <Paragraph>How it works</Paragraph>
          <Paragraph>Privacy Policy</Paragraph>
          <Paragraph>Payment Policy</Paragraph>
        </Col>

        <Col xs={24} sm={12} md={8} className="footer-box-features">
          <Title level={2}>Get in Touch</Title>
          <Paragraph>
            <a href="mailto:datafyre@gmail.com">datafyre@gmail.com</a>
          </Paragraph>
          <Paragraph>+1 (718) 617-1945</Paragraph>
        </Col>
      </Row>

      <Row justify="center">
        <Col>
          <Paragraph className="align-center">&copy; All rights reserved</Paragraph>
        </Col>
      </Row>
    </Footer>
  );
};

export default ContactUs;