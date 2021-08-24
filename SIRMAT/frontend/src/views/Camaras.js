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
import { connect } from "react-redux";
import { update_camara_data } from '../app/slices/camarasSlice.js'

// Necesitamos esto para poder usar la funcion "history"
import { withRouter } from "react-router";

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


class TablaCamaras extends Component {

  constructor(props) {
    super(props);
    this.state = {
      table_data: [],
      user_data: user,
      camara_seleccionada: null,

      // Determina si esta o no mostrandose los modales
      add_modal: false,
      edit_modal: false,
      delete_modal: false,

      //Datos del formulario
      form_data: {
      }
    };

    //Funciones
    this.DELETE_camaras = this.DELETE_camaras.bind(this);
    this.POST_camaras = this.POST_camaras.bind(this);
    this.PUT_camaras = this.PUT_camaras.bind(this);
    this.toggle_add_modal = this.toggle_add_modal.bind(this);
    this.toggle_edit_modal = this.toggle_edit_modal.bind(this);
    this.toggle_delete_modal = this.toggle_delete_modal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  componentDidMount() {
    const url = "http://127.0.0.1:8081/camaras/";
    this.GET_camaras(url);
  }

  // Funcion para manejar los cambios en el formulario del modal
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

  // Limpia el state de form_data
  clearState() {
    this.setState({ form_data: {}, camara_seleccionada: null })
  }

  // Muestra u Oculta el modal para agregar registro
  toggle_add_modal() {
    this.clearState()
    var value = this.state.add_modal
    this.setState({ add_modal: !value })
  };

  // Muestra u Oculta el modal para editar registro
  toggle_edit_modal() {
    this.clearState()
    var value = this.state.edit_modal
    this.setState({ edit_modal: !value })
  };

  // Muestra u Oculta el modal para eliminar un registro
  toggle_delete_modal() {
    this.clearState()
    var value = this.state.delete_modal
    this.setState({ delete_modal: !value })
  }

  // Funcion que se utilizara para hacer un GET a la API en Camaras
  GET_camaras = (ruta) => {

    const { history } = this.props;

    var status_response = null

    fetch(ruta, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + this.props.user_data.token,
      },

    })
      .then(response => {
        status_response = response.status;
        return response.json()
      })
      .then(camarasJson => {
        console.log(status_response)
        console.log(camarasJson)

        if (status_response === 200) {
          this.setState({ table_data: camarasJson })
        }
        else if (status_response === 401 || status_response === 403) {
          history.push("/auth/login/")
        }
      })
  };

  //Funcion que se utilizara para hacer POST a la API en Camaras
  POST_camaras(event) {

    // Esto solo es pare que no se recargue la pagina cuando mandamos el formulario
    event.preventDefault()

    // Variables utiles
    var status_response
    const url = "http://127.0.0.1:8081/camaras/";
    const { update_camara_data } = this.props;

    // Peticion a la API
    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Token ' + this.props.user_data.token,
        'Content-Type': 'application/json'
      },
      // Se toman los datos de la variable form_data del estado 
      body: JSON.stringify(this.state.form_data)
    })
      .then((response) => {
        status_response = response.status;
        return response.json()
      })
      .then(respuesta_post => {
        if (status_response === 200) {
          // Para evitar recargar la pagina se toma la respuesta de la API y 
          // se agrega directamente al estado.
          // Si la peticion a la API fue un exito
          this.setState({
            table_data: this.state.table_data.concat(respuesta_post),
          })

          // Se crea una copia de la cajita
          var updated_store = this.props.camaras

          console.log("Copia de la caja")
          console.log(updated_store)

          // Creamos el elemento a agregar a la cajita 
          // Usando los datos de le nueva camara agregada
          var elemento = [{
            'nombre': respuesta_post.marca,
            'id': respuesta_post.idcCamaras
          }]

          console.log("Elemento nuevo")
          console.log(elemento)

          // Agregamos el nuevo elmento a la copia de lista
          var updated_store = updated_store.concat(elemento)

          console.log("Copia actualizada")
          console.log(updated_store)

          // Actualizamos la lista con la copia nueva
          update_camara_data(updated_store)

          console.log("status: " + status_response)
          console.log(respuesta_post)
        }
        else {
          console.log("status: " + status_response)
          console.log(respuesta_post)
        }
      })

    // Se esconde el modal para agregar
    this.toggle_add_modal()
  };

  //Funcion que se utilizara para hacer PUT a la API en Camaras
  PUT_camaras(event, id) {

    event.preventDefault()

    // Se de la formato a el parametro id
    var params = { "id": id };

    // Variables utiles
    var status_response;

    // Esta variable determina la URL a la que se hara la peticion a la API
    const url = "http://127.0.0.1:8081/camaras/?" + new URLSearchParams(params);

    // Esta variable determina cual elemento de la lista es el que se va a editar
    var elemento_eliminar = this.state.table_data.findIndex(element => element['idcCamaras'] === id)

    // Peticion a la API
    fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': 'Token ' + this.props.user_data.token,
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

          updated_table_data[elemento_eliminar] = respuesta_put;
          
          this.setState({
            table_data: updated_table_data,
          })
          console.log(status_response);
          console.log(respuesta_put);
        }
        else {
          // De lo contrario se imprime el error en la consola
          console.log("status: " + status_response)
          console.log(respuesta_put)
        }
      })

    this.toggle_edit_modal()
    console.log('Se va a actualizar' + id)
    console.log(this.state.form_data)

  };

  //Funcion que se utilizara para hacer DELETE a la API en Camaras
  DELETE_camaras(id) {

    // Se de la formato a el parametro id
    var params = { "id": id };

    // Se crea la URL para mandar a la API
    const url = "http://127.0.0.1:8081/camaras/?" + new URLSearchParams(params);
    var status_response;
    var elemento_eliminar = this.state.table_data.findIndex(element => element['idcCamaras'] === id)

    //Se hace la llamada a la API
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Token ' + this.props.user_data.token,
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

    // Se esconde el mensaje de confirmacion para eliminar
    this.toggle_delete_modal()
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
        <tr key={camara.idcCamaras}>
          <th scope="row">{camara.marca}</th>
          <td>{camara.foco}</td>
          <td>{camara.resolucion}</td>
          <td>{print_is_active(camara.is_active)}</td>
          <td className="text-right">
            {this.props.user_data.data.is_superuser ?
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
                        camara_seleccionada: camara.idcCamaras,
                        form_data: {
                          marca: camara.marca,
                          foco: camara.foco,
                          resolucion: camara.resolucion,
                          idEstereoscopios: camara.idEstereoscopios,
                        }
                      });
                    }}
                  >
                    Editar
                  </DropdownItem>
                  <DropdownItem
                    href="#pablo"
                    onClick={() => this.setState({ delete_modal: true, camara_seleccionada: camara.idcCamaras })}
                  >
                    Dar de baja
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              :
              <></>
            }
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
          onConfirm={() => this.DELETE_camaras(this.state.camara_seleccionada)}
        />

        {/* Modal para agregar nuevo registro */}
        <Modal isOpen={this.state.add_modal} toggle={() => this.toggle_add_modal()}>
          <ModalHeader tag="h3" toggle={() => this.toggle_add_modal()}>Agregar nueva camara <i className="ni ni-camera-compact" /></ModalHeader>
          <ModalBody>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-shop" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Marca"
                    type="text"
                    name="marca"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-zoom-split-in" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Foco"
                    type="text"
                    name="foco"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-image" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Resolucion"
                    type="text"
                    name="resolucion"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-support-16 mr-3" />
                      Estereoscopio:
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Estetoscopio"
                    type="select"
                    name="idEstereoscopios"
                    onChange={this.handleInputChange}>
                    <option value = "0">Seleccione un estereoscopio</option>
                    {this.props.estereoscopeos.map((estereoscopio) => {
                      if (estereoscopio.is_active === true) {
                        return (
                          <option key={estereoscopio.id} value={estereoscopio.id}>{estereoscopio.nombre}</option>
                        )
                      }
                      else {
                        return (
                          <></>
                        )
                      }
                    })}
                  </Input>
                </InputGroup>
              </FormGroup>
              <Row className="justify-content-end mr-1">
                <Button color="primary" type="submit" onClick={(e) => this.POST_camaras(e)}>Agregar</Button>
                <Button
                  color="secondary"
                  onClick={() => {
                    this.toggle_add_modal();
                    this.setState({ form_data: {} })
                  }}>Cancel</Button>
              </Row>
            </Form>
          </ModalBody>

        </Modal>

        {/* Modal para editar un registro */}
        <Modal isOpen={this.state.edit_modal} toggle={() => this.toggle_edit_modal()}>
          <ModalHeader tag="h3" toggle={() => this.toggle_edit_modal()}>Editar camara <i className="ni ni-camera-compact" /></ModalHeader>
          <ModalBody>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-shop" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={this.state.form_data.marca}
                    type="text"
                    name="marca"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-zoom-split-in" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={this.state.form_data.foco}
                    type="text"
                    name="foco"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-image" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={this.state.form_data.resolucion}
                    type="text"
                    name="resolucion"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-support-16 mr-3" />
                      Estereoscopio:
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder={this.state.form_data.idEstereoscopios}
                    type="select"
                    name="idEstereoscopios"
                    onChange={this.handleInputChange}>
                    <option value = "0">Seleccione un estereoscopio</option>
                    {this.props.estereoscopeos.map((estereoscopio) => {
                      if (estereoscopio.is_active === true) {
                        return (
                          <option key={estereoscopio.id} value={estereoscopio.id}>{estereoscopio.nombre}</option>
                        )
                      }
                      else {
                        return (
                          <></>
                        )
                      }
                    })}
                  </Input>
                </InputGroup>
              </FormGroup>
              <Row className="justify-content-end mr-1">
                <Button color="primary" type="submit" onClick={(e) => this.PUT_camaras(e, this.state.camara_seleccionada)}>Editar</Button>
                <Button
                  color="secondary"
                  onClick={() => {
                    this.toggle_edit_modal();
                    this.setState({ form_data: {} })
                  }}>Cancel</Button>
              </Row>
            </Form>
          </ModalBody>

        </Modal>

        {/* Tabla */}
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <h3 className="mb-0 ml-2">Camaras</h3>
                    {this.props.user_data.data.is_superuser ?
                      <Button className="ml-3" color="success" type="button" size="sm" onClick={() => this.toggle_add_modal()}>
                        <i className="ni ni-fat-add mt-1"></i>
                      </Button>
                      :
                      <></>}
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

const TablaCamarasConectado = withRouter(TablaCamaras)

const mapStateToProps = (state) => ({
  estereoscopeos: state.estereoscopeos.estereoscopeos_data,
  camaras: state.camaras.camaras_data,
  user_data: state.user.user_data
})

function mapDispatchToProps(dispatch) {
  return {
    update_camara_data: (...args) => dispatch(update_camara_data(...args)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(TablaCamarasConectado);
