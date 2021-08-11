import React, { Component } from 'react';
// reactstrap components
import {
  Badge,
  Button,
  Card,
  Col,
  CardHeader,
  CardBody,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Modal,
  ModalHeader,
  Media,
  ModalBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";

import Header from "components/Headers/Header.js";
import datos_detallesmuestra from "datos_prueba/datos_DetallesMuestra.js";
import datos_fotografias from "datos_prueba/datos_Fotografias.js";
import TablaFotografias from "components/Tables/Tablas_fotografias.js"

// Se importan los datos de prueba para la tabla
import user from "datos_prueba/datos_Sesion.js";


class DetallesMuestra extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: datos_detallesmuestra,
      user_data: user,
      // Temporal 
      muestra: 17
    };

    this.toggle_add_modal = this.toggle_add_modal.bind(this)
  }

  componentDidMount() {
    this.GET_detalles()    
  }

  toggle_add_modal() {

  }

  // Funcion que se utilizara para hacer GET a la API en DetallesMuestra
  // TODO: En cuanto se termine el cambio a la API en DetallesMuestra de las especies
  // Se debe de cambiar la variable "variable_temporal" por "datos"
  GET_detalles(ruta) {

    // Se de la formato a el parametro id
    var params = { id: this.state.muestra }

    // Se crea la URL para mandar a la API
    const ruta_detalles = "http://127.0.0.1:8081/detallesmuestra/?" + new URLSearchParams(params);

    fetch(ruta_detalles, {
      method: "GET",
      headers: {
        Authorization: "Token " + this.state.user_data.token,
      },
    })
      .then((response) => response.json())
      .then((detallesmuestrasJson) => {
        this.setState({ data: detallesmuestrasJson })
        console.log(this.state.data)
      });
  }

  // Da formato a la fecha antes de mostrarla
  format_date(string_date) {

    var obj_fecha = new Date(string_date)
    var fecha = obj_fecha.toLocaleString("es-MX", { timezone: "GMT-5" })
    return fecha

  }

  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="card-profile shadow">
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                  <h3>Detalles Muestra</h3>
                </CardHeader>
                <CardBody className="pt-0 pt-md-4">
                  <div className="text-center">
                    <p>Fecha/Hora de captura: {this.format_date(this.state.data.horaFecha)}</p>
                    <p>
                      {this.state.data.observaciones}
                    </p>
                    <hr className="my-4" />
                    <p>Especies:</p>
                  </div>
                  <div>
                    {this.state.data.Especies.map(Especie => {
                      return (
                        <>
                          <p>
                            {Especie.especie} : {Especie.cantidad}
                          </p>
                        </>
                      )
                    })}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1" xl="8">
              <Card className="shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <h3 className="mb-0 ml-2">Fotografias</h3>
                    <Button className="ml-3" color="success" type="button" size="sm" onClick={() => this.toggle_add_modal()}>
                      <i className="ni ni-fat-add mt-1"></i>
                    </Button>
                  </Row>
                </CardHeader>
                <TablaFotografias muestra={this.state.muestra} />
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default DetallesMuestra;