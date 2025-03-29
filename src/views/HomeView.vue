<template>
  <div class="background-view" :style="frameStyle">
    <div class="banner">
      <div class="content">
        <img :src="require('./redeyeLogo.png')" alt="Logo" class="logo"/>
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
  props: {
    windowWidth: {
      type: Number,
      required: true
    },
    windowHeight: {
      type: Number,
      required: true
    }
  },
  name: "HomeView",
  data() {
    return {
      inputValue: '',
      apiData: null,
      uploadRule: '',
      loading: false,
      dmsIcon: "redeyeLogo.png",
      bannerHeight: 180,
    };
  },
  computed: {
    framestyle() {
      return {
        width: '${this.windowWidth}px',
        height: '${this.windowHeight}px'
      };
    }
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
.background-view {
  background-color: white;
}

.banner {
  background-color: #1d2b47;
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 20px;
}

.content {
  display: flex;
  flex-direction: column;
}

.logo {
  width: 187px;
  height: 42px;
}

.title {
  font-size: 40px;
  font-weight: 600;
  padding-left: 40px;
  color: white;
}

.home {
  text-align: left;
  padding-top: 20px;
}
</style>
