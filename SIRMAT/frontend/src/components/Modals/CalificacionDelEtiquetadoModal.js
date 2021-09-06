import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  FormGroup,
  Row,
  Form
} from "reactstrap";

class CalificacionDelEtiquetadoModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      form_data: {
      },
    }

    this.etiquetado_rechazado = this.etiquetado_rechazado.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  etiquetado_rechazado(e) {
    this.props.onReject(e, this.state.form_data)
  }

  handleInputChange(event) {
    // Cada vez que haya un cambio en el formulario se actualizara la variable form_data del estado
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // Se crea una copia de la variable form_data del estado
    var updated_form_data = this.state.form_data;

    // Se actualiza la copia con los nuevos valores
    updated_form_data[name] = value;

    // Se actualiza el valor de la variable vieja con el de la copia actualizada
    this.setState({ form_data: updated_form_data });
    console.log(this.state.form_data)
  }

  render() {
    return (
      <>
        {/* Modal para cambiar el etiquetado del registro*/}
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
          <ModalHeader tag="h3" toggle={this.props.toggle}>Calificacion del Registro</ModalHeader>
          <ModalBody>
            <>
              <h3>Selecciona la calificacion del etiquetado</h3>
            </>
            <Form>
              <FormGroup className="mt-4">
                <Input
                  type="textarea"
                  name="observaciones"
                  id="observaciones"
                  placeholder="En caso de Repetir Etiquetado" 
                  onChange={this.handleInputChange}/>
              </FormGroup>
              <Row className="mb--4 ml-5">
                <Button color="success" type="submit" onClick={this.props.onConfirm}>Finalizado</Button>{' '}
                <Button color="danger" type="submit" onClick={(e) => this.etiquetado_rechazado(e)}>Repetir Etiquetado</Button>
                <Button color="secondary" onClick={this.props.toggle}>Cancelar</Button>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </Modal>
      </>
    )
  }

}

export default CalificacionDelEtiquetadoModal;