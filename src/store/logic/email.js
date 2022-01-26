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
    async sendEmail({ commit }, payload) {
      try {
        const result = await axios.post(`/email`, payload);

        if (result.data.status == "fail") {
          this._vm.$toasted.show("Error enviado correo electronico", {
            type: "error",
          });
        } else {
          this._vm.$toasted.show("Se envio correo electronico al correo:"+payload.to, {
            type: "success",
          });
        }
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
