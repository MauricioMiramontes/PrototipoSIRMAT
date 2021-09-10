import React, { Component } from "react";
// Esta importacion se tiene que hacer en todas las tablas
import { connect } from "react-redux";

// Importamos la funcion necesaria para agregar history a el componente con estado
import { withRouter } from "react-router";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

class InicioPrueba extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bar_table_data_1: {
        labels: [],
        datasets: [
          {
            label: "Especies",
            data: [],
            maxBarThickness: 10,
          }
        ],
      },
      bar_table_data_2: {
        labels: [],
        datasets: [
          {
            label: "Especies",
            data: [],
            maxBarThickness: 10,
          }
        ],
      },
      line_table_data: {
        labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Muestras",
            data: [],
          },
        ],
      }
    }

    this.GET_nombres_especies = this.GET_nombres_especies.bind(this)
  }

  componentDidMount() {
    this.GET_nombres_especies()
  }

  GET_nombres_especies() {

    const urlEspecies = "http://127.0.0.1:8081/especies/";
    const urlDetalles = "http://127.0.0.1:8081/detallesmuestra/";

    const { history } = this.props;

    // Variables utiles
    var status_response;
    fetch(urlEspecies, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + this.props.user_data.token,
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

          console.log("status Especies : " + status_response)
          console.log(especiesJson)

          var nombresEspecies_1 = []
          var nombresEspecies_2 = []
          var numeroData_1 = []
          var numeroData_2 = []


          for (let i = 0; i < 17; i++) {
            const nombre = especiesJson[i].especie;
            nombresEspecies_1.push(nombre)
            numeroData_1.push(0)
          }
          for (let i = 17; i < especiesJson.length; i++) {
            const nombre = especiesJson[i].especie;
            nombresEspecies_2.push(nombre)
            numeroData_2.push(0)
          }

          console.log(numeroData_1)
          this.setState({
            bar_table_data_1: {
              labels: this.state.bar_table_data_1.labels.concat(nombresEspecies_1),
              datasets: [
                {
                  label: "Especies",
                  data: numeroData_1,
                  maxBarThickness: 10,
                }
              ],
            },
            bar_table_data_2: {
              labels: this.state.bar_table_data_2.labels.concat(nombresEspecies_2),
              datasets: [
                {
                  label: "Especies",
                  data: numeroData_2,
                  maxBarThickness: 10,
                }
              ],
            },
          })

          fetch(urlDetalles, {
            method: 'GET',
            headers: {
              'Authorization': 'Token ' + this.props.user_data.token,
              'Content-Type': 'application/json'
            },
            // Se toman los datos de la variable form_data del estado 
          })
            .then((response) => {
              status_response = response.status;
              return response.json()
            })
            .then((detallesJson) => {
              if (status_response === 200) {
                console.log("status detalles: " + status_response)
                console.log(detallesJson)

                var listaDetalles = {}

                for (let i = 0; i < detallesJson.length; i++) {
                  const especies = detallesJson[i].Especies

                  for (let j = 0; j < especies.length; j++) {
                    if (typeof (listaDetalles[especies[j].especie]) === "undefined") {
                      listaDetalles[especies[j].especie] = parseInt(especies[j].cantidad, 10)
                    }
                    else {
                      listaDetalles[especies[j].especie] = listaDetalles[especies[j].especie] + parseInt(especies[j].cantidad, 10)
                    }
                  }                  
                }

                for (let i = 0; i < this.state.bar_table_data_1.labels.length; i++) {
                  if (typeof (listaDetalles[this.state.bar_table_data_1.labels[i]]) === "undefined") {
                    continue
                  }
                  else {
                    var copia_data = this.state.bar_table_data_1.datasets[0].data
                    var copia_labels = this.state.bar_table_data_1.labels

                    copia_data[i] = listaDetalles[this.state.bar_table_data_1.labels[i]]

                    this.setState({
                      bar_table_data_1: {
                        labels: copia_labels,
                        datasets: [
                          {
                            label: "Especies",
                            data: copia_data,
                            maxBarThickness: 10,
                          }
                        ],
                      }
                    })
                  }
                }

                for (let i = 0; i < this.state.bar_table_data_2.labels.length; i++) {
                  if (typeof (listaDetalles[this.state.bar_table_data_2.labels[i]]) === "undefined") {
                    continue
                  }
                  else {
                    var copia_data = this.state.bar_table_data_2.datasets[0].data
                    var copia_labels = this.state.bar_table_data_2.labels

                    copia_data[i] = listaDetalles[this.state.bar_table_data_2.labels[i]]

                    this.setState({
                      bar_table_data_2: {
                        labels: copia_labels,
                        datasets: [
                          {
                            label: "Especies",
                            data: copia_data,
                            maxBarThickness: 10,
                          }
                        ],
                      }
                    })
                  }
                }

                console.log(this.state.bar_table_data_1)
                console.log(this.state.bar_table_data_2)
              }
              else {
                console.log("status detalles: " + status_response)
                console.log(detallesJson)
              }
            })

        }
        //Aqui va el if del 403/401
        else if (status_response === 401 || status_response === 403) {
          history.push("/auth/login/")
        }
        else {
          console.log("status especies: " + status_response)
          console.log(especiesJson)
        }
      })
  }

  render() {

    return (
      <>

        <Header />
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="6">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        Overview
                      </h6>
                      <h2 className="text-white mb-0">Sales value</h2>
                    </div>
                    <div className="col">
                      <Nav className="justify-content-end" pills>
                        <NavItem>
                          <NavLink

                            href="#pablo"

                          >
                            <span className="d-none d-md-block">Month</span>
                            <span className="d-md-none">SA</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            data-toggle="tab"
                            href="#pablo"

                          >
                            <span className="d-none d-md-block">Semana</span>
                            <span className="d-md-none">W</span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Line
                      data={this.state.line_table_data}
                      options={chartExample1.options}
                      getDatasetAtEvent={(e) => console.log(e)}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="mb-5 mb-xl-0" xl="6">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Registro de poblacion de especies</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Especie</th>
                      <th scope="col">Numero de registros</th>
                      <th scope="col">% comparado al mes pasado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">/argon/</th>
                      <td>4,569</td>

                      <td>
                        <i className="fas fa-arrow-up text-success mr-3" /> 46,53%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/</th>
                      <td>4,569</td>

                      <td>
                        <i className="fas fa-arrow-up text-success mr-3" /> 46,53%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/Inicio.html</th>
                      <td>3,985</td>

                      <td>
                        <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                        46,53%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/charts.html</th>
                      <td>3,513</td>

                      <td>
                        <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                        36,49%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/tables.html</th>
                      <td>2,050</td>

                      <td>
                        <i className="fas fa-arrow-up text-success mr-3" /> 50,87%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/profile.html</th>
                      <td>1,795</td>
                      <td>
                        <i className="fas fa-arrow-down text-danger mr-3" />{" "}
                        46,53%
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col xl="12">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Cantidad de especies vistas este mes
                      </h6>
                      <h2 className="mb-0">Total de Especies</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Bar
                      data={this.state.bar_table_data_1}
                      options={chartExample2.options}
                        
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col xl="12">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Cantidad de especies vistas este mes
                      </h6>
                      <h2 className="mb-0">Total de Especies</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Bar
                      data={this.state.bar_table_data_2}
                      options={chartExample2.options}
                      redraw
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    )
  }

}

// Creamos un componente conectado que nos proporciona la funcion history
const InicioPruebaConectado = withRouter(InicioPrueba);


const mapStateToProps = (state) => ({
  user_data: state.user.user_data
})

// Si no se tiene mapDispatchToProps entonces se use null como segundo parametro
export default connect(mapStateToProps, null)(InicioPruebaConectado);