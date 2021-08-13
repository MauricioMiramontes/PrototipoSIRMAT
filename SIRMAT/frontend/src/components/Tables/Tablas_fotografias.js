import React, { Component } from "react";
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

// Se importan los datos de prueba para la tabla
import user from "datos_prueba/datos_Sesion.js";
import DeleteModal from "components/Modals/DeleteModal.js";

class TablaFotografias extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table_data: [],
      fotografia_seleccionada: null,
      user_data: user,

      // Determina si esta o no mostrandose los modales
      add_modal: false,
      edit_modal: false,
      delete_modal: false,
      detail_modal: false,

      //Datos del formulario
      form_data: {
      }
    };

    //Funciones 
    this.POST_fotografias = this.POST_fotografias.bind(this);
    this.PUT_fotografias = this.PUT_fotografias.bind(this);
    this.DELETE_fotografias = this.DELETE_fotografias.bind(this);
    this.toggle_add_modal = this.toggle_add_modal.bind(this);
    this.toggle_edit_modal = this.toggle_edit_modal.bind(this);
    this.toggle_delete_modal = this.toggle_delete_modal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  componentDidMount() {
    this.GET_fotografias()
  }

  // Limpia el estado del componente
  clearState() {
    this.setState({
      form_data: {},
      fotografia_seleccionada: null
    })
  }

  // Esta funcion le da formato a la imagen antes de enviarla
  handleImageChange(event) {
    // Darle formato a la imagen

    const target = event.target;
    const file = target.files[0];
    const name = target.name;

    // Se crea una copia de la variable form_data del estado
    var updated_form_data = this.state.form_data;

    // Se actualiza la copia con los nuevos valores
    updated_form_data[name] = file;

    this.setState({ form_data: updated_form_data })
    console.log(this.state.form_data)
  }

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

  // Muestra u Oculta el modal para agregar registro
  toggle_add_modal() {
    this.clearState()
    var value = this.state.add_modal
    this.setState({ add_modal: !value })
  };

  // Muestra u Oculta el modal para editar un registro
  toggle_edit_modal() {
    this.clearState()
    var value = this.state.edit_modal
    this.setState({ edit_modal: !value })
  };

  // Muestra u Oculta el modal para elminar un registro
  toggle_delete_modal() {
    this.clearState()
    var value = this.state.delete_modal
    this.setState({ delete_modal: !value })
  }

  // Funcion que se utilizara para hacer GET a la API en fotografias
  GET_fotografias() {

    // Se de la formato a el parametro id
    var params = { muestra: this.props.muestra }

    // Se crea la URL para mandar a la API

    // Variables utiles
    const ruta_fotografias = "http://127.0.0.1:8081/fotografias/?" + new URLSearchParams(params);
    var status_response

    fetch(ruta_fotografias, {
      method: "GET",
      headers: {
        Authorization: "Token " + this.state.user_data.token,
      },
    })
      .then((response) => {
        status_response = response.status;
        return response.json()
      })
      .then((fotografiasJson) => {
        if (status_response === 200) {
          this.setState({ table_data: fotografiasJson })
        }
      });
  }

  //Funcion que se utilizara para hacer POST a la API en table_data
  POST_fotografias(event) {

    // Esto solo es pare que no se recargue la pagina cuando mandamos el formulario
    event.preventDefault()

    // Se agrega la muestra a los datos del formulario
    var updated_form_data = this.state.form_data;
    updated_form_data["idMuestra"] = this.props.muestra;
    this.setState({ form_data: updated_form_data });

    // Datos del formulario
    const datos_formulario = new FormData()

    for (const name in this.state.form_data) {
      datos_formulario.append(name, this.state.form_data[name])
    }

    // Variables utiles
    var status_response
    const url = "http://127.0.0.1:8081/fotografias/";

    // Peticion a la API
    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Token ' + this.state.user_data.token,
      },
      // Se toman los datos de la variable form_data del estado 
      body: datos_formulario
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
          console.log("status: " + status_response)
          console.log(respuesta_post)
        }
        else {
          console.log("status: " + status_response)
          console.log(respuesta_post)
        }
      })

  }

  //Funcion que se utilizara para hacer PUT a la API en Fotografias
  PUT_fotografias(event, id) {

    event.preventDefault()

    // Se de la formato a el parametro id
    var params = { "id": id };

    // Variables utiles
    var status_response;

    // Esta variable determina la URL a la que se hara la peticion a la API
    const url = "http://127.0.0.1:8081/fotografias/?" + new URLSearchParams(params);

    // Esta variable determina cual elemento de la lista es el que se va a editar
    var elemento_editar = this.state.table_data.findIndex(element => element['idFotografias'] === id)

    // Datos del formulario
    const datos_formulario = new FormData()

    for (const name in this.state.form_data) {
      datos_formulario.append(name, this.state.form_data[name])
    }

    // Peticion a la API
    fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': 'Token ' + this.state.user_data.token,
      },
      // Se toman los datos de la variable form_data del estado 
      body: datos_formulario,
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

          this.setState({ table_data: updated_table_data })
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

  DELETE_fotografias(event, id){

    event.preventDefault()

    // Se de la formato a el parametro id
    var params = { "id": id };

    // Se crea la URL para mandar a la API
    const url = "http://127.0.0.1:8081/fotografias/?" + new URLSearchParams(params);
    var status_response;
    var elemento_eliminar = this.state.table_data.findIndex(element => element['idFotografias'] === id)

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

          // Creamos una copia del estado
          var updated_table_data = this.state.table_data;

          // Modificamos la copia
          updated_table_data.splice(elemento_eliminar, 1)

          // Sobre escribimos el estado con la copia actualizada
          this.setState({ table_data: updated_table_data })
        }
        else {
          // De lo contrario se imprime el error en la consola
          console.log("status: " + status_response)
          console.log(respuesta_delete)
        }
      })
  }

  format_image(string_image) {
    const base_url = "http://127.0.0.1:8081";
    var string_correcta = base_url + string_image
    return string_correcta
  }

  // Se crea la tabla de fotografias
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

    // // Si la variable "fotografias" del estado esta vacia se imprime un mensaje correspondiente
    // // de lo contrario se crea la lista con las fotografias
    if (this.state.table_data.length === 0) {
      return (
        <>
          <h3 className="ml-6 mt-4 mb-4">No se tiene ninguna fotografia registrada en esta muestra </h3>
        </>
      )
    }
    else {
      return this.state.table_data.map((foto) => {

        return (
          <tr key={foto.idFotografias}>
            <th scope="row">
              <Media>
                <a
                  className="avatar rounded-circle mr-3"
                  href={"127.0.0.1:8080/projectos/" + this.props.muestra + "task/" + foto.idFotografias} 
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
                    onClick={(e) => {
                      e.preventDefault();
                      this.toggle_edit_modal()
                      this.setState({
                        fotografia_seleccionada: foto.idFotografias,
                        form_data: {
                          zoom: foto.zoom,
                          resolucion: foto.resolucion,
                          idCamara: foto.idCamara,
                          fileFoto: foto.fileFoto,
                          etiquetado: foto.etiquetado,
                          idMuestra: foto.idMuestra
                        }
                      })
                    }}
                  >
                    Editar
                  </DropdownItem>
                  <DropdownItem
                    href="#pablo"
                    onClick={(e) => {
                      e.preventDefault()
                      this.toggle_delete_modal()
                      this.setState({fotografia_seleccionada:foto.idFotografias})
                    }}
                  >
                    Eliminar
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </td>
          </tr>
        );
      });
    }
  }

  render() {
    return (
      <>

        <DeleteModal
          isOpen={this.state.delete_modal}
          toggle={() => this.toggle_delete_modal()}
          onConfirm={(e) => this.DELETE_fotografias(e, this.state.fotografia_seleccionada)}
        />

        {/* Modal para agregar nuevo registro */}

        <Modal isOpen={this.state.add_modal} toggle={() => this.toggle_add_modal()}>
          <ModalHeader tag="h3" toggle={() => this.toggle_add_modal()}>Agregar nueva fotografia <i className="ni ni-camera-compact" /></ModalHeader>
          <ModalBody>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-zoom-split-in" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Zoom"
                    type="text"
                    name="zoom"
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
                      <i className="ni ni-camera-compact mr-3" />
                      Camara:
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder=" Camara"
                    type="select"
                    name="idCamara"
                    onChange={this.handleInputChange}>
                    <option>Aqui</option>
                    <option>Iran</option>
                    <option>Las</option>
                    <option>Camaras</option>
                    <option>Registradas</option>
                    <option>1</option>
                  </Input>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <Input
                    placeholder="Fotografia"
                    type="file"
                    name="fileFoto"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={this.handleImageChange} />
                </InputGroup>
              </FormGroup>
              <Row className="justify-content-end mr-1">
                <Button color="primary" type="submit" onClick={(e) => this.POST_fotografias(e)}>Agregar</Button>
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

        {/*Modal para editar un nuevo registro*/}
        <Modal isOpen={this.state.edit_modal} toggle={() => this.toggle_edit_modal()}>
          <ModalHeader tag="h3" toggle={() => this.toggle_edit_modal()}>Editar Fotografia <i className="ni ni-image" /></ModalHeader>
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
                    value={this.state.form_data.zoom}
                    type="text"
                    name="zoom"
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
                    value={this.state.form_data.resolucion}
                    type="text"
                    name="resolucion"
                    onChange={this.handleInputChange} />
                </InputGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-camera-compact" />
                        Camara:
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Camara"
                      type="select"
                      name="idCamara"
                      onChange={this.handleInputChange}>
                      <option>Aqui</option>
                      <option>Iran</option>
                      <option>Las</option>
                      <option>Camaras</option>
                      <option>Registradas</option>
                      <option>1</option>
                    </Input>
                  </InputGroup>
                </FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <Input
                    value={this.state.form_data.fotografia_seleccionada}
                    type="file"
                    name="fileFoto"
                    onChange={this.handleImageChange} />
                </InputGroup>
              </FormGroup>
              <Row className="justify-content-end mr-1">
                <Button color="primary" type="submit" onClick={(e) => this.PUT_fotografias(e, this.state.fotografia_seleccionada)}>Editar</Button>
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
      </>
    );
  }
}

export default TablaFotografias;