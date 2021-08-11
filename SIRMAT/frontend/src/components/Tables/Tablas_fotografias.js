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

// Se importan los datos de prueba para la tabla
import user from "datos_prueba/datos_Sesion.js";
import datos_fotografias from "datos_prueba/datos_Fotografias.js";

class TablaFotografias extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fotografias : false,
      fotografia_seleccionada : null,
      user_data : user
    };
  }


  componentDidMount() {
    this.GET_fotografias()
  }

  // Funcion que se utilizara para hacer GET a la API en fotografias
  GET_fotografias(){

    // Se de la formato a el parametro id
    var params = {muestra: this.props.muestra}

    // Se crea la URL para mandar a la API

    const ruta_fotografias = "http://127.0.0.1:8081/fotografias/?" + new URLSearchParams(params);

    console.log(ruta_fotografias);
    
    fetch(ruta_fotografias, {
      method: "GET",
      headers: {
        Authorization: "Token " + this.state.user_data.token,
      },
    })
      .then((response) => response.json())
      .then((fotografiasJson) => {
        this.setState({ fotografias: fotografiasJson })
      });

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
    console.log(typeof(this.state.fotografias))
    
    
    if(this.state.fotografias.message === "No se encontro ningun elemento que coincida con esa muestra") {
      console.log("Lo que tenemos guardado")
      console.log(this.state.fotografias)
      console.log("Tipo de objeto")
      console.log(typeof (this.state.fotografias))
      return (
        <>
          <h3 className="ml-6 mt-4 mb-4">No se tiene ninguna fotografia registrada en esta muestra </h3>
        </>
      )
    }
    else if (typeof (this.state.fotografias) == "object"){

      console.log("Lo que tenemos guardado")
      console.log(this.state.fotografias)
      console.log("Tipo de objeto")
      console.log(typeof (this.state.fotografias))
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
    else {
      console.log("Lo que tenemos guardado")
      console.log(this.state.fotografias)
      console.log("Tipo de objeto")
      console.log(typeof (this.state.fotografias))
      return (
        <>
          <h3 className="ml-6 mt-4 mb-4">Alguna otra cosa paso </h3>
        </>
      )
    }
  }

  render() {
    return (
      <>

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
      </>
    );
  }
}

export default TablaFotografias;