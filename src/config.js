const hostApi = process.env.NODE_ENV === "development" ? "http://localhost" : "https://back.opem.com.co";
const portApi = process.env.NODE_ENV === "development" ? 3000 : "";
const baseURLApi = `${hostApi}${portApi ? `:${portApi}` : ``}/api/v1`;

const redirectUrl = process.env.NODE_ENV === "http://localhost:3000/verify-email"

export default {
  hostApi,
  portApi,
  baseURLApi,
  redirectUrl,
  remote: "",
  auth: {
    username: '',
    password: ''
  },
  isBackend: process.env.VUE_APP_BACKEND,
  app: {
    sidebarTransitionTime: 300, //ms
    colors: {
      sidebar: "#002B49",
      navbar: "#ffffff",
      primary: "#005792",
      secondary: "#798892",
      success: "#21AE8C",
      info: "#1A86D0",
      warning: "#FDA700",
      danger: "#FD5F00",
      inverse: "#0D2B47",
      textColor: "#495057",
      gray: "#D7DFE6"
    },
    chartColors: {
      axisColor: '#8EA1AB'
    }
  }
};
