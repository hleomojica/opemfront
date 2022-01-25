import axios from "axios";

export default {
  namespaced: true,
  state: {
    dataTable: [],
    dataList: [],
    dataForm: {},
    loading: false,
    modalOpen: false,
    deleteId: null,
  },
  //-- Will modify the state
  mutations: {
    getData(state, payload) {
      state.dataTable = [];
      state.dataTable = payload;
    },
    getDataList(state, payload) {
      state.dataList = [];
      state.dataList = payload;
    },
    getDataForm(state, payload) {
      state.dataForm = payload;
    },
    showLoader(state) {
      state.loading = true;
    },
    hideLoader(state) {
      state.loading = false;
    },
    setDeleteId(state, payload) {
      state.deleteId = payload;
    },
  },
  actions: {
    async getData({
      commit
    }, payload) {
      try {
        commit("showLoader");
        const response = await axios.get(`/empresa?page=${payload.page}&size=${payload.size}`);
        commit("getData", response.data);
        commit("hideLoader");
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    async getDataList({
      commit
    }) {
      try {
        commit("showLoader");
        const response = await axios.get(`/empresa`);
        commit("getDataList", response.data.items);
        commit("hideLoader");
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    async getDataForm({
      commit
    }, payload) {
      try {
        commit("showLoader");

        const response = await axios.get(`/empresa/${payload}`);

        let newData = {
          nombre: response.data.items[0].nombre_emp || "",
          nit: response.data.items[0].nit_emp || "",
          telefono: response.data.items[0].telefono_emp || "",
          correo: response.data.items[0].correo_emp || "",
          direccion: response.data.items[0].direccion_emp || "",
          personacontacto: response.data.items[0].personacontacto_emp || "",
          numpersonacontacto: response.data.items[0].numpersonacontacto_emp || "",
          correopersonacontacto: response.data.items[0].correopersonacontacto_emp || "",
        }
        commit("getDataForm", newData);
        commit("hideLoader");
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    async newEmpresa({
      commit
    }, payload) {
      try {
        const result = await axios.post(`/empresa`, payload);
        this._vm.$toasted.show("Empresa creada", {
          type: "success",
        });

        commit(`getData`, result.data);
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    async editEmpresa({
      commit
    }, payload) {
      try {
        const result = await axios.put(`/empresa/${payload.id}`, payload);
        this._vm.$toasted.show("Empresa actualizada correctamente", {
          type: "success",
        });

        commit(`getData`, result.data);
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    async deleteItem({
      dispatch,
      state
    }) {
      try {

        await axios.delete(`/empresa/${state.deleteId}`);
        this._vm.$toasted.show("Empresa eliminada", {
          type: "success",
        });
        dispatch("getData", { page: 0, size: 10 });
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
  },
};