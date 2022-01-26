<template>
  <div class="page">
    <div class="cert-content">
      <div class="cert-id">
        <span>Certificado</span>
        <span
          >ID
          <span class="id-text"
            >{{ certificacion.certificacione.curso.iniciales_cur }}-{{
              certificacion.certificacione.cohorte_cer
                .toString()
                .padStart(4, "0")
            }}/ {{ certificacion.consecutivo_ceco.toString().padStart(4, "0") }}
          </span></span
        >
      </div>
      <div class="cert-details">
        <h3>{{ certificacion.colaboradore.nombres_col }}</h3>
        <h3>{{ certificacion.colaboradore.apellidos_col }}</h3>
        <span>CC {{ certificacion.colaboradore.numerodocumento_col }}</span>
      </div>
      <div class="cert-curso">
        <span>Asistió y aprobó satisfactoriamente el curso</span>
        <h3>{{ certificacion.certificacione.curso.nombre_cur }}</h3>
      </div>
      <div class="cert-dates">
        <h5 class="intensity">
          Realizado con una intensidad de
          {{ certificacion.certificacione.horas_cer }} horas
        </h5>
        <h5 class="dat">
          Fecha de expedición:
          {{
            new Date(
              certificacion.certificacione.fechafin_cer
            ).toLocaleDateString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }}
          <br>
          (Vigencia {{certificacion.certificacione.tiempovigencia_cer}} año)
        </h5>
      </div>
      <div class="cert-sign">
        <img src="../../../assets/certificado/firma.png" class="img-sign" />
        <h5>JUAN JOSÉ SOLANO MEZA</h5>
        <h6>Director de Formación Empresarial</h6>
        <span>
          Emitido por
          <span>OPTIMIZACIÓN EMPRESARIAL S.A.S</span>
        </span>
        <h5 class="license">Licencia en SST 00-10536</h5>
        <span>Bucaramanga - Colombia</span>
      </div>
      <div class="cert-qr">
        <qrcode-vue :value="valueqr" :size="sizeqr" level="H" />
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader/Loader";
import QrcodeVue from "qrcode.vue";

export default {
  components: { Loader, QrcodeVue },
  name: "CertCoalboradoresTemplate",
  data() {
    return {
      valueqr: "http://app.opem.com.co/Certificado/",
      sizeqr: 130,
    };
  },
  props: {
    certificacion: {
      type: Object,
    },
  },
  methods: {},
  computed: {},
  async mounted() {
    this.valueqr = `${this.valueqr}${this.certificacion.colaboradore.numerodocumento_col}`;
  },
};
</script>

<style  src="./Certificado.scss" lang="scss"  />