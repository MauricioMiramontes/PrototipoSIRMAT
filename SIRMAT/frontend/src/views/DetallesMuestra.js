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

// Se importan los datos de prueba para la tabla
import user from "datos_prueba/datos_Sesion.js";


class DetallesMuestra extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: datos_detallesmuestra,
      fotografias: datos_fotografias,
      user_data: user,
      variable_temporal: {},
      // Temporal 
      muestra : 16
    };

    this.toggle_add_modal = this.toggle_add_modal.bind(this)
  }

  componentDidMount() {
    
    const ruta_fotografias = "http://127.0.1:8081/fotografias/"
    this.GET_detalles()
    this.GET_fotografias(ruta_fotografias, this.state.muestra)
  }
  
  toggle_add_modal() {

  }

  // Funcion que se utilizara para hacer GET a la API en fotografias
  GET_fotografias(id_muestra){

    // Se de la formato a el parametro id
    var params = {muestra: this.state.muestra}

    // Se crea la URL para mandar a la API
    const ruta_fotografias = "http://127.0.0.1:8081/fotografias/?" + new URLSearchParams(params);
    
    fetch(ruta_fotografias, {
      method: "GET",
      headers: {
        Authorization: "Token " + this.state.user_data.token,
      },
    })
      .then((response) => response.json())
      .then((fotografiasJson) => {
        console.log(fotografiasJson)
        this.setState({ fotografias: fotografiasJson })

      });

  }

  // Funcion que se utilizara para hacer GET a la API en DetallesMuestra
  // TODO: En cuanto se termine el cambio a la API en DetallesMuestra de las especies
  // Se debe de cambiar la variable "variable_temporal" por "datos"
  GET_detalles(ruta){

    // Se de la formato a el parametro id
    var params = {id: this.state.muestra}

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
        this.setState({ variable_temporal: detallesmuestrasJson })
        console.log(this.state.variable_temporal)
      });
  }

  // Da formato a la fecha antes de mostrarla
  format_date(string_date) {

    var obj_fecha = new Date(string_date)
    var fecha = obj_fecha.toLocaleString("es-MX", { timezone: "GMT-5" })
    return fecha

  }

  // Indica a la App de donde va a sacar las fotos que va a mostrar en la tabla
  format_image(string_image) {
    const base_url = "http://127.0.0.1:8081";
    var string_correcta = base_url + string_image
    return string_correcta
  }

  // Crea la tabla de fotografias pertenecientes a la muestra
  create_table() {

    const print_estado_etiquetado = (estado) => {
      if (estado === "Pendiente") {
        return (
          <Badge color="" className="badge-dot">
            <i className="bg-danger" />
            Pendiente
          </Badge>
        )
      }
      else if (estado === "Terminado") {
        return (
          <Badge color="" className="badge-dot">
            <i className="bg-success" />
            Terminado
          </Badge>
        )
      }
      else if (estado === "Incompleto") {
        return (
          <Badge color="" className="badge-dot">
            <i className="bg-warning" />
            Incompleto
          </Badge>
        )
      };
    };

    // Si la variable "fotografias" del estado esta vacia se imprime un mensaje correspondiente
    // de lo contrario se crea la lista con las fotografias
    if(typeof(this.state.fotografias) == "object"){
      return this.state.fotografias.map((foto) => {

        return (
          <tr key={foto.idFotografias}>
            <th scope="row">
              <Media>
                <a
                  className="avatar rounded-circle mr-3"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <img
                    alt={foto.fileFoto}
                    src={this.format_image(foto.fileFoto)}
                  />
                </a>
              </Media>
            </th>
            <td>{print_estado_etiquetado(foto.etiquetado)}</td>
            <td className="text-right">
              <UncontrolledDropdown>
                <DropdownToggle
                  className="btn-icon-only text-light"
                  href="#pablo"
                  role="button"
                  size="m"
                  color=""
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="fas fa-ellipsis-v" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" container="body" right>
                  <DropdownItem
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    Editar
                  </DropdownItem>
                  <DropdownItem
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    Dar de baja
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </td>
          </tr>
        );
      });
    }
    else{
      return(
        <>
          <h3 className="ml-6 mt-4 mb-4">No se tiene ninguna fotografia registrada en esta muestra </h3>
        </>
      )
    }
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
                            {Especie.nombre} : {Especie.cantidad}
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
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Foto</th>
                      <th scope="col">Estado</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {/* Se llama a la funcion que crea la tabla */}
                    {this.create_table(this.state.table_data)}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default DetallesMuestra;