import { Layout, Row } from "antd";

function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter style={{ background: "#fafafa" }}>
      <Row className="just">     
      </Row>
    </AntFooter>
  );
}

export default Footer;
