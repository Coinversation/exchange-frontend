<template>
  <router-view></router-view>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',
  methods: {
    ...mapActions(['init'])
  },
  mounted() {
    this.init();
  }
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';

</style>
