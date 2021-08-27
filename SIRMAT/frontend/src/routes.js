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
import Inicio from "views/Inicio.js";
import Profile from "views/examples/Profile.js";
import Test from "views/examples/Test.js";
import Loading from "views/Loading.js"
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import TablaCamaras from "views/Camaras.js";
import TablaEstereoscopios from "views/Estereoscopios.js"
import TablaEtiquetado from "views/Especie.js"
import TablaTrampas from "views/Trampas.js";
import TablaMuestras from "views/Muestras.js"
import TablaUsuarios from "views/Usuarios.js"



var routes = [
  {
    path: "/Inicio",
    name: "Inicio",
    icon: "ni ni-tv-2 text-info",
    component: Inicio,
    layout: "/superu",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-info",
    component: Icons,
    layout: "/superu",
  },
  {
    path: "/muestras",
    name: "Muestras",
    icon: "ni ni-ungroup text-info",
    component: TablaMuestras,
    layout: "/superu",
  },
  {
    path: "/trampas",
    name: "Trampas",
    icon: "ni ni-building text-info",
    component: TablaTrampas,
    layout: "/superu",
  },
  {
    path: "/especie",
    name: "Especies",
    icon: "ni ni-tag text-info",
    component: TablaEtiquetado,
    layout: "/superu",
  },
  {
    path: "/camaras",
    name: "Camaras",
    icon: "ni ni-camera-compact text-info",
    component: TablaCamaras,
    layout: "/superu",
  },
  {
    path: "/estereoscopios",
    name: "Estereoscopios",
    icon: "ni ni-zoom-split-in text-info",
    component: TablaEstereoscopios,
    layout: "/superu",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-info",
    component: Register,
    layout: "/auth",
  },
  {
    path: "/usuarios",
    name: "Usuarios",
    icon: "ni ni-single-02 text-info",
    component: TablaUsuarios,
    layout: "/superu",
  },
  {
    path: "/test",
    name: "Cajita",
    icon: "ni ni-single-02 text-info",
    component: Test,
    layout: "/superu",
  },
  {
    path: "/loading",
    name: "Cargando",
    icon: "ni ni-single-02 text-info",
    component: Loading,
    layout: "/superu",
  },
];
export default routes;
