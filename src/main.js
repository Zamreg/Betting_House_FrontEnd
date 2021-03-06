import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import CxltToastr from 'cxlt-vue2-toastr'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'
import Vuelidate from 'vuelidate'


Vue.use(Vuelidate);

Vue.use(Vuetify, {
  iconfont: 'mdi'
});

Vue.use(CxltToastr, {
  position: 'top-right',
  showDuration: 1000,
  hideDuration: 1000,
  timeOut: 2500,
  closeButton: true
});

Vue.config.productionTip = false;

Vue.mixin({
  methods: {
    displaySuccessMessage: function (title, message) {
      this.$toast.success({
        title: title,
        message: message
      });
    },
    displayErrorMessage: function (title, message) {
      this.$toast.error({
        title: title,
        message: message
      });
    }
  }
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');