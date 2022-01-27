import axios from "axios";
import createPersistedState from "vuex-persistedstate";

export default {
  namespaced: true,
  state: {
    dataTable: [],
    dataList: [],
    dataMenu: [],
    dataForm: {},
    currentaction: {},
    loading: false,
    modalOpen: false,
    deleteId: null,
  },
  plugins: [createPersistedState()],
  //-- Will modify the state
  mutations: {
    getData(state, payload) {
      state.dataTable = [];
      state.dataTable = payload;
    },
    getMenu(state, payload) {
      state.dataMenu = [];
      state.dataMenu = payload;
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
    setcurrentaction(state, payload) {
      state.currentaction = null;
      state.currentaction = payload;
    }
  },
  actions: {
    async getData({
      commit
    }, payload) {
      try {
        commit("showLoader");
        const response = await axios.get(`/modulos?idrol=${payload.idrol}`);
        commit("getData", response.data);

        commit("hideLoader");
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    async getMenu({
      commit
    }, payload) {
      try {
        commit("showLoader");
        const response = await axios.get(`/modulos?idrol=${payload}`);
        commit("getMenu", response.data);
        console.log(response.data)
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
        const response = await axios.get(`/modulos`);
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

        const response = await axios.get(`/modulos/${payload}`);

        let newData = {
          nombre: response.data.items.nombre_emp || "",
          nit: response.data.items.nit_emp || "",
          telefono: response.data.items.telefono_emp || "",
          correo: response.data.items.correo_emp || "",
          direccion: response.data.items.direccion_emp || "",
          personacontacto: response.data.items.personacontacto_emp || "",
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
        axios.put(`/modulos/${id}`, payload).then((result) => {
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
    getaction({ commit }, payload) {
      if (payload) {
        localStorage.setItem('currentaction', JSON.stringify(payload))
        commit('setcurrentaction', payload)
      } else {
        const current = localStorage.getItem('currentaction')
        commit('setcurrentaction', JSON.parse(current))
      }
    },


  },
};