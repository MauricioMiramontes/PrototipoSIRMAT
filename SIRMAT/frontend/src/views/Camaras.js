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
import { React, Component } from "react";

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

// Se importan los datos de prueba para la tabla
import datos_camaras from "datos_prueba/datos_Camaras.js"

class TablaCamaras extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // Por ahora se toman los datos de prueba
      table_data: datos_camaras
    };
  }

  // Funcion que se utilizara para hacer un GET a la API en Camaras
  GET_camaras = (ruta) => {
  };

  //Funcion que se utilizara para hacer POST a la API en Camaras
  POST_camaras = (ruta, datos) => {
  };

  //Funcion que se utilizara para hacer PUT a la API en Camaras
  PUT_camaras = (ruta, id, datos) => {
  };

  //Funcion que se utilizara para hacer DELETE a la API en Camaras
  DELETE_camaras = (ruta, id) => {
  };

  // Funcion que crea la tabla con los datos que se hayan recolectado de la API
  create_table = (camaras) => {

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
    // De los registros que contenga la lista "camaras" usando una funcion map()
    return camaras.map((camara) => {
      return (
        <tr>
          <th scope="row">{camara.marca}</th>
          <td>{camara.foco}</td>
          <td>{camara.resolucion}</td>
          <td>{print_is_active(camara.is_active)}</td>
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
              <DropdownMenu className="dropdown-menu-arrow" right>
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
  };

  render() {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          {/* Tabla */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <h3 className="mb-0">Camaras</h3>
                    <Button className="ml-3" color="success" type="button" size="sm">
                      <i className="ni ni-fat-add mt-1"></i>
                    </Button>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Marca</th>
                      <th scope="col">Foco</th>
                      <th scope="col">Resolucion</th>
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

export default TablaCamaras;
