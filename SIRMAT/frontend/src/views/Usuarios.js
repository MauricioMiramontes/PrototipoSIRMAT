/*!

=========================================================
* Argon Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";

// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardHeader,
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
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import ConfirmDelete from "components/Dialoges/ConfirmDelete.js";

// Se importan los datos de prueba para la tabla
import user from "datos_prueba/datos_Sesion.js"

class TablaUsuarios extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // Por ahora se toman los datos de prueba
      table_data: [],
      user_data: user,
      delete_dialog: false,
      usuario_seleccionado: null
    };

    //Functiones
    this.DELETE_usuarios = this.DELETE_usuarios.bind(this)
  }

  componentDidMount() {
    const url = "http://127.0.0.1:8081/usuarios/";
    this.GET_usuarios(url);

  }


  // Funcion que se utilizara para hacer un GET a la API en Trampas
  GET_usuarios = (ruta) => {
    fetch(ruta, {
      method: 'GET',
      headers: {
        //Cambiar token dependiendo a quien este manipulando las pruebas
        'Authorization': 'Token ' + this.state.user_data.token,
      },

    })
      .then(response => response.json())
      .then(usuariosJson => this.setState({ table_data: usuariosJson }))
  };

  //Funcion que se utilizara para hacer POST a la API en Usuarios
  POST_usuarios = (ruta, datos) => {
  };

  //Funcion que se utilizara para hacer PUT a la API en Usuarios
  PUT_usuarios = (ruta, id, datos) => {
  };

  //Funcion que se utilizara para hacer DELETE a la API en Usuarios
  DELETE_usuarios(id) {
    this.setState({ delete_dialog: false })
    console.log('Se va a borrar')
    console.log(id)
  };

  // Funcion que crea la tabla con los datos que se hayan recolectado de la API
  create_table = (usuarios) => {


    //Dependiendo del valor que tenga is_active se mostrara un valor distinto en "Estado"
    const print_is_active = (is_active) => {
      if (is_active === true) {
        return (
          <Badge color="" className="badge-dot">
            <i className="bg-success" />
            Activa
          </Badge>
        )
      }
      else if (is_active === false) {
        return (
          <Badge color="" className="badge-dot">
            <i className="bg-danger" />
            Dado de baja
          </Badge>
        )
      };
    };

    // Se regresa el contenido de la tabla con los datos de cada uno 
    // De los registros que contenga la lista "trampas" usando una funcion map()
    return usuarios.map((usuario) => {
      return (
        <tr>
          <th scope="row">{usuario.nombre}</th>
          <td>{usuario.email}</td>
          <td>{usuario.telefono}</td>
          <td>{print_is_active(usuario.is_active)}</td>
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
                  onClick={() => this.setState({ delete_dialog: true, usuario_seleccionado: usuario.idcUsuarios })}
                >
                  Dar de baja
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
      );
    });
  };

  render() {

    return (
      <>
        <Header />
        <ConfirmDelete
          isOpen={this.state.delete_dialog}
          onClose={(e) => this.setState({ delete_dialog: false })}
          onConfirm={() => this.DELETE_usuarios(this.state.usuario_seleccionado)} />
        <Container className="mt--7" fluid>
          {/* Tabla */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <h3 className="mb-0 ml-2">Usuarios</h3>
                    <Button className="ml-3" color="success" type="button" size="sm">
                      <i className="ni ni-fat-add mt-1"></i>
                    </Button>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Nombre</th>
                      <th scope="col">email</th>
                      <th scope="col">Telefono</th>
                      <th scope="col">Estado</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {/* Se llama a la funcion que crea la tabla */}
                    {this.create_table(this.state.table_data)}
                  </tbody>
                </Table>
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem className="disabled">
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="active">
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          2 <span className="sr-only">(current)</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          3
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
};

export default TablaUsuarios;