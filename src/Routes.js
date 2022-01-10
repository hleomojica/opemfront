import Vue from "vue";
import Router from "vue-router";

// -- Main
import Layout from "@/components/Layout/Layout";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Login from "@/pages/Login/Login";
import ErrorPage from "@/pages/Error/Error";

//-- LOGIC ( All the bussiness logic components )
import Cursos from "@/components/LOGIC/cursos/Cursos";
import Certificaciones from "@/components/LOGIC/certificaciones/Certificaciones";
import Empresas from "@/components/LOGIC/empresas/Empresas";
import Colaboradores from "@/components/LOGIC/colaboradores/Colaboradores";
import CuentaAcceso from "@/components/LOGIC/colaboradores/CuentaAcceso";
import CertColaboradores from "@/components/LOGIC/certcolaboradores/CertColaboradores";
//-----Configuraciones
import Paises from "@/components/LOGIC/paises/Paises";
import Departamentos from "@/components/LOGIC/departamentos/Departamentos";
import Ciudades from "@/components/LOGIC/ciudades/Ciudades";
import TipoDocs from "@/components/LOGIC/tipodocs/TipoDocs";
import Roles from "@/components/LOGIC/roles/Roles";
import Permisos from "@/components/LOGIC/permisos/Permisos";

//New pages
import CursosNew from "@/components/LOGIC/cursos/CursosNew";
import CertificacionesNew from "@/components/LOGIC/certificaciones/CertificacionesNew";
import EmpresasNew from "@/components/LOGIC/empresas/EmpresasNew";
import ColaboradoresNew from "@/components/LOGIC/colaboradores/ColaboradoresNew";
import CertColaboradoresNew from "@/components/LOGIC/certcolaboradores/CertColaboradoresNew";
import RolesNew from "@/components/LOGIC/roles/RolesNew";
import CertColaboradoresPdf from "@/components/LOGIC/certcolaboradores/CertColaboradoresPdf";

// -- Template Resources
import GoogleMapPage from "@/pages/Maps/Google";
import ChartsPage from "@/pages/Charts/Charts";
import IconsPage from "@/pages/Icons/Icons";
import NotificationsPage from "@/pages/Notifications/Notifications";

import mockData from "@/pages/Dashboard/mock.js";

Vue.use(Router);

export default new Router({

  routes: [{
    path: "/",
    redirect: {
      name: "Dashboard"
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/error",
    name: "Error",
    component: ErrorPage,
  },
  {
    path: "/app",
    name: "Layout",
    component: Layout,
    redirect: {
      name: "Dashboard"
    },    
    children: [{
      path: "dashboard",
      name: "Dashboard",
      component: Dashboard,
    },

    // ---------------------------------- //
    {
      path: "components/icons",
      name: "IconsPage",
      component: IconsPage,
    },
    {
      path: "notifications",
      name: "NotificationsPage",
      component: NotificationsPage,
    },
    {
      path: "components/charts",
      name: "ChartsPage",
      component: ChartsPage,
    },
    {
      path: "components/maps",
      name: "GoogleMapPage",
      component: GoogleMapPage,
    },
    ],
  },
  {
    path: "/admin",
    name: "Admin",
    redirect: {
      name: "Dashboard"
    },
    component: Layout,  
    children: [{
      path: "cursos",
      name: "Cursos",
      component: Cursos,
    },
    {
      path: 'cursos/:id/edit',
      component: CursosNew,
    },
    {
      path: 'cursos/new',
      component: CursosNew,
    },
    {
      path: 'cursos/:id',
      beforeEnter(from, to, next) {
        if (from.params.id === 'new') next()
        else next(`/admin/cursos/${from.params.id}/edit`)
      },
    },
    {
      path: "certificaciones",
      name: "Certificaciones",
      component: Certificaciones,
    },
    {
      path: "certificaciones/new",
      component: CertificacionesNew,
    },
    {
      path: 'certificaciones/:id/edit',
      component: CertificacionesNew,
    },
    {
      path: "empresas",
      name: "Empresas",
      component: Empresas,
    },
    {
      path: 'empresas/:id/edit',
      component: EmpresasNew,
    },
    {
      path: "empresas/new",
      component: EmpresasNew,
    },
    {
      path: 'empresas/:id',
      beforeEnter(from, to, next) {
        if (from.params.id === 'new') next()
        else next(`/admin/empresas/${from.params.id}/edit`)
      },
    },
    {
      path: "colaboradores",
      name: "Colaboradores",
      component: Colaboradores,
    },
    {
      path: 'colaboradores/nuevo',
      name: 'colaboradoresnew',
      component: ColaboradoresNew,
    },
    {
      path: 'colaboradores/cuentaacceso',
      name: 'cuentaacceso',
      component: CuentaAcceso,
    },
    {
      path: "certcolaboradores",
      name: "CertColaboradores",
      component: CertColaboradores
    },
    {
      path: "certcolaboradores/new",
      component: CertColaboradoresNew,
    },
    {
      path: "certcolaboradores/pdf",
      component: CertColaboradoresPdf,
      props: mockData.dataPdf

    },
    {
      path: "configuraciones/paises",
      name: "paises",
      component: Paises,
    },
    {
      path: "configuraciones/departamentos",
      name: "departamentos",
      component: Departamentos,
    },
    {
      path: "configuraciones/ciudades",
      name: "ciudades",
      component: Ciudades,
    },
    {
      path: "configuraciones/tipodocs",
      name: "tipodocs",
      component: TipoDocs,
    },
    {
      path: "configuraciones/roles",
      name: "roles",
      component: Roles,
    },
    {
      path: "configuraciones/roles/nuevo",
      name: "rolesnew",
      component: RolesNew,
    },
    {
      path: "configuraciones/permisos",
      name: "permisos",
      component: Permisos,
    },
    ],
  },
  ],

});