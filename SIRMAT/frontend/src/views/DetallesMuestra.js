// Importamos la funcion necesaria para agregar history a el componente con estado
import { withRouter } from "react-router";
// Esta importacion se tiene que hacer en todas las tablas
import { connect } from "react-redux";

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

class DetallesMuestra extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: datos_detallesmuestra,
    };
  }

  componentDidMount() {
    this.GET_detalles()
  }

  // Funcion que se utilizara para hacer GET a la API en DetallesMuestra
  // TODO: En cuanto se termine el cambio a la API en DetallesMuestra de las especies
  // Se debe de cambiar la variable "variable_temporal" por "datos"
  GET_detalles(ruta) {

    // Se de la formato a el parametro id
    var params = { id: this.props.muestra }


    // Se crea la URL para mandar a la API
    const ruta_detalles = "http://127.0.0.1:8081/detallesmuestra/?" + new URLSearchParams(params);
    var status_response
    const { history } = this.props;

    fetch(ruta_detalles, {
      method: "GET",
      headers: {
        Authorization: "Token " + this.props.user_data.token,
      },
    })
      .then((response) => {
        status_response = response.status;
        return response.json()
      })
      .then((detallesmuestrasJson) => {
        if (status_response === 200) {
          this.setState({ data: detallesmuestrasJson })
        }
        else if (status_response === 401 || status_response === 403) {
          history.push("/auth/login/")
        }
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
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row className="mb-2">
            <Col className="mt-1">
              <Button outline color="" size="sm" onClick={this.props.regresar}>
                <i className="ni ni-bold-left"></i> Volver a muestras
              </Button>
            </Col>
          </Row>
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="card-profile shadow">
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                  <h3>Detalles Muestra: {this.props.nombre_muestra}</h3>
                </CardHeader>
                <CardBody className="pt-0 pt-md-1">
                  <div className="text-center">
                    <p>Estado del etiquetado: {this.props.etiquetado}</p>
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
              <TablaFotografias muestra={this.props.muestra} />
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

// Creamos un componente conectado que nos proporciona la funcion history
const DestallesMuestraConectado = withRouter(DetallesMuestra);

const mapStateToProps = (state) => ({
  user_data: state.user.user_data
 })

// Si no se tiene mapDispatchToProps entonces se use null como segundo parametro
export default connect(mapStateToProps, null)(DestallesMuestraConectado);