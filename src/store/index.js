import Vue from 'vue';
import Vuex from 'vuex';

// -- Main store modules
import layout from './layout';
import auth from './auth';

// -- Components Store State
import cursos from './logic/cursos'
import certificaciones from './logic/certificaciones'
import empresas from './logic/empresas'
import colaboradores from './logic/colaboradores'
import certcolaboradores from './logic/certcolaboradores'
import paises from './logic/paises'
import tipodocumento from './logic/tipodocumento'
import roles from './logic/roles'
import modulos from './logic/modulos'
import permisos from './logic/permisos'
import cuentaacceso from './logic/cuentaacceso'
import email from './logic/email'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    layout,
    auth,
    cursos,
    certificaciones,
    empresas,
    colaboradores,
    certcolaboradores,
    paises,
    tipodocumento,
    roles,
    permisos,
    modulos,
    cuentaacceso,
    email
  },
 
});
