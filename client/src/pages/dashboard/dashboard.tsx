import { useEffect, useState } from "react";

import {
  Card,
  Col,
  Row,
  Typography,
  Timeline,
  Statistic,
  StatisticProps,
  Table,
  Tag,
  Modal,
  Button,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  AppstoreOutlined,
  PlusOutlined,
  EyeOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

import Echart from "../../components/chart/EChart";
import LineChart from "../../components/chart/LineChart";

import "./dashboard.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { getDashboardOverview, getPopulationLogs } from "../../services/dashboard-service";
import { PopulationLog, TotalCountModel } from "../../models/dashboard";
import CountUp from 'react-countup';

const { Title, Text } = Typography;

function Home() {
  const [reverse, setReverse] = useState(false);
  const [overview, setOverview] = useState<TotalCountModel>();
  const [dataSource, setDataSource] = useState<PopulationLog[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<PopulationLog | null>(null);

  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  
  const count = [
    {
      today: t('dashboard_component.total'),
      title: overview?.total,
      icon: <PlusOutlined key={0} style={{ fontSize: 22, color: "#fff" }}/>,
      bnb: "bnb2",
    },
    {
      today: t('dashboard_component.success'),
      title: overview?.success,
      icon: <CheckOutlined key={0} style={{ fontSize: 22, color: "#fff" }} />,
      bnb: "bnb2",
    },
    {
      today: t('dashboard_component.failure'),
      title: overview?.failure,
      icon: <CloseOutlined key={0} style={{ fontSize: 22, color: "#fff" }} />,
      bnb: "redtext",
    },
    {
      today: t('dashboard_component.total_applications'),
      title: overview?.total_applications,
      icon: <AppstoreOutlined key={0} style={{ fontSize: 22, color: "#fff" }}/>,
      bnb: "bnb2",
    },
  ];

  const columns = [
    {
      title: t('population_logs.api_endpoint_name'),
      dataIndex: 'api_endpoint_id',
      key: 'api_endpoint_id',
      render: (api_endpoint_id: {name: string}) => <Text>{api_endpoint_id.name}</Text>,
    },
    {
      title: t('population_logs.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: 'In Progress' | 'Completed' | 'Failed') => {
        let color = 'geekblue';
        switch (status) {
          case 'Completed':
            color = 'green';
            break;
          case 'Failed':
            color = 'volcano';
            break;
          case 'In Progress':
            color = 'gold';
            break;
          default:
            break;
        }
        return <Tag color={color}><Text>{status}</Text></Tag>;
      },
    },
    {
      title: t('population_logs.records_to_process'),
      dataIndex: 'records_to_process',
      key: 'records_to_process',
      render: (records_to_process: number) => <Text>{records_to_process}</Text>,
    },
    {
      title: t('population_logs.success_count'),
      dataIndex: 'success_count',
      key: 'success_count',
      render: (success_count: number) => <Text>{success_count}</Text>,
    },
    {
      title: t('population_logs.failure_count'),
      dataIndex: 'failure_count',
      key: 'failure_count',
      render: (failure_count: number) => <Text>{failure_count}</Text>,
    },
    {
      title: t('population_logs.started_at'),
      dataIndex: 'started_at',
      key: 'started_at',
      render: (started_at: Date) => <Text>{new Date(started_at).toLocaleString()}</Text>,
    },
    {
      title: t('population_logs.action'),
      key: 'action',
      render: (record: PopulationLog) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => showFailureModal(record)} />
      ),
    },
  ];

  const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator="," />
  );

  const showFailureModal = (record: PopulationLog) => {
    setCurrentRecord(record);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const parseFailureResponses = (jsonString: string) => {
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2); // parse and then stringify for pretty print
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return 'Invalid JSON data';
    }
  };

  useEffect(() => {
    getDashboardOverview().then((res) => {
      setOverview(res);
    });

    getPopulationLogs().then((res) => {
      setDataSource(res);
    });

  }, [dispatch]);

  return (
    <>
      <Modal title="Failure Logs" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p><Text strong>API Endpoint:</Text> {currentRecord?.api_endpoint_id.name}</p>
        <p><Text strong>Failure Count:</Text> {currentRecord?.failure_count}</p>
        <pre>
          <Text strong>Failure Details:</Text> 
          {currentRecord ? parseFailureResponses(currentRecord.failure_responses) : 'No data'}
        </pre>
      </Modal>
      <div className="layout-content">
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          {count.map((c, index) => (
            <Col
              key={index}
              xs={24}
              sm={24}
              md={12}
              lg={6}
              xl={6}
              className="mb-24"
            >
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>{c.today}</span>
                      <Title level={3}>
                        <Statistic value={c.title} formatter={formatter} /> <small className={c.bnb}></small>
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{c.icon}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Echart />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <div className="project-ant">
                <div>
                  <Title level={5}>{t('dashboard_component.applications_chart')}</Title>
                </div>
              </div>
              <div className="ant-list-box table-responsive">
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  rowKey={(record) => record._id || ""}
                  style={{ marginTop: 20 }}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <div className="timeline-box">
                <Title level={5}>{t('dashboard_component.population_history')}</Title>

                <Timeline
                  className="timelinelist"
                  reverse={reverse}
                  style={{ maxHeight: '850px', overflowY: 'auto', padding: '10px' }}
                >
                  {dataSource.map(log => (
                    <Timeline.Item key={log._id} color={getColorForStatus(log.status)}>
                      <Text strong>{log.api_endpoint_id.name}</Text> - <Text>{log.status}</Text>
                      <div>Records Processed: {log.records_to_process}</div>
                      <div>Success: {log.success_count}, Failures: {log.failure_count}</div>
                      <div>Started at: {new Date(log.started_at).toLocaleString()}</div>
                      {log.stopped_at && <div>Stopped at: {new Date(log.stopped_at).toLocaleString()}</div>}
                    </Timeline.Item>
                  ))}
                </Timeline>

                <Button
                  type="primary"
                  className="width-100"
                  onClick={() => setReverse(!reverse)}
                >
                  {<MenuUnfoldOutlined />} {t('population_logs.reverse_button')}
                </Button>
                
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

function getColorForStatus(status: 'In Progress' | 'Completed' | 'Failed'): string {
  switch (status) {
    case 'Completed': return 'green';
    case 'Failed': return 'red';
    case 'In Progress': return 'blue';
    default: return 'grey';
  }
}

export default Home;