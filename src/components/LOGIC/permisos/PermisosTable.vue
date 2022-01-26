<template>
  <div>
    <b-container fluid>
      <b-row class="my-1">
        <b-col sm="12">
          <b-form-group label="Roles" label-for="roles">
            <b-form-select
              v-model="idrol"
              :options="dataRoles"
              value-field="id_rol"
              text-field="nombre_rol"
              @change="changeRol"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>

    <div v-if="loading"><Loader /></div>
    <!-- tabla -->
    <b-table v-else striped hover light :items="dataTable" :fields="fields">
      <template #cell(ver)="row">
        <b-form-checkbox
          unchecked-value="0"
          value="1"
          :checked="loadPermisos(row, 'ver')"
          switch
          @change="changeAction(row, $event, 'ver')"
        >
        </b-form-checkbox>
      </template>
      <template #cell(crear)="row">
        <b-form-checkbox
          unchecked-value="0"
          value="1"
          :checked="loadPermisos(row, 'crear')"
          switch
          @change="changeAction(row, $event, 'crear')"
        >
        </b-form-checkbox>
      </template>
      <template #cell(edit)="row">
        <b-form-checkbox
          unchecked-value="0"
          value="1"
          :checked="loadPermisos(row, 'editar')"
          switch
          @change="changeAction(row, $event, 'editar')"
        >
        </b-form-checkbox>
      </template>
      <template #cell(filtrar)="row">
        <b-form-checkbox
          unchecked-value="0"
          value="1"
          :checked="loadPermisos(row, 'filtrar')"
          switch
          @change="changeAction(row, $event, 'filtrar')"
        >
        </b-form-checkbox>
      </template>
      <template #cell(delete)="row">
        <b-form-checkbox
          unchecked-value="0"
          value="1"
          :checked="loadPermisos(row, 'eliminar')"
          switch
          @change="changeAction(row, $event, 'eliminar')"
        >
        </b-form-checkbox>
      </template>
    </b-table>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from "vuex";
import Loader from "@/components/Loader/Loader";
import { validationMixin } from "vuelidate";

export default {
  mixins: [validationMixin],
  components: { Loader },
  data() {
    return {
      fields: [
        { key: "title_mod", label: "Nombre", sortable: true },
        { key: "ver", label: "Ver" },
        { key: "edit", label: "Editar" },
        { key: "crear", label: "Crear" },
        { key: "filtrar", label: "Filtrar" },
        { key: "delete", label: "Eliminar" },
      ],
      dataForm: {},
      selected: [],
      idrol: "",
    };
  },
  computed: {
    ...mapState({
      dataTable: (state) => state.modulos.dataTable,
      dataRoles: (state) => state.roles.dataTable,
      loading: (state) => state.modulos.loading,
    }),
  },
  methods: {
    ...mapActions({
      getData: "modulos/getData",
      getDataRoles: "roles/getData",
      editItem: "permisos/editItem",
      newItem: "permisos/newItem",
    }),
    ...mapMutations({
      setDeleteId: "roles/setDeleteId",
      hideLoader: "roles/hideLoader",
      showLoader: "roles/showLoader",
    }),

    changeRol() {
      this.getData({ idrol: this.idrol });
    },
    async changeAction(row, check, tipo) {
      var ver, crear, editar, eliminar, filtrar;
      ver = crear = editar = eliminar = filtrar = 0;

      if (row.item.roles.length === 0) {
        if (tipo == "crear") {
          crear = parseInt(check);
        }
        if (tipo == "ver") {
          ver = parseInt(check);
        }
        if (tipo == "editar") {
          editar = parseInt(check);
        }
        if (tipo == "eliminar") {
          eliminar = parseInt(check);
        }
        if (tipo == "filtrar") {
          filtrar = parseInt(check);
        }

        this.dataForm = {
          idrol: this.idrol,
          idmodulo: row.item.id_mod,
          ver: ver,
          crear: crear,
          editar: editar,
          eliminar: eliminar,
          filtrar: filtrar,
        };

        await this.newItem(this.dataForm);
      } else {
        const permisos = row.item.roles[0].permisosroles;

        if (tipo == "crear") {
          crear = parseInt(check);
        } else {
          crear = permisos.crear_prol || 0;
        }

        if (tipo == "ver") {
          ver = parseInt(check);
        } else {
          ver = permisos.ver_prol || 0;
        }

        if (tipo == "editar") {
          editar = parseInt(check);
        } else {
          editar = permisos.editar_prol || 0;
        }

        if (tipo == "eliminar") {
          eliminar = parseInt(check);
        } else {
          eliminar = permisos.eliminar_prol || 0;
        }

        if (tipo == "filtrar") {
          filtrar = parseInt(check);
        } else {
          filtrar = permisos.filtrar_prol || 0;
        }

        this.dataForm = {
          id: permisos.id_prol,
          idrol: this.idrol,
          idmodulo: row.item.id_mod,
          ver: ver,
          crear: crear,
          editar: editar,
          eliminar: eliminar,
          filtrar: filtrar,
        };
        await this.editItem(this.dataForm);
      }
    },
    loadPermisos(row, tipo) {
      if (row.item.roles.length > 0) {
        if (row.item.roles[0].permisosroles) {
          if (tipo === "ver") {
            if (row.item.roles[0].permisosroles.ver_prol) {
              return row.item.roles[0].permisosroles.ver_prol;
            } else {
              return 0;
            }
          } else if (tipo === "crear") {
            return row.item.roles[0].permisosroles.crear_prol;
          } else if (tipo === "editar") {
            return row.item.roles[0].permisosroles.editar_prol;
          } else if (tipo === "eliminar") {
            return row.item.roles[0].permisosroles.eliminar_prol;
          } else if (tipo === "filtrar") {
            return row.item.roles[0].permisosroles.filtrar_prol;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      }
    },
  },
  async beforeMount() {
    await this.getDataRoles();
    this.idrol = this.dataRoles[0].id_rol;
    this.getData({ idrol: this.idrol });
  },
};
</script>
