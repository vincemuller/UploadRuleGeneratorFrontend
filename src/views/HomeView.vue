<template>
  <div class="background-view" :style="frameStyle">
    <div class="banner">
      <div class="content">
        <img :src="require('./redeyeLogo.png')" alt="Logo"/>
        <h1 class="title">RedEyeDMS Upload Rule Generator</h1>
      </div>
    </div>
  </div>
  <div class="home">
      <div>
    <input
      type="number"
      v-model="inputValue"
      @keyup.enter="handleEnter"
      placeholder="Enter Bucket ID"
    />
  </div>
    <p v-if="loading">Loading...</p>
    <div v-else>
      <p>Generated Upload Rule:</p>
      <pre>{{ uploadRule }}</pre>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { uploadRuleGenerator } from '@/Generator.js';

export default {
  name: "HomeView",
  data() {
    return {
      inputValue: '',
      apiData: null,
      uploadRule: '',
      loading: false,
      dmsIcon: "redeyeLogo.png"
    };
  },
  methods: {
    handleEnter() {
      // Check if the input value is a valid integer
      const parsedValue = parseInt(this.inputValue, 10);

      if (!isNaN(parsedValue)) {
        this.fetchData(parsedValue);
      } else {
        this.errorMessage = 'Please enter a valid integer.';
      }
    },
    async fetchData(integer) {
      this.loading = true;
      this.errorMessage = '';

      try {
        const response = await axios.get(`http://localhost:8000/api/siteID/${integer}`);
        this.apiData = response.data;
      } catch (error) {
        this.errorMessage = 'An error occurred while fetching data.';
      } finally {
        this.loading = false;
        this.generateRule(this.apiData);
      }
    },

    generateRule(apiData) {
            this.uploadRule = uploadRuleGenerator(apiData);
        }
  },
};
</script>

<style scoped>
.home {
  text-align: left;
}
</style>
