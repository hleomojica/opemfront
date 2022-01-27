<template>
  <div class="sidebar-wrapper">
    <nav
      :class="{ sidebar: true, sidebarStatic, sidebarOpened }"
      @mouseenter="sidebarMouseEnter"
      @mouseleave="sidebarMouseLeave"
    >
      <header class="logo">
        <router-link to="/app/dashboard"
          >
          
          <span class="primary-word">
            <img src="../../assets/logoblanco.png" style="width: 140px;" alt="">
          </span>
          <!-- <span class="secondary-word">EM</span> -->
        </router-link>
      </header>

      <ul class="nav" v-for="modu in modulos" :key="modu.index">
        <NavLink      
          :activeItem="activeItem"
          :header="modu.title_mod"
          :link="modu.route_mod"
          :iconName="modu.icon_mod"
          :index="modu.nombre_mod"
          :actions="modu.roles[0].permisosroles"
          isHeader
          :childrenLinks="modu.Submodulos.length > 0 ? modu.Submodulos : null"         
        />
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import isScreen from "@/core/screenHelper";
import NavLink from "./NavLink/NavLink";

export default {
  name: "Sidebar",
  components: { NavLink },
  data() {
    return {
      modulos: [],
      alerts: [
        {
          id: 0,
          title: "Sales Report",
          value: 15,
          footer: "Calculating x-axis bias... 65%",
          color: "danger",
        },
        {
          id: 1,
          title: "Personal Responsibility",
          value: 20,
          footer: "Provide required notes",
          color: "primary",
        },
      ],
    };
  },
  methods: {
    ...mapActions({
      changeSidebarActive: "layout/changeSidebarActive",
      switchSidebar: "layout/switchSidebar",
    }),
    setActiveByRoute() {
      const paths = this.$route.fullPath.split("/");
      paths.pop();
      this.changeSidebarActive(paths.join("/"));
    },
    sidebarMouseEnter() {
      if (!this.sidebarStatic && (isScreen("lg") || isScreen("xl"))) {
        this.switchSidebar(false);
        this.setActiveByRoute();
      }
    },
    sidebarMouseLeave() {
      if (!this.sidebarStatic && (isScreen("lg") || isScreen("xl"))) {
        this.switchSidebar(true);
        this.changeSidebarActive(null);
      }
    },
  },
  created() {
    this.setActiveByRoute();
  },
  computed: {
    ...mapState({
      sidebarStatic: (state) => state.layout.sidebarStatic,
      sidebarOpened: (state) => !state.layout.sidebarClose,
      activeItem: (state) => state.layout.sidebarActiveElement,
    }),
  },
  async mounted() {
    const encrMenu = localStorage.getItem("menu");
    const decryptedText = this.$CryptoJS.AES.decrypt(
      encrMenu,
      "staencripmaschimba"
    ).toString(this.CryptoJS.enc.Utf8);
    const allmodules = JSON.parse(decryptedText);
    this.modulos = allmodules.filter(modu => !modu.father_mod && modu.roles.length > 0 && modu.roles[0].permisosroles.ver_prol == 1)   
  },
};
</script>

<!-- Sidebar styles should be scoped -->
<style src="./Sidebar.scss" lang="scss" scoped/>
