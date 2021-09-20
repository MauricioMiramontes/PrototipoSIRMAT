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
      mostrar_data_muestras: true,
      bar_table_data_1: {
        labels: [],
        datasets: [
          {
            label: "Mes Actual ",
            data: [],
            maxBarThickness: 10,
          },
          {
            label: "Mes Pasado ",
            data: [],
            maxBarThickness: 10,
          }
        ],
      },
      bar_table_data_2: {
        labels: [],
        datasets: [
          {
            label: "Mes Actual ",
            data: [],
            maxBarThickness: 10,
          },
          {
            label: "Mes Pasado ",
            data: [],
            maxBarThickness: 10,
          }
        ],
      },
      line_table_data_muestra_mes: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Muestras en el mes ",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },
      line_table_data_muestra_semanas: {
        labels: [],
        datasets: [
          {
            label: "Muestras en la semana ",
            data: [],
          },
        ],
      },
      divStyle: {
        overflowY: 'scroll',
        height: '400px',
        position: 'relative'
      }
    }

    this.GET_nombres_especies = this.GET_nombres_especies.bind(this)
    this.GET_detalles_muestras = this.GET_detalles_muestras.bind(this)
    this.toggle_elegir_data_linea = this.toggle_elegir_data_linea.bind(this)
    this.calcular_numero_semanas = this.calcular_numero_semanas.bind(this)
  }

  componentDidMount() {
    this.GET_nombres_especies()
    this.GET_detalles_muestras()
  }

  toggle_elegir_data_linea(e, boton) {
    e.preventDefault()
    var value = this.state.mostrar_data_muestras;

    if (this.state.mostrar_data_muestras !== boton) {
      this.setState({ mostrar_data_muestras: !value });
      console.log(this.state.mostrar_data_muestras)
    }
  }

  calcular_numero_semanas(fecha) {

    var primera_fecha_mes = new Date(fecha.getFullYear(), fecha.getMonth(), 1)
    var primer_dia_mes = primera_fecha_mes.getDay()
    var ultima_fecha_mes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0)
    var semanas = {
      labels: [],
      fechas: []
    }

    var dias_de_la_primera_semana = (6 - primer_dia_mes)

    semanas.labels.push("Sem1")
    semanas.fechas.push([primera_fecha_mes.getDate(), primera_fecha_mes.getDate() + dias_de_la_primera_semana])

    var numero_semana = 1

    for (let dia_mes = semanas.fechas[0][1]; dia_mes <= ultima_fecha_mes.getDate(); dia_mes++) {
      var fecha_mes = new Date(fecha.getFullYear(), fecha.getMonth(), dia_mes)

      if (fecha_mes.getDay() === 0) {
        semanas.labels.push("Sem" + (numero_semana + 1))
        if ((ultima_fecha_mes.getDate() - dia_mes) <= 7) {
          semanas.fechas.push([fecha_mes.getDate(), (ultima_fecha_mes.getDate() - dia_mes) + fecha_mes.getDate()])
        }
        else {
          semanas.fechas.push([fecha_mes.getDate(), fecha_mes.getDate() + 6])
        }
        numero_semana = numero_semana + 1
      }
    }

    return semanas
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
          var numeroData_1_pasado = []
          var numeroData_2 = []
          var numeroData_2_pasado = []

          for (let i = 0; i < 17; i++) {
            const nombre = especiesJson[i].especie;
            nombresEspecies_1.push(nombre)
            numeroData_1.push(0)
            numeroData_1_pasado.push(0)
          }
          for (let i = 17; i < especiesJson.length; i++) {
            const nombre = especiesJson[i].especie;
            nombresEspecies_2.push(nombre)
            numeroData_2.push(0)
            numeroData_2_pasado.push(0)
          }

          var Nueva_Data_1 = [
            {
              label: "Mes Actual ",
              data: numeroData_1,
              maxBarThickness: 10,
            },
            {
              label: "Mes Pasado ",
              data: numeroData_1_pasado,
              maxBarThickness: 10,
            }
          ]

          var Nueva_Data_2 = [

            {
              label: "Mes Actual ",
              data: numeroData_2,
              maxBarThickness: 10,
            },
            {
              label: "Mes Pasado ",
              data: numeroData_2_pasado,
              maxBarThickness: 10,
            }

          ]

          this.setState({
            bar_table_data_1: {
              labels: this.state.bar_table_data_1.labels.concat(nombresEspecies_1),
              datasets: Nueva_Data_1
            },

            bar_table_data_2: {
              labels: this.state.bar_table_data_2.labels.concat(nombresEspecies_2),
              datasets: Nueva_Data_2
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

                var listaDetallesActuales = {}
                var listaDetallesPasados = {}
                var fecha_actual = new Date()


                for (let i = 0; i < detallesJson.length; i++) {
                  const especies = detallesJson[i].Especies
                  var fecha_muestra = new Date(detallesJson[i].horaFechaCaptura)


                  for (let j = 0; j < especies.length; j++) {
                    if (fecha_actual.getMonth() === fecha_muestra.getMonth()) {
                      if (typeof (listaDetallesActuales[especies[j].especie]) === "undefined") {
                        listaDetallesActuales[especies[j].especie] = parseInt(especies[j].cantidad, 10)
                      }
                      else {
                        listaDetallesActuales[especies[j].especie] = listaDetallesActuales[especies[j].especie] + parseInt(especies[j].cantidad, 10)
                      }
                    }
                    else if ((fecha_actual.getMonth() - 1) === fecha_muestra.getMonth() ||
                      (fecha_actual.getMonth() === 0 && ((fecha_actual.getYear() - 1) === fecha_muestra.getYear() && fecha_muestra.getMonth() === 11))) {
                      if (typeof (listaDetallesPasados[especies[j].especie]) === "undefined") {
                        listaDetallesPasados[especies[j].especie] = parseInt(especies[j].cantidad, 10)
                      }
                      else {
                        listaDetallesPasados[especies[j].especie] = listaDetallesPasados[especies[j].especie] + parseInt(especies[j].cantidad, 10)
                      }
                    }
                  }
                }

                var copia_data_actual = this.state.bar_table_data_1.datasets[0].data
                var copia_data_pasada = this.state.bar_table_data_1.datasets[1].data

                for (let i = 0; i < this.state.bar_table_data_1.labels.length; i++) {
                  if (typeof (listaDetallesActuales[this.state.bar_table_data_1.labels[i]]) === "undefined") {
                    { }
                  }
                  else {
                    copia_data_actual = this.state.bar_table_data_1.datasets[0].data
                    var copia_labels = this.state.bar_table_data_1.labels

                    copia_data_actual[i] = listaDetallesActuales[this.state.bar_table_data_1.labels[i]]
                  }

                  if (typeof (listaDetallesPasados[this.state.bar_table_data_1.labels[i]]) === "undefined") {
                    { }
                  }
                  else {
                    copia_data_pasada = this.state.bar_table_data_1.datasets[1].data
                    var copia_labels = this.state.bar_table_data_1.labels

                    copia_data_pasada[i] = listaDetallesPasados[this.state.bar_table_data_1.labels[i]]
                  }
                }

                this.setState({
                  bar_table_data_1: {
                    labels: copia_labels,
                    datasets: [
                      {
                        label: "Mes Actual ",
                        data: copia_data_actual,
                        maxBarThickness: 10,
                      },
                      {
                        label: "Mes Pasado ",
                        data: copia_data_pasada,
                        maxBarThickness: 10,
                      }
                    ],
                  }
                })

                var copia_data_actual = this.state.bar_table_data_2.datasets[0].data
                var copia_data_pasada = this.state.bar_table_data_2.datasets[1].data


                for (let i = 0; i < this.state.bar_table_data_2.labels.length; i++) {

                  if (typeof (listaDetallesActuales[this.state.bar_table_data_2.labels[i]]) === "undefined") {
                    { }
                  }
                  else {
                    copia_data_actual = this.state.bar_table_data_2.datasets[0].data
                    var copia_labels = this.state.bar_table_data_2.labels

                    copia_data_actual[i] = listaDetallesActuales[this.state.bar_table_data_2.labels[i]]
                  }
                  if (typeof (listaDetallesPasados[this.state.bar_table_data_2.labels[i]]) === "undefined") {
                    { }
                  }
                  else {
                    copia_data_pasada = this.state.bar_table_data_2.datasets[1].data
                    var copia_labels = this.state.bar_table_data_2.labels

                    copia_data_pasada[i] = listaDetallesPasados[this.state.bar_table_data_2.labels[i]]
                  }
                }

                this.setState({
                  bar_table_data_2: {
                    labels: copia_labels,
                    datasets: [
                      {
                        label: "Mes Actual ",
                        data: copia_data_actual,
                        maxBarThickness: 10,
                      },
                      {
                        label: "Mes Pasado ",
                        data: copia_data_pasada,
                        maxBarThickness: 10,
                      }
                    ],
                  }
                })

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

  GET_detalles_muestras() {

    // Se crea la URL para mandar a la API
    const ruta_detalles = "http://127.0.0.1:8081/detallesmuestra/"
    var status_response

    fetch(ruta_detalles, {
      method: "GET",
      headers: {
        Authorization: "Token " + this.props.user_data.token,
      },
    })
      .then((response) => {
        status_response = response.status;
        return response.json()
      })
      .then((detallesmuestrasJson) => {
        if (status_response === 200) {

          var fecha_actual = new Date()
          var numero_muestras_por_mes = this.state.line_table_data_muestra_mes.datasets[0].data
          var semanas_mes = this.calcular_numero_semanas(fecha_actual)

          var muestras_semanas = {
            labels: semanas_mes.labels,
            datasets: [
              {
                label: "Muestras en la semana ",
                data: [],
              },
            ],
          }

          for (let i = 0; i < muestras_semanas.labels.length; i++) {
            muestras_semanas.datasets[0].data.push(0)
          }

          for (let i = 0; i < detallesmuestrasJson.length; i++) {
            var fecha_muestra = new Date(detallesmuestrasJson[i].horaFechaCaptura)
            if (fecha_muestra.getYear() === fecha_actual.getYear()) {
              numero_muestras_por_mes[fecha_muestra.getMonth()] = numero_muestras_por_mes[fecha_muestra.getMonth()] + 1
            }

            if (fecha_muestra.getMonth() === fecha_actual.getMonth()) {
              // Aqui ordenamos las muestras por semana de este mes
              console.log(fecha_muestra.getDate())
              for (let j = 0; j < semanas_mes.fechas.length; j++) {
                if (fecha_muestra.getDate() >= semanas_mes.fechas[j][0] && fecha_muestra.getDate() <= semanas_mes.fechas[j][1]) {
                  muestras_semanas.datasets[0].data[j] = muestras_semanas.datasets[0].data[j] + 1
                }
              }
              
            }
          }
          this.setState({
            line_table_data_muestra_mes: (canvas) => {
              return {
                labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [
                  {
                    label: "Muestras en el mes",
                    data: numero_muestras_por_mes,
                  },
                ],
              }
            }, 
            line_table_data_muestra_semanas: (canvas) => {
              return {
                labels: muestras_semanas.labels,
                datasets: [
                  {
                    label: "Muestras a la seamana",
                    data: muestras_semanas.datasets[0].data
                  }
                ]
              }
            }
          })
        }
      });
  }

  calcular_aumento(cantidad_actual, cantidad_pasada) {
    if (cantidad_pasada === 0) {
      return 0
    }
    else {
      return ((cantidad_actual - cantidad_pasada) / cantidad_pasada) * 100
    }
  }

  render() {
    return (
      <>

        <Header />
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="5">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        Overview
                      </h6>
                      <h2 className="text-white mb-0">Numero de muestras</h2>
                    </div>
                    <div className="col">
                      <Nav className="justify-content-end" pills>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.mostrar_data_muestras,
                            })}
                            href="#meses"
                            onClick={(e) => {
                              this.toggle_elegir_data_linea(e, true)
                            }}
                          >
                            <span className="d-none d-md-block">Mes</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: !this.state.mostrar_data_muestras,
                            })}
                            data-toggle="tab"
                            href="#semanas"
                            onClick={(e) => {
                              this.toggle_elegir_data_linea(e, false)
                            }}
                          >
                            <span className="d-none d-md-block">Semana</span>
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
                      data={this.state.mostrar_data_muestras ?
                        this.state.line_table_data_muestra_mes
                        :
                        this.state.line_table_data_muestra_semanas
                      }
                      options={chartExample1.options}
                      redraw
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="mb-5 mb-xl-0" xl="7">
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
                  <div style={this.state.divStyle}>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Especie</th>
                        <th scope="col">Numero Registros</th>
                        <th scope="col">% Crecimiento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.bar_table_data_1.labels.map((nombreEspecie, index) => {
                        return (
                          <>
                            <tr>
                              <th scope="row">{nombreEspecie}</th>
                              <td>{this.state.bar_table_data_1.datasets[0].data[index]}</td>
                              <td>
                                {
                                  this.calcular_aumento(this.state.bar_table_data_1.datasets[0].data[index], this.state.bar_table_data_1.datasets[1].data[index]) + "%"
                                }
                              </td>
                            </tr>
                          </>
                        )
                      })}
                      {this.state.bar_table_data_2.labels.map((nombreEspecie, index) => {
                        return (
                          <>
                            <tr>
                              <th scope="row">{nombreEspecie}</th>
                              <td>{this.state.bar_table_data_2.datasets[0].data[index]}</td>
                              <td>
                                {
                                  this.calcular_aumento(this.state.bar_table_data_2.datasets[0].data[index], this.state.bar_table_data_2.datasets[1].data[index]) + "%"
                                }
                              </td>
                            </tr>
                          </>
                        )
                      })}
                    </tbody>
                  </div>
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
                      redraw
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