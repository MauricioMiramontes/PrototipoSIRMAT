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
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import TablaCamaras from "views/Camaras.js";

var routes = [
  {
    path: "/Inicio",
    name: "Inicio",
    icon: "ni ni-tv-2 text-primary",
    component: Inicio,
    layout: "/superu",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: Icons,
    layout: "/superu",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/superu",
  },
  {
    path: "/muestras",
    name: "Muestras",
    icon: "ni ni-ungroup text-red",
    component: Tables,
    layout: "/superu",
  },
  {
    path: "/trampas",
    name: "Trampas",
    icon: "ni ni-building text-red",
    component: Tables,
    layout: "/superu",
  },
  {
    path: "/etiquetado",
    name: "Etiquetado",
    icon: "ni ni-tag text-red",
    component: Tables,
    layout: "/superu",
  },
  {
    path: "/camaras",
    name: "Camaras",
    icon: "ni ni-camera-compact text-red",
    component: TablaCamaras,
    layout: "/superu",
  },
  {
    path: "/estereoscopios",
    name: "Estereoscopios",
    icon: "ni ni-zoom-split-in text-red",
    component: Tables,
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
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
  },
];
export default routes;
