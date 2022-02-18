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
    page: 1,
    size: 10
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
    setPaging(state, payload) {
      state.page = payload.page;     
    }
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
      commit,
      state
    }, payload) {
      try {
        commit("showLoader");
        var param = `?page=${state.page}&size=${state.size}`

        if (payload.idcol) {
          param += `&idcol=${payload.idcol}`
        }
        if (payload.idemp) {
          param += `&idemp=${payload.idemp}`
        }
        if (payload.idcer) {
          param += `&idcer=${payload.idcer}`
        }
        if (payload.idcur) {
          param += `&idcur=${payload.idcur}`
        }
        if (payload.numerodocumento) {
          param += `&numerodocumento=${payload.numerodocumento}`
        }
        if (payload.cohorte) {
          param += `&cohorte=${payload.cohorte}`
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

        let newData = {
          id: response.data.id_ceco,
          idcer: response.data.idcer_ceco || "",
          idcol: response.data.idcol_ceco || "",
          idemp: response.data.idemp_ceco || "",
          idcur: response.data.certificacione.curso.id_cur || "",
          nombres: response.data.colaboradore.nombres_col + " " + response.data.colaboradore.apellidos_col || "",
          colaboradore: response.data.colaboradore,
          consecutivo: response.data.consecutivo_ceco,
          certificacione: response.data.certificacione,
        }
        commit("setDataItem", newData);
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
      dispatch
    }, payload) {
      try {
        await axios.put(`/certcol/updateEstado/${payload.id}`, payload);
        this._vm.$toasted.show("Estado actualizado correctamente", {
          type: "success",
        });

        dispatch("getData",{});
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