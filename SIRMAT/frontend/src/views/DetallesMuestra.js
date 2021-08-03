import React, { Component } from 'react';
// reactstrap components
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
import datos_detallesmuestra from "datos_prueba/datos_DetallesMuestra.js"
import datos_fotografias from "datos_prueba/datos_Fotografias.js"



class DetallesMuestra extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: datos_detallesmuestra,
      fotografias: datos_fotografias
    };

    this.toggle_add_modal = this.toggle_add_modal.bind(this)
  }

  toggle_add_modal(){

  }

  format_date(string_date) {

    var obj_fecha = new Date(string_date)
    var fecha = obj_fecha.toLocaleString("es-MX", { timezone: "GMT-5" })
    return fecha

  }

  format_image(string_image){
    var string_correcta = ".." + string_image
    return string_correcta
  }

  create_table() {
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
                  alt="..."
                  src={
                    require("../assets/img/theme/angular.jpg")
                    .default
                  }
                />
              </a>
            </Media>
          </th>
          <td>{foto.etiquetado}</td>
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
                  href="#pablo"
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
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                    <h3 className="mb-0 ml-2">Fotografias</h3>
                    <Button className="ml-3" color="success" type="button" size="sm" onClick={() => this.toggle_add_modal()}>
                      <i className="ni ni-fat-add mt-1"></i>
                    </Button>
                  </Row>
                </CardHeader>
                <CardBody>
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default DetallesMuestra;