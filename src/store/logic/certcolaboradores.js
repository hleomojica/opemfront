import axios from "axios";

export default {
  namespaced: true,
  state: {
    dataTable: [],
    dataItem: [],
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
    setDataItem(state, payload) {
      state.dataItem = [];
      state.dataItem = payload;
    },
    getData(state, payload) {
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
        var param = `?page=${payload.page}&size=${payload.size}`

        if (payload.idcol) {
          param += `&idcol=${payload.idcol}`
        }
        if (payload.idemp) {
          param += `&idemp=${payload.idemp}`
        }
        if (payload.idcer) {
          param += `&idcer=${payload.idcer}`
        }
        if (payload.numerodocumento) {
          param += `&numerodocumento=${payload.numerodocumento}`
        }
        const response = await axios.get(`/certcol${param}`);

        commit("setData", response.data);
        commit("hideLoader");
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    async getDataByCedula({
      commit
    }, payload) {
      try {
        commit("showLoader");
        var param = `?page=${payload.page}&size=${payload.size}`

        if (payload.numerodocumento) {
          param += `&numerodocumento=${payload.numerodocumento}`
        } else {
          this._vm.$toasted.show("Se requiere cedula: ", {
            type: "error",
          });
          return
        }
        const response = await axios.get(`/certcol/GetByCedula${param}`);

        commit("setData", response.data);
        commit("hideLoader");
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    async getDataById({
      commit
    }, payload) {
      try {
        commit("showLoader");
        const response = await axios.get(`/certcol/GetById/${payload}`);
        commit("setDataItem", response.data);
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
        const result = await axios.post(`/certcol`, payload);
        this._vm.$toasted.show("Certificaciones creado", {
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
        const result = await axios.put(`/certcol/${payload.id}`, payload);
        this._vm.$toasted.show("Registro actualizado correctamente", {
          type: "success",
        });

        commit(`getData`, result.data);
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    async editEstado({
      commit
    }, payload) {
      try {
        const result = await axios.put(`/certcol/updateEstado/${payload.id}`, payload);
        this._vm.$toasted.show("Estado actualizado correctamente", {
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
        console.log(state.deleteId);
        await axios.delete(`/certcol/${state.deleteId}`);
        this._vm.$toasted.show("Certificaciones delete", {
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