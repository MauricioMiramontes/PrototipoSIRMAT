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
import Loading from './Loading.js'
import datos_detallesmuestra from "datos_prueba/datos_DetallesMuestra.js";
import datos_fotografias from "datos_prueba/datos_Fotografias.js";
import TablaFotografias from "components/Tables/Tablas_fotografias.js"

class DetallesMuestra extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        Especies: [
          {
            especie: "",
            cantidad: ""
          }
        ],
      },
      loading: true,

      edit_modal: false,

      detail_form_data: {
        Especies: [
          {
            especie: "",
            cantidad: ""
          }
        ],
      }
    };
    this.toggle_edit_modal = this.toggle_edit_modal.bind(this);
    this.handleDetailInputChange = this.handleDetailInputChange.bind(this);
    this.agregar_especie = this.agregar_especie.bind(this);
    this.eliminar_especie = this.eliminar_especie.bind(this);
    this.PUT_detalles = this.PUT_detalles.bind(this)
  }

  componentDidMount() {
    this.GET_detalles()
  }

  handleDetailInputChange(event, index = 0) {
    // Cada vez que haya un cambio en el formulario se actualizara la variable detail_form_data del estado
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // Se crea una copia de la variable detail_form_data del estado
    var updated_detail_form_data = this.state.detail_form_data;


    if (name === "especie" || name === "cantidad") {
      updated_detail_form_data.Especies[index][name] = value;
    }
    else {
      // Se actualiza la copia con los nuevos valores
      updated_detail_form_data[name] = value;
    }


    // Se actualiza el valor de la variable vieja con el de la copia actualizada
    this.setState({ detail_form_data: updated_detail_form_data });
    console.log(this.state.detail_form_data)

  }

  // Agrega dos campos nuevos en el formulario de detalles para poner otra especie
  agregar_especie(event) {

    event.preventDefault();

    var new_element = {
      especie: "",
      cantidad: ""
    }

    var updated_form_data = this.state.detail_form_data;
    updated_form_data.Especies = updated_form_data.Especies.concat(new_element)

    this.setState({ detail_form_data: updated_form_data })

  }

  // Elimina los campos del formulario de detalles de una especie
  eliminar_especie(event, index) {

    event.preventDefault();

    var updated_form_data = this.state.detail_form_data;
    updated_form_data.Especies.splice(index, 1)

    this.setState({ detail_form_data: updated_form_data })
  }

  // Muestra u Oculta el modal para editar un registro
  toggle_edit_modal() {
    var value = this.state.edit_modal;
    this.setState({ edit_modal: !value });
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
        console.log(detallesmuestrasJson.Especies)
        if (status_response === 200) {
          this.setState({
            data: detallesmuestrasJson,
            detail_form_data: {
              observaciones: detallesmuestrasJson.observaciones,
              horaFecha: detallesmuestrasJson.horaFecha,
              Especies: detallesmuestrasJson.Especies 
            }
          })
        }
        else if (status_response === 401 || status_response === 403) {
          history.push("/auth/login/")
        }
        console.log(this.state.data)
        this.setState({ loading: false })
      });
  }

  PUT_detalles() {
    console.log("Editar")
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
        {/* Modal para editar un registro */}
        <Modal
          isOpen={this.state.edit_modal}
          toggle={() => this.toggle_edit_modal()}
        >
          <ModalHeader tag="h3" toggle={() => this.toggle_edit_modal()}>
            Editar Muestra <i className="ni ni-building" />
          </ModalHeader>
          <ModalBody>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <Input
                    value={this.state.detail_form_data.observaciones}
                    type="textarea"
                    name="observaciones"
                    onChange={this.handleDetailInputChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={this.state.detail_form_data.horaFecha}
                    type="text"
                    name="horaFecha"
                    onChange={this.handleDetailInputChange}
                  />
                </InputGroup>
              </FormGroup>
              {this.state.detail_form_data.Especies.map((especie, index) =>
                <Row key={index}>
                  <Col md={6}>
                    <FormGroup>
                      <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            Especie:
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder=""
                          type="select"
                          name="especie"
                          onChange={(e) => this.handleDetailInputChange(e, index)}
                        >
                          <option>{especie.especie}</option>
                          {this.props.especies.map((especieCajita) => {
                            return (
                              <option value={especieCajita.nombre}>{especieCajita.nombre}</option>
                            )
                          })}
                        </Input>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <InputGroup className="input-group-alternative mb-3">
                        <Input
                          value={especie.cantidad}
                          type="text"
                          name="cantidad"
                          onChange={(e) => this.handleDetailInputChange(e, index)}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col>
                    <Button
                      color="secondary"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => this.eliminar_especie(e, index)}
                    >
                      <i className="ni ni-fat-delete"></i>
                    </Button>
                  </Col>
                </Row>
              )}
              <Row>
                <Col>
                  <Button
                    color="primary"
                    type="submit"
                    size="sm"
                    onClick={(e) => this.agregar_especie(e)}
                  >
                    <i className="ni ni-fat-add"></i>
                  </Button>
                </Col>
              </Row>
              <Row className="justify-content-end mr-1">
                <Button
                  color="primary"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    this.POST_muestras(e)
                  }}
                >
                  Editar
                </Button>
                <Button
                  color="secondary"
                  onClick={() => {
                    this.toggle_edit_modal();
                  }}
                >
                  Cancelar
                </Button>
              </Row>
            </Form>
          </ModalBody>
        </Modal>

        {/* Datos de la muestra */}
        <Container className="mt--7" fluid>
          <Row className="mb-2">
            <Col className="mt-1">
              <Button outline color="" size="sm" onClick={this.props.regresar}>
                <i className="ni ni-bold-left"></i> Volver a muestras
              </Button>
            </Col>
          </Row>
          {this.state.loading ?
            <Loading />
            :
            <Row>
              <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
                <Card className="card-profile shadow">
                  <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                    <h3>Detalles Muestra: {this.props.nombre_muestra}</h3>
                    <Button outline color="secondary" size="sm" onClick={(e) => this.toggle_edit_modal(e)}>
                      Editar detalles
                    </Button>
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
                {/* Tabla de fotografias de la muestra */}
                <TablaFotografias muestra={this.props.muestra} />
              </Col>
            </Row>
          }
        </Container>
      </>
    )
  }
}

// Creamos un componente conectado que nos proporciona la funcion history
const DestallesMuestraConectado = withRouter(DetallesMuestra);

const mapStateToProps = (state) => ({
  especies: state.especies.especies_data,
  user_data: state.user.user_data
})

// Si no se tiene mapDispatchToProps entonces se use null como segundo parametro
export default connect(mapStateToProps, null)(DestallesMuestraConectado);