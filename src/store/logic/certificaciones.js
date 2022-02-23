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

        var param = `?page=${payload.page}&size=${payload.size}`

        if (payload.idcur) {
          param += `&idcur=${payload.idcur}`
        }
        if (payload.cohorte) {
          param += `&cohorte=${payload.cohorte}`
        }

        commit("showLoader");
        const response = await axios.get(`/certificaciones${param}`);
        commit("setData", response.data);
        commit("hideLoader");
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    async getDataByCurso({
      commit
    }, payload) {
      try {
        commit("showLoader");
        const response = await axios.get(`/certificaciones/getByCurso?idcur=${payload}&estado=0`);
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

        const result = await axios.post(`/certificaciones`, payload);
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
    async getDataForm({
      commit
    }, payload) {
      try {
        commit("showLoader");

        const response = await axios.get(`/certificaciones/${payload}`);

        let newData = {
          id: response.data.items[0].id_cer || "",
          fechainicio: response.data.items[0].fechainicio_cer || "",
          fechafin: response.data.items[0].fechafin_cer || "",
          horas: response.data.items[0].horas_cer || "",
          idcur: response.data.items[0].curso.id_cur || "",
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
        console.log(payload)
        const result = await axios.put(`/certificaciones/${id}`, payload);
        this._vm.$toasted.show("Registro actualizado", {
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
      const id = payload.id
      try {
        console.log(commit)
        await axios.put(`/certificaciones/updateEstado/${id}`, payload);
        this._vm.$toasted.show("Registro actualizado", {
          type: "success",
        });
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
  },
};