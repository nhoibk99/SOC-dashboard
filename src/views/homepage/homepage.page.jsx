import React from 'react';
import Radar from './components/radar/radar.component';
import Chart from './components/chart/chart.component';
import Grid from './components/grid/gird.component';
import ListGrid from './components/list-grid/list-grid.component';
import BgImage from '../../assets/images/bg.png';
import Header from '../../components/header/header.component';
import {Col, Row} from 'antd';
import './homepage.styles.scss';

const Homepage = () => (
  <div
    className="homepage"
    style={{minHeight: '100vh', background: `url(${BgImage}) 100% `}}
  >
    <Header />
    <div className="ctn-content">
      <Row gutter={[15, 15]}>
        <Col span={16}>
          <Row className="border-box-content">
            <Col span={12}>
              <Radar />
            </Col>
            <Col span={12}>
              <Grid />
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row className="border-box-content">
            <Chart />
          </Row>
        </Col>
      </Row>
      <ListGrid />
    </div>
  </div>
);

export default Homepage;
