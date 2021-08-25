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
import { update_user_data } from '../../app/slices/user_data.js'
import { update_camara_data } from '../../app/slices/camarasSlice.js'
import { update_trampa_data } from '../../app/slices/trampasSlice.js'
import { update_estereoscopios_data } from '../../app/slices/estereoscopiosSlice.js'
import { update_especies_data } from '../../app/slices/especiesSlice.js'

// Necesitamos esto para poder usar la funcion "history"
import { withRouter } from "react-router";


// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      form_data: {},
      login_exitoso: true
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.post_Login = this.post_Login.bind(this);
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

  post_Login() {
    var status_response
    const url = "http://127.0.0.1:8081/usuarios/login/";
    const urlCamaras = "http://127.0.0.1:8081/camaras/";
    const urlTrampas = "http://127.0.0.1:8081/trampas/";
    const urlestereoscopios = "http://127.0.0.1:8081/estereoscopios/";
    const urlEspecies = "http://127.0.0.1:8081/especies/";
    const { 
      update_user_data, 
      update_camara_data, 
      update_trampa_data, 
      update_estereoscopios_data, 
      update_especies_data,
      history } = this.props;

    // Peticion a la API
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Se toman los datos de la variable form_data del estado 
      body: JSON.stringify(this.state.form_data)
    })
      .then((response) => {
        status_response = response.status;
        return response.json()
      })
      .then(respuesta_login => {
        if (status_response === 200) {
          // Para evitar recargar la pagina se toma la respuesta de la API y 
          // se agrega directamente al estado.
          // Si la peticion a la API fue un exito

          console.log("status inicio sesion: " + status_response)
          console.log(respuesta_login)

          update_user_data(respuesta_login)

          fetch(urlCamaras, {
            method: 'GET',
            headers: {
              'Authorization': 'Token ' + respuesta_login.token,
              'Content-Type': 'application/json'
            },
            // Se toman los datos de la variable form_data del estado 
          })
            .then((response) => {
              status_response = response.status;
              return response.json()
            })
            .then((camarasJson) => {
              if (status_response === 200) {
                console.log("status camaras: " + status_response)
                console.log(camarasJson)

                var listaCamaras = []

                for (let i = 0; i < camarasJson.length; i++) {
                  const nombre = camarasJson[i].marca;
                  const id = camarasJson[i].idcCamaras
                  const is_active = camarasJson[i].is_active
                  var elemento = {
                    'nombre': nombre,
                    'id': id,
                    'is_active' : is_active
                  }
                  listaCamaras.push(elemento)
                }

                update_camara_data(listaCamaras)
              }
              else {
                console.log("status camaras: " + status_response)
                console.log(camarasJson)
              }
            })

          // Fetch de trampas
          fetch(urlTrampas, {
            method: 'GET',
            headers: {
              'Authorization': 'Token ' + respuesta_login.token,
              'Content-Type': 'application/json'
            },
            // Se toman los datos de la variable form_data del estado 
          })
            .then((response) => {
              status_response = response.status;
              return response.json()
            })
            .then((trampasJson) => {
              if (status_response === 200) {
                console.log("status trampas: " + status_response)
                console.log(trampasJson)

                var listaTrampas = []

                for (let i = 0; i < trampasJson.length; i++) {
                  const nombre = trampasJson[i].nombre;
                  const id = trampasJson[i].idcTrampas
                  const is_active = trampasJson[i].is_active
                  var elemento = {
                    'nombre': nombre,
                    'id': id,
                    'is_active' : is_active
                  }

                  listaTrampas.push(elemento)
                }


                update_trampa_data(listaTrampas)
              }
              else {
                console.log("status trampas: " + status_response)
                console.log(trampasJson)
              }
            })




          // Fetch de estereoscopios
          fetch(urlestereoscopios, {
            method: 'GET',
            headers: {
              'Authorization': 'Token ' + respuesta_login.token,
              'Content-Type': 'application/json'
            },
            // Se toman los datos de la variable form_data del estado 
          })
            .then((response) => {
              status_response = response.status;
              return response.json()
            })
            .then((estereoscopiosJson) => {
              if (status_response === 200) {
                console.log("status estereoscopios: " + status_response)
                console.log(estereoscopiosJson)

                var listaestereoscopios = []

                for (let i = 0; i < estereoscopiosJson.length; i++) {
                  const nombre = estereoscopiosJson[i].marca;
                  const id = estereoscopiosJson[i].idcEstereoscopios
                  const is_active = estereoscopiosJson[i].is_active
                  var elemento = {
                    'nombre': nombre,
                    'id': id,
                    'is_active' : is_active
                  }
                  listaestereoscopios.push(elemento)
                }
                update_estereoscopios_data(listaestereoscopios)
              }
              else {
                console.log("status estereoscopios: " + status_response)
                console.log(estereoscopiosJson)
              }
            })

            // Fetch para especies
            fetch(urlEspecies, {
              method: 'GET',
              headers: {
                'Authorization': 'Token ' + respuesta_login.token,
                'Content-Type': 'application/json'
              },
              // Se toman los datos de la variable form_data del estado 
            })
              .then((response) => {
                status_response = response.status;
                return response.json()
              })
              .then((especiesJson) => {
                if (status_response === 200) {
                  console.log("status especies: " + status_response)
                  console.log(especiesJson)
  
                  var listaEspecies = []
  
                  for (let i = 0; i < especiesJson.length; i++) {
                    const nombre = especiesJson[i].especie;
                    const id = especiesJson[i].idcEspecie
                  
                    var elemento = {
                      'nombre': nombre,
                      'id': id,
                    }

                    listaEspecies.push(elemento)
                  }
  
                  update_especies_data(listaEspecies)
                }
                else {
                  console.log("status especies: " + status_response)
                  console.log(especiesJson)
                }
              })
          // History nos deja redirijir a otra liga sin recargar la pagina
          // En este caso redirigimos a la pantalla de inicio
          history.push('/')
        }
        else {

          this.setState({ login_exitoso: false })
          console.log("status: " + status_response)
          console.log(respuesta_login)
        }
      })

  }


  render() {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-2">
              <div className="text-muted text-center mt-2 mb-1">
                <h3>Iniciar Sesion</h3>
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-4">
              {this.state.login_exitoso ?
                <></>
                :
                <h5 style={{ color: 'red' }} className="mb-4">
                  No se pude iniciar sesion con los datos proporcionados
                </h5>
              }
              <Form role="form">
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      name="username"
                      onChange={this.handleInputChange}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Contraseña"
                      type="password"
                      name="password"
                      onChange={this.handleInputChange}
                    />
                  </InputGroup>

                </FormGroup>
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id=" customCheckLogin"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor=" customCheckLogin"
                  >
                    <span className="text-muted">Recuerdame</span>
                  </label>
                </div>
                <div className="text-center">
                  <Button className="my-4" color="primary" type="button" onClick={() => this.post_Login()}>
                    Iniciar Sesion
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={(e) => {
                  e.preventDefault()
                  this.props.history.push('/auth/register')

                }}
              >
                <small>Crear una nueva cuenta</small>
              </a>
            </Col>
          </Row>
        </Col>
      </>
    )
  }
}

// Creamos un componente conectado que nos proporciona la funcion history
const LoginConectado = withRouter(Login);

function mapDispatchToProps(dispatch) {
  return {
    update_user_data: (...args) => dispatch(update_user_data(...args)),
    update_camara_data: (...args) => dispatch(update_camara_data(...args)),
    update_trampa_data: (...args) => dispatch(update_trampa_data(...args)),
    update_estereoscopios_data: (...args) => dispatch(update_estereoscopios_data(...args)),
    update_especies_data : (...args) => dispatch(update_especies_data(...args)),
  };
}
export default connect(null, mapDispatchToProps)(LoginConectado);
