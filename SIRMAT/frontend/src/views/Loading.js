import React, { Component } from "react";

import { Container, Row, Col } from 'reactstrap'

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotation: 0,
      rotate: true
    }

    this.rotate = this.rotate.bind(this);

  }

  componentDidMount() {
    this.rotate()
  }

  componentWillUnmount() {
    this.setState({ rotate: false })
  }


  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async rotate() {
    while (this.state.rotate === true) {
      await this.sleep(5)
      if (this.state.rotation >= 360) {
        this.setState({
          rotation: 0,
        })
      }
      this.setState({
        rotation: this.state.rotation + 2,
      })
    }
  }

  render() {
    const { rotation } = this.state;
    return (
      <>
        <Container className="mt-6" fluid>
          <Row>
            <Col xs={{ size: 1, offset: 4 }} md={{ size: 2, offset: 5 }}>
              <img style={{ transform: `rotate(${rotation}deg)` }} backgroundColor='transparent'
                src={
                  require("../assets/img/brand/LoadingBackworoundless-removebg-preview.png")
                    .default
                } width="90" />
            </Col>
          </Row>
        </Container>
      </>
    )
  }
};

export default Loading;