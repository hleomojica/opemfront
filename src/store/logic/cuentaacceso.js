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
    }, payload) {
      try {
        commit("showLoader");
        var param = ``
        if (payload.idcue) {
          param += `?idcue=${payload.idcue}`
        }
        const response = await axios.get(`/cuentaacceso${param}`);
        commit("setData", response.data);
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
        const response = await axios.get(`/cuentaacceso?idcol=${payload}`);
        if (response.data.length > 0) {
          let newData = {
            id: response.data[0].id_cue || "",
            idrol: response.data[0].idroles_cue || "",
          }
          commit("getDataForm", newData);
        } else {
          commit("getDataForm", {});
        }
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
        const result = await axios.post(`/cuentaacceso`, payload);
        this._vm.$toasted.show("Registro creado", {
          type: "success",
        });

        commit(`getData`, result.data);
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    async editItem({
      commit
    }, payload) {
      try {
        await axios.put(`/cuentaacceso/${payload.id}`, payload);
        this._vm.$toasted.show("Cuenta de acceso actualizada correctamente", {
          type: "success",
        });

        commit(`getData`, payload);
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
        console.log(state.deleteId);
        await axios.delete(`/cuentaacceso/${state.deleteId}`);
        this._vm.$toasted.show("registro eliminado", {
          type: "success",
        });
        dispatch("getData");
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
  },
};