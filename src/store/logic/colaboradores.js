import axios from "axios";

export default {
  namespaced: true,
  state: {
    dataTable: [],
    dataList: [],
    loading: false,
    modalOpen: false,
    dataForm: {},
    deleteId: null,
    dataColaborador: [],
    statusOp: true
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
    setDataList(state, payload) {
      state.dataList = [];
      state.dataList = payload;
    },
    showLoader(state) {
      state.loading = true;
    },
    setStatusOp(state, payload) {
      state.statusOp = payload;
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
    setDataColaborador(state, payload) {
      state.dataColaborador.push(payload)
    },
    removeDataColaborador(state, payload) {
      state.dataColaborador = state.dataColaborador.filter(col => col.id_col !== payload)
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
      commit
    }, payload) {
      const nombre = payload.nombre ? `&nombre=${payload.nombre}` : ``
      const idemp = payload.idemp ? `&idemp=${payload.idemp}` : ``
      const cedula = payload.cedula ? `&cedula=${payload.cedula}` : ``
      try {
        commit("showLoader");
        const response = await axios.get(`/colaboradores?page=${payload.page}&size=${payload.size}${nombre}${idemp}${cedula}`);
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
        const response = await axios.get(`/colaboradores/getByParam/${payload}`);
        if (response.data.length > 0) {
          let newData = {
            paisdocumento: response.data[0].paisdocumento_col,
            tipodocumento: response.data[0].tipodocumento_col,
            numerodocumento: response.data[0].numerodocumento_col,
            nombres: response.data[0].nombres_col,
            apellidos: response.data[0].apellidos_col,
            fechanacimiento: response.data[0].fechanacimiento_col,
            correopersonal: response.data[0].correopersonal_col,
            telefono: response.data[0].telefono_col,
            direccion: response.data[0].direccion_col,
            idemp: response.data[0].idemp_col,
          }
          commit("getDataForm", newData);
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
        const result = await axios.post(`/colaboradores`, payload);
        this._vm.$toasted.show("Se registro correctamente", {
          type: "success",
        });
        commit('setStatusOp', true)
        commit(`getData`, result.data);
      } catch (e) {
        commit('setStatusOp', false)
        if (e.response.status == 403) {
          this._vm.$toasted.show("La persona ya se encuentra registrada en la plataforma", {
            type: "error",
          });
        } else {
          this._vm.$toasted.show("Error: " + e, {
            type: "error",
          });
        }
      }
    },
    async editItem({
      commit
    }, payload) {
      try {
        const result = await axios.put(`/colaboradores/${payload.id}`, payload);
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
    async deleteItem({
      dispatch,
      state
    }) {
      try {
        console.log(state.deleteId);
        await axios.delete(`/colaboradores/${state.deleteId}`);
        this._vm.$toasted.show("colaboradores delete", {
          type: "success",
        });
        dispatch("getData");
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    async getDataList({
      commit
    }, payload) {
      try {
        commit("showLoader");

        const idemp = payload.idemp ? `?idemp=${payload.idemp}` : ``
        console.log("state ", idemp)
        const response = await axios.get(`/colaboradores/getByParam${idemp}`);
        commit("setDataList", response.data);
        commit("hideLoader");
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },

  },
};