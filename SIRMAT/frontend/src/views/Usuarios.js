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

// Esta importacion se tiene que hacer en todas las tablas
import { connect } from "react-redux";

// Importamos la funcion necesaria para agregar history a el componente con estado
import { withRouter } from "react-router";

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
import Loading from './Loading.js'
import DeleteModal from "components/Modals/DeleteModal.js";


class TablaUsuarios extends Component {

  constructor(props) {
    super(props);
    this.state = {

      table_data: [],
      usuario_seleccionado: null,
      url_delete: false,
      loading: true,

      // Determina si esta o no mostrandose los modales
      add_modal: false,
      edit_modal: false,
      delete_modal: false,

      //Datos del formulario
      form_data: {
      }
    };

    //Functiones
    this.toggle_delete_modal = this.toggle_delete_modal.bind(this);
    this.toggle_add_modal = this.toggle_add_modal.bind(this);
    this.toggle_edit_modal = this.toggle_edit_modal.bind(this);
    this.DELETE_usuarios = this.DELETE_usuarios.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  componentDidMount() {
    const url = "http://127.0.0.1:8081/usuarios/";
    this.GET_usuarios(url);

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
    this.setState({ form_data: {}, usuario_seleccionado: null, url_delete: false })
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

  // Funcion que se utilizara para hacer un GET a la API en Trampas
  GET_usuarios = (ruta) => {

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
        if (response.status === 204){
          this.setState({loading: false})
        }
        return response.json()
      })
      .then(usuariosJson => {
        console.log(status_response)
        console.log(usuariosJson)

        if (status_response === 200) {
          this.setState({ table_data: usuariosJson })
        }
        else if (status_response === 401 || status_response === 403) {
          history.push("/auth/login/")
        }

        this.setState({ loading: false })
      })
  };

  //Funcion que se utilizara para hacer POST a la API en Usuarios
  POST_usuarios(event) {

    // Esto solo es pare que no se recargue la pagina cuando mandamos el formulario
    event.preventDefault()

    var url = "http://127.0.0.1:8081/usuarios/signup/";

    if (this.state.form_data.tipo === "Administrador") {
      url = "http://127.0.0.1:8081/usuarios/signup_admin/";
    }
    else if (this.state.form_data.tipo === "Empleado") {
      url = "http://127.0.0.1:8081/usuarios/signup_staff/";
    }


    // Variables utiles
    var status_response

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
            table_data: this.state.table_data.concat(respuesta_post.data),
          })
          console.log("status: " + status_response)
          console.log(respuesta_post)
        }
        else {
          // De lo contrario se imprime el error en la consola
          console.log("status: " + status_response)
          console.log(respuesta_post)
        }
      })

    // Se esconde el modal de agregar registro
    this.toggle_add_modal()
  };

  //Funcion que se utilizara para hacer PUT a la API en Usuarios
  PUT_usuarios(event, id) {

    event.preventDefault()

    if (this.state.form_data.tipo === "Administrador") {
      // Se crea una copia de la variable form_data del estado
      var updated_form_data = this.state.form_data;

      // Se actualiza la copia con los nuevos valores
      updated_form_data["is_superuser"] = true;
      updated_form_data["is_staff"] = true;

      // Se actualiza el valor de la variable vieja con el de la copia actualizada
      this.setState({ form_data: updated_form_data });

    }
    else if (this.state.form_data.tipo === "Empleado") {
      // Se crea una copia de la variable form_data del estado
      var updated_form_data = this.state.form_data;

      // Se actualiza la copia con los nuevos valores
      updated_form_data["is_superuser"] = false;
      updated_form_data["is_staff"] = true;

      // Se actualiza el valor de la variable vieja con el de la copia actualizada
      this.setState({ form_data: updated_form_data });
    }
    else if (this.state.form_data.tipo === "Normal") {
      // Se crea una copia de la variable form_data del estado
      var updated_form_data = this.state.form_data;

      // Se actualiza la copia con los nuevos valores
      updated_form_data["is_superuser"] = false;
      updated_form_data["is_staff"] = false;

      // Se actualiza el valor de la variable vieja con el de la copia actualizada
      this.setState({ form_data: updated_form_data });
    }

    // Se de la formato a el parametro id
    var params = { "id": id };

    // Variables utiles
    var status_response;

    // Esta variable determina la URL a la que se hara la peticion a la API
    const url = "http://127.0.0.1:8081/usuarios/?" + new URLSearchParams(params);

    // Esta variable determina cual elemento de la lista es el que se va a editar
    var elemento_editar = this.state.table_data.findIndex(element => element['id'] === id)

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

          updated_table_data[elemento_editar] = respuesta_put;

          this.setState({
            table_data: updated_table_data,
          })
          console.log(status_response);
          console.log(respuesta_put);
        }
        else {
          console.log("status: " + status_response)
          console.log(respuesta_put)
        }
      })

    this.toggle_edit_modal()
    console.log('Se va a actualizar' + id)
    console.log(this.state.form_data)

  };

  //Funcion que se utilizara para hacer DELETE a la API en Usuarios
  DELETE_usuarios(id) {

    // Se de la formato a el parametro id
    var params = { "id": id };

    // Se crea una copia de la variable url_delete del estado
    const se_va_a_eliminar = this.state.url_delete

    // Se crea la URL para mandar a la API
    var url = "http://127.0.0.1:8081/usuarios/?" + new URLSearchParams(params);

    // Si se va a eliminar el usuario en lugar de darlo de baja se cambia la url de destino
    if (se_va_a_eliminar === true) {
      url = "http://127.0.0.1:8081/usuarios/delete_user/?" + new URLSearchParams(params);
    }

    var status_response;
    var elemento_eliminar = this.state.table_data.findIndex(element => element['id'] === id)



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

          // Se crea una copia del estado
          var updated_table_data = this.state.table_data;

          if (se_va_a_eliminar === true) {
            updated_table_data.splice(elemento_eliminar, 1)
          }
          else {
            // Se actualiza esa copia con el registro actualizado
            updated_table_data[elemento_eliminar]['is_active'] = false;
          }

          // Se reemplaza el valor anterior con la copia actualizada 
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


  // Da formato a la fecha antes de mostrarla
  format_date(string_date) {
    var obj_fecha = new Date(string_date)
    var fecha = obj_fecha.toLocaleString("es-MX", { timezone: "GMT-5" })
    return fecha
  }

  // Funcion que crea la tabla con los datos que se hayan recolectado de la API
  create_table = (usuarios) => {


    //Dependiendo del valor que tenga is_active se mostrara un valor distinto en "Estado"
    const print_tipo_usuario = (is_superuser, is_staff, is_active) => {
      if (is_superuser === true && is_staff === true) {
        return (
          <Badge color="" className="badge-dot">
            {is_active ? <i className="bg-success" /> : <i className="bg-danger" />}
            Administrador
          </Badge>
        )
      }
      else if (is_staff === true) {
        return (
          <Badge color="" className="badge-dot">
            {is_active ? <i className="bg-success" /> : <i className="bg-danger" />}
            Capturista
          </Badge>
        )
      }
      else {
        return (
          <Badge color="" className="badge-dot">
            {is_active ? <i className="bg-success" /> : <i className="bg-danger" />}
            Etiquetador
          </Badge>
        )
      }
    };

    // Se regresa el contenido de la tabla con los datos de cada uno 
    // De los registros que contenga la lista "trampas" usando una funcion map()
    return usuarios.map((usuario) => {
      return (
        <tr key={usuario.id}>
          <th scope="row">{usuario.first_name} {usuario.last_name}</th>
          <td>{usuario.email}</td>
          <td>{print_tipo_usuario(usuario.is_superuser, usuario.is_staff, usuario.is_active)}</td>
          <td>{this.format_date(usuario.last_login)}</td>
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
                    onClick={(e) => {

                      this.toggle_edit_modal();
                      this.setState({
                        usuario_seleccionado: usuario.id,
                        form_data: {
                          email: usuario.email,
                          first_name: usuario.first_name,
                          last_name: usuario.last_name,
                          is_superuser: usuario.is_superuser,
                          is_staff: usuario.is_staff,
                          telefono: usuario.telefono,
                        }
                      });
                      console.log(this.state.usuario_seleccionado)
                      console.log(this.state.form_data)
                    }
                    }
                  >
                    Editar
                  </DropdownItem>
                  <DropdownItem
                    href="#pablo"
                    onClick={() => this.setState({ delete_modal: true, usuario_seleccionado: usuario.id })}
                  >
                    Dar de baja
                  </DropdownItem>
                  <DropdownItem
                    href="#pablo"
                    onClick={() => this.setState({ delete_modal: true, usuario_seleccionado: usuario.id, url_delete: true })}
                  >
                    Eliminar usuario
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
          onConfirm={() => this.DELETE_usuarios(this.state.usuario_seleccionado)}
          url_delete={this.state.url_delete}
        />

        {/* Modal para agregar nuevo registro */}
        <Modal isOpen={this.state.add_modal} toggle={() => this.toggle_add_modal()}>
          <ModalHeader tag="h3" toggle={() => this.toggle_add_modal()}>Agregar nuevo usuario <i className="ni ni-single-02" /></ModalHeader>
          <ModalBody>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-circle-08" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Nombre"
                    type="text"
                    name="first_name"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-collection" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Apellidos"
                    type="text"
                    name="last_name"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-key-25" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Contraseña"
                    type="password"
                    name="password"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-mobile-button" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Teléfono"
                    type="text"
                    name="telefono"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-0">
                  <InputGroupAddon addonType="prepend">

                    <InputGroupText>
                      <i className="ni ni-money-coins mr-3" />
                      Tipo
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Tipo"
                    type="select"
                    name="tipo"
                    onChange={this.handleInputChange}>
                    <option>Selecciona una opcion</option>
                    <option>Administrador</option>
                    <option>Capturista</option>
                    <option>Etiquetador</option>
                  </Input>
                </InputGroup>
              </FormGroup>
              <h5 style={{ color: 'red' }} className="mt--3 mb-3 ml-2">Este campo no podrá modificarse en el futuro</h5>
              <Row className="justify-content-end mr-1">
                <Button color="primary" type="submit" onClick={(e) => this.POST_usuarios(e)}>Agregar</Button>
                <Button
                  color="secondary"
                  onClick={() => {
                    this.toggle_add_modal();
                  }}>Cancel</Button>
              </Row>
            </Form>
          </ModalBody>

        </Modal>

        {/* Modal para editar un registro */}
        <Modal isOpen={this.state.edit_modal} toggle={() => this.toggle_edit_modal()}>
          <ModalHeader tag="h3" toggle={() => this.toggle_edit_modal()}>Editar usuario <i className="ni ni-single-02" /></ModalHeader>
          <ModalBody>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={this.state.form_data.email}
                    type="text"
                    name="email"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-circle-08" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={this.state.form_data.first_name}
                    type="text"
                    name="first_name"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-collection" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={this.state.form_data.last_name}
                    type="text"
                    name="last_name"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-key-25" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Nueva contraseña"
                    type="text"
                    name="password"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-mobile-button" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={this.state.form_data.telefono}
                    type="text"
                    name="telefono"
                    onChange={this.handleInputChange} />
                </InputGroup>
              </FormGroup>
              <Row className="justify-content-end mr-1">
                <Button color="primary" type="submit" onClick={(e) => this.PUT_usuarios(e, this.state.usuario_seleccionado)}>Editar</Button>
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
        {this.state.loading ?
          <Loading />

          :

          <Container className="mt--7" fluid>
            <Row>
              <div className="col">
                <Card className="shadow">
                  <CardHeader className="border-0">
                    <Row className="align-items-center">
                      <h3 className="mb-0 ml-2">Usuarios</h3>
                      {this.props.user_data.data.is_superuser ?
                        <Button className="ml-3" color="success" type="button" size="sm" onClick={this.toggle_add_modal}>
                          <i className="ni ni-fat-add mt-1"></i>
                        </Button>
                        :
                        <></>}
                    </Row>
                  </CardHeader>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Email</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Ultima Sesion</th>
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
        }
      </>
    );
  }
};

// Creamos un componente conectado que nos proporciona la funcion history
const TablaUsuariosConectado = withRouter(TablaUsuarios);

const mapStateToProps = (state) => ({
  user_data: state.user.user_data
})
// Si no se tiene mapDispatchToProps entonces se use null como segundo parametro
export default connect(mapStateToProps, null)(TablaUsuariosConectado);
