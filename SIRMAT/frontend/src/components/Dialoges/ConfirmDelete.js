import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  Row,
} from "reactstrap";

let dialogStyles = {
  width: '400px',
  height: '300px',
  maxWidth: '100%',
  margin: '0 auto',
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%,-50%)',
  zIndex: '999',
  backgroundColor: '#fff',
  padding: '10px 20px 40px',
  borderRadius: '8px',
  borderStyle: 'solid',
  borderColor: '#eee',
  display: 'flex',
  flexDirection: 'column'
};

let dialogCloseButtonStyles = {
  marginBottom: '15px',
  padding: '3px 8px',
  cursor: 'pointer',
  borderRadius: '50%',
  border: 'none',
  width: '30px',
  height: '30px',
  fontWeight: 'bold',
  alignSelf: 'flex-end'
};


class Dialog extends Component {
  render() {
    let dialog = (
      <div style={dialogStyles}>


        <Card className="bg-secondary shadow border-0 ">
          <Button style={dialogCloseButtonStyles} onClick={this.props.onClose}>x</Button>
          <CardBody className="px-lg-5 py-lg-5">
            <h3 className="text-center">Dar de baja este registro?</h3>
            <Row>
              <div className="text-center">
                <Button className="my-4 ml-2" color="warning" type="button" onClick={this.props.onClose}>
                  Cancelar
                </Button>
              </div>
              <div className="text-center">
                <Button className="my-4 ml-5" color="danger" type="button" onClick={this.props.onConfirm}>
                  Dar de baja
                </Button>
              </div>
            </Row>
          </CardBody>
        </Card>

      </div>
    );

    if (!this.props.isOpen) {
      dialog = null;
    }
    return (
      <div>
        {dialog}
      </div>
    );
  }
}

export default Dialog;