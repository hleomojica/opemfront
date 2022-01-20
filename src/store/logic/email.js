import axios from "axios";

export default {
  namespaced: true,
  state: {
    statusSend: true,
  },
  //-- Will modify the state
  mutations: {
    setStatusSend(state, payload) {
      state.statusSend = payload;
    },
  },
  actions: {   
  
    async sendEmailchangepass({ commit }, payload) {
      try {     
        const result = await axios.post(`/email`, payload);
        this._vm.$toasted.show("Email enviado", {
          type: "success",
        });
        console.log(result)
        commit(`setStatusSend`, true);
      } catch (e) {
        commit(`setStatusSend`, false);
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
  
  },
};
