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
import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { update_user_data } from '../../app/slices/user_data.js'

// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

function AdminNavbar(props) {

  const user_data = useSelector((state) => state.user.user_data)
  const dispatch = useDispatch()
  const history = useHistory();

  function logOut(event) {
    event.preventDefault();
    console.log("Cerramos sesion")

    var ruta = "http://127.0.0.1:8081/usuarios/logout/";

    fetch(ruta, {
      method: 'POST',
      headers: {
        'Authorization': 'Token ' + user_data.token,
      },
    })
      .then(response => {
        return response.json()
      })
      .then(logoutJson => {
        console.log(logoutJson)
        dispatch(update_user_data({ data: [] }))
        history.push('/auth/login/')
      })

  }

  function Redirect(event) {
    // Va a checar si hay o no datos de usuario en cajita y si no los hay
    //redirecciona a Login
    (typeof (user_data.token) === "undefined") ?
      <>
        {console.log("No hay token")}
        {history.push('/auth/login/')}
      </>
      :
      <></>
  }

  // Da formato a la fecha antes de mostrarla
  function format_date(string_date) {

    var obj_fecha = new Date(string_date)
    var fecha = obj_fecha.toLocaleString("es-MX", { timezone: "GMT-5" })
    return fecha

  }

  return (
    <>
      {Redirect()}
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <Media className="ml-2 d-none d-lg-block">
                    <i className="ni ni-circle-08" />{" "}
                    <span className="mb-0 text-sm font-weight-bold">
                      {user_data.data.first_name}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Informacion del usuario</h6>
                </DropdownItem>
                <DropdownItem>
                  <i className="ni ni-single-02" onClick={(e) => e.preventDefault()}/>
                  <span className="mb-0 text-sm font-weight-bold">
                    {user_data.data.first_name + " " + user_data.data.last_name}
                  </span>
                </DropdownItem>
                <DropdownItem>
                  <i className="ni ni-email-83" />
                  <span className="mb-0 text-sm font-weight-bold">
                    {user_data.data.email}
                  </span>
                </DropdownItem>
                <DropdownItem>
                  {user_data.data.is_superuser ?
                    <>
                      <i className="ni ni-money-coins" />
                      <span className="mb-0 text-sm font-weight-bold">
                        Administrador
                      </span>
                    </>
                    :
                    user_data.data.is_staff ?
                      <>
                        <i className="ni ni-money-coins" />
                        <span className="mb-0 text-sm font-weight-bold">
                          Empleado
                        </span>
                      </>
                      :
                      <>
                        <i className="ni ni-money-coins" />
                        <span className="mb-0 text-sm font-weight-bold">
                          Usuario
                        </span>
                      </>
                  }

                </DropdownItem>
                <DropdownItem>
                  <i className="ni ni-calendar-grid-58" />
                  <span>
                    {format_date(user_data.data.last_login)}
                  </span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={(e) => logOut(e)}>
                  <i className="ni ni-user-run" />
                  <span className="font-weight-bold">Cerrar sesion</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
