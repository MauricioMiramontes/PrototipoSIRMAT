import React, { Component } from "react";
import Header from "components/Headers/Header.js";

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotation: 0
    }

    this.rotate = this.rotate.bind(this);

  }

  componentDidMount() {
    this.rotate()
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async rotate() {
    while (true) {
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
        <Header></Header>
        <div>
          <img style={{ transform: `rotate(${rotation}deg)` } } backgroundColor = 'transparent'
            src={
              require("../assets/img/brand/LoadingBackworoundless-removebg-preview.png")
                .default
            } width="100" />
        </div>
      </>
    )
  }
};

export default Loading;