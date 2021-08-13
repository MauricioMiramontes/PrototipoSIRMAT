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
import React, {Component}  from "react";

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
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import DeleteModal from "components/Modals/DeleteModal.js";

// Se importan los datos de prueba para la tabla
import user from "datos_prueba/datos_Sesion.js"

class TablaEspecie extends Component {

  constructor(props) {
    super(props);
    this.state = {
      table_data: [],
      user_data: user,
      especie_seleccionada: null,

      // Determina si esta o no mostrandose los modales
      add_modal: false,
      edit_modal: false,
      delete_modal: false,
      detail_modal: false,

      //Datos del formulario
      form_data: {

      },
      detail_form_data: {},
    };
    //Functiones
    this.toggle_delete_modal = this.toggle_delete_modal.bind(this);
    this.DELETE_especies = this.DELETE_especies.bind(this);
    this.POST_especies = this.POST_especies.bind(this);
    this.PUT_especies = this.PUT_especies.bind(this);
    this.toggle_add_modal = this.toggle_add_modal.bind(this);
    this.toggle_edit_modal = this.toggle_edit_modal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.clearState = this.clearState.bind(this)

  }

  componentDidMount(){
    const url = "http://127.0.0.1:8081/especies/";
    this.GET_especies(url);

  }
  
  // Funcion para manejar los cambios en el formulario del modal
  handleInputChange(event) {
    // Cada vez que haya un cambio en el formulario se actualizara la variable form_data del estado
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // Se crea una copia de la variable form_data del estado
    var updated_form_data = this.state.form_data;

    updated_form_data['idUsuario'] = this.state.user_data.data.id;
    // Se actualiza la copia con los nuevos valores
    updated_form_data[name] = value;

    // Se actualiza el valor de la variable vieja con el de la copia actualizada
    this.setState({ form_data: updated_form_data });
    console.log(this.state.form_data)
  }

  // Limpia el state de form_data
  clearState() {
    this.setState({ form_data: {}, especie_seleccionada: null })
  }

  // Muestra u Oculta el modal para agregar registro
  toggle_add_modal() {
    this.clearState();
    var value = this.state.add_modal;
    this.setState({ add_modal: !value });
  }

  // Muestra u Oculta el modal para editar un registro
  toggle_edit_modal() {
    this.clearState()
    var value = this.state.edit_modal;
    this.setState({ edit_modal: !value });
  }

  // Muestra u Oculta el modal para eliminar un registro
  toggle_delete_modal() {
    this.clearState();
    var value = this.state.delete_modal;
    this.setState({ delete_modal: !value });
  }



  // Funcion que se utilizara para hacer un GET a la API en etiquetado
  GET_especies = (ruta) => {
    fetch(ruta, {
      method: "GET",
      headers: {
        //Cambiar token dependiendo a quien este manipulando las pruebas
        Authorization: "Token " + this.state.user_data.token,
      },
    })
      .then((response) => response.json())
      .then((especiesJson) => this.setState({ table_data: especiesJson }));
  };

  //Funcion que se utilizara para hacer POST a la API en etiquetado
  POST_especies (event) {
    // Esto solo es pare que no se recargue la pagina cuando mandamos el formulario
    event.preventDefault();

    // Variables utiles
    var status_response;
    const url = "http://127.0.0.1:8081/especies/";

    // Peticion a la API
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Token " + this.state.user_data.token,
        "Content-Type": "application/json",
      },
      // Se toman los datos de la variable form_data del estado
      body: JSON.stringify(this.state.form_data),
    })
      .then((response) => {
        status_response = response.status;
        return response.json();
      })
      .then((respuesta_post) => {
        if (status_response === 200) {
          // Para evitar recargar la pagina se toma la respuesta de la API y
          // se agrega directamente al estado.
          // Si la peticion a la API fue un exito
          this.setState({
            table_data: this.state.table_data.concat(respuesta_post),

            // Se limpia la variable form_data
            form_data: {},
          });
          console.log("status: " + status_response);
          console.log(respuesta_post);
        } else {
          // De lo contrario se imprime el error en la consola
          this.setState({
            // Se limpia la variable form_data
            form_data: {},
          });
          console.log("status: " + status_response);
          console.log(respuesta_post);
        }
      });

    // Se esconde el modal de agregar registro
    this.setState({ add_modal: false });
  
  
  };

  //Funcion que se utilizara para hacer PUT a la API en etiquetado
  PUT_especies(event,id) {

    event.preventDefault()

    // Se de la formato a el parametro id
    var params = { "id": id };

    // Variables utiles
    var status_response;

    // Esta variable determina la URL a la que se hara la peticion a la API
    const url = "http://127.0.0.1:8081/especies/?" + new URLSearchParams(params);

    console.log(url)

    // Esta variable determina cual elemento de la lista es el que se va a editar
    var elemento_editar = this.state.table_data.findIndex(element => element['idcEspecie'] === id)

    // Peticion a la API
    fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': 'Token ' + this.state.user_data.token,
        'Content-Type': 'application/json'
      },
      // Se toman los datos de la variable form_data del estado 
      body: JSON.stringify(this.state.form_data)
    })
      .then((response) => {
        status_response = response.status;
        return response.json()
      })
      .then(respuesta_put => {
        if (status_response === 200) {
          // Para evitar recargar la pagina se toma la respuesta de la API y 
          // se agrega directamente al estado.
          // Si la peticion a la API fue un exito
          var updated_table_data = this.state.table_data;

          updated_table_data[elemento_editar] = respuesta_put;

          this.setState({
            table_data: updated_table_data,
            // Se limpia la variable form_data
            form_data: {
            }
          })
          console.log(status_response);
          console.log(respuesta_put);
        }
        else {
          // De lo contrario se imprime el error en la consola
          this.setState({
            // Se limpia la variable form_data
            form_data: {
            }
          })
          console.log("status: " + status_response)
          console.log(respuesta_put)
        }
      })

    this.setState({ edit_modal: false })
    console.log('Se va a actualizar' + id)
    console.log(this.state.form_data)

  };

  //Funcion que se utilizara para hacer DELETE a la API en etiquetado
  DELETE_especies(id) {

    // Se de la formato a el parametro id
    var params = { "id": id };

    // Se crea la URL para mandar a la API
    const url = "http://127.0.0.1:8081/especies/?" + new URLSearchParams(params);
    var status_response;
    var elemento_eliminar = this.state.table_data.findIndex(element => element['idcEspecie'] === id)

    // Se esconde el mensaje de confirmacion para eliminar
    this.setState({ delete_modal: false })

    //Se hace la llamada a la API
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Token ' + this.state.user_data.token,
      },
    })
      .then(response => {
        status_response = response.status;
        return response.json()
      })
      .then(respuesta_delete => {

        if (status_response === 200) {
          // Para evitar recargar la pagina se toma la respuesta de la API y 
          // se agrega directamente al estado.
          // Si la peticion a la API fue un exito
          console.log("status: " + status_response)
          console.log(respuesta_delete)
          var updated_table_data = this.state.table_data;
          updated_table_data[elemento_eliminar]['is_active'] = false;
          this.setState({ table_data: updated_table_data })
        }
        else {
          // De lo contrario se imprime el error en la consola
          console.log("status: " + status_response)
          console.log(respuesta_delete)
        }
      })

  };

  // Funcion que crea la tabla con los datos que se hayan recolectado de la API
  create_table = (especie) => {
  

    //Dependiendo del valor que tenga is_active se mostrara un valor distinto en "Estado"
    const print_is_active = (is_active) => {
      if (is_active === true) {
        return (
          <Badge color="" className="badge-dot">
            <i className="bg-success" />
            Activo
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
    // De los registros que contenga la lista "especies" usando una funcion map()
    return especie.map((especie) => {
      return (
        <tr key={especie.idcEspecie}>
          <th scope="row">{especie.idcEspecie}</th>
          <td>{especie.especie}</td>
          <td>{print_is_active(especie.is_active)}</td>
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
                  onClick={() => {
                    this.toggle_edit_modal();
                    this.setState({
                      especie_seleccionada: especie.idcEspecie,
                      form_data: {
                        id: especie.idcEspecie,
                        especie: especie.especie
                      },
                    });
                  }}
                >
                  Editar
                </DropdownItem>
                <DropdownItem
                  href="#pablo"
                  onClick={() => 
                    this.setState({
                      delete_modal: true,
                      especie_seleccionada: especie.idcEspecie,
                    })
                  }
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
        {/* Modal de confirmacion para borrar */}
        <DeleteModal
          isOpen={this.state.delete_modal}
          toggle={() => this.toggle_delete_modal()}
          onConfirm={() => this.DELETE_especies(this.state.especie_seleccionada)}
        />
        {/* Modal para agregar nuevo registro */}
        <Modal
          isOpen={this.state.add_modal}
          toggle={() => this.toggle_add_modal()}
        >
          <ModalHeader tag="h3" toggle={() => this.toggle_add_modal()}>
            Agregar nueva especie <i className="ni ni-building" />
          </ModalHeader>
          <ModalBody>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-square-pin" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Especie"
                    type="text"
                    name="especie"
                    onChange={this.handleInputChange}
                  />
                </InputGroup>
              </FormGroup>
              <Row className="justify-content-end mr-1">
                <Button
                  color="primary"
                  type="submit"
                  onClick={(e) => this.POST_especies(e)}
                >
                  Agregar
                </Button>
                <Button
                  color="secondary"
                  onClick={() => {
                    this.toggle_add_modal();
                    this.setState({ form_data: {} });
                  }}
                >
                  Cancel
                </Button>
              </Row>
            </Form>
          </ModalBody>
        </Modal>

        {/* Modal para editar un registro */}
        <Modal
          isOpen={this.state.edit_modal}
          toggle={() => this.toggle_edit_modal()}
        >
          <ModalHeader tag="h3" toggle={() => this.toggle_edit_modal()}>
            Editar especie <i className="ni ni-building" />
          </ModalHeader>
          <ModalBody>
            <Form role="form">

              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-square-pin" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={this.state.form_data.especie}
                    type="text"
                    name="especie"
                    onChange={this.handleInputChange}
                  />
                </InputGroup>
              </FormGroup>
              <Row className="justify-content-end mr-1">
                <Button
                  color="primary"
                  type="submit"
                  onClick={(e) =>
                    this.PUT_especies(e, this.state.especie_seleccionada)
                  }
                >
                  Editar
                </Button>
                <Button
                  color="secondary"
                  onClick={() => {
                    this.toggle_edit_modal();
                    this.setState({ form_data: {} });
                  }}
                >
                  Cancel
                </Button>
              </Row>
            </Form>
          </ModalBody>
        </Modal>

        <Container className="mt--7" fluid>
          {/* Tabla */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <h3 className="mb-0 ml-2">Especie</h3>
                    <Button className="ml-3" color="success" type="button" size="sm" onClick={() => this.toggle_add_modal()}>
                      <i className="ni ni-fat-add mt-1"></i>
                    </Button>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">Especie</th>
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

export default TablaEspecie;
