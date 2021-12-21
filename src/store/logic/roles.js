import axios from "axios";

export default {
  namespaced: true,
  state: {
    dataTable: [],
    loading: false,
    modalOpen: false,
    dataForm: {},
    deleteId: null,
  },
  //-- Will modify the state
  mutations: {
    getData(state, payload) {
      state.dataTable = [];
      state.dataTable = payload;
    },
    setData(state, payload) {
      state.dataTable = [];
      state.dataTable = payload;
    },
    showLoader(state) {
      state.loading = true;
    },
    hideLoader(state) {
      state.loading = false;
    },
    getDataForm(state, payload) {
      state.dataForm = payload;
    },
    setDeleteId(state, payload) {
      state.deleteId = payload;
    },
  },
  getters: {
    getDataNow(state) {
      return state.dataTable;
    }
  },
  actions: {
    setData({
      commit
    }, payload) {
      commit("setData", payload);
    },
    async getData({
      commit
    }) {
      try {
        commit("showLoader");
        const response = await axios.get(`/rol`);
        commit("setData", response.data);
        commit("hideLoader");
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    async newItem({
      commit
    }, payload) {
      try {
        const result = await axios.post(`/rol`, payload);
        this._vm.$toasted.show("Certificaciones creado", {
          type: "success",
        });
        commit(`getData`, result.data);
      } catch (e) {
        this._vm.$toasted.show(e, {
          type: "error",
        });
      }
    },
    async deleteItem({
      dispatch,
      state
    }) {
      try {
        axios.delete(`/rol/${state.deleteId}`).then(
          () => {
            dispatch("getData");
          }
        ).catch((er) => {
          this._vm.$toasted.show(er.response.data.message, {
            type: "error",
          });
        });
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
        const response = await axios.get(`/rol/${payload}`);

        let newData = {
          id: response.data[0].id_rol || "",
          nombre: response.data[0].nombre_rol || "",
          descripcion: response.data[0].descripcion_rol || "",
        }
        commit("getDataForm", newData);
        commit("hideLoader");
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    async editItem({
      commit
    }, payload) {
      const id = payload.id
      try {
        axios.put(`/rol/${id}`, payload).then((result) => {
          commit(`getData`, result.data);
          this._vm.$toasted.show("Registro actualizado", {
            type: "success",
          });
        }).catch((er) => {
          this._vm.$toasted.show(er.response.data.message, {
            type: "error",
          });
        });
      } catch (e) {
        this._vm.$toasted.show(e, {
          type: "error",
        });
      }
    },
  },
};