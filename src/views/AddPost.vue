<template>
  <div class="container-fluid mt-4">
    <div class="pb-2 mb-3 border-bottom"><h2>Add Post</h2></div>
<nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item active">Add Post</li></ol></nav>
 

     <b-container fluid>
       <b-alert v-model="alerts" variant="success" dismissible>{{ message }}</b-alert>
       <b-alert v-model="mandatory"  variant="danger" dismissible>{{ message }}</b-alert>
       <b-row class="my-2">
        <b-col sm="3">
          <label for="input-1">Title<sup style="color:red;">*</sup></label>
        </b-col>
        <b-col sm="6">
          <b-form-input type="text" v-model="title" id="input-1" placeholder="title"> </b-form-input>
        </b-col>
       </b-row>

       <b-row class="my-2">
        <b-col sm="3">
          <label for="input-2">Description<sup style="color:red;">*</sup></label>
        </b-col>
        <b-col sm="6">
          <b-form-textarea type="text" v-model="content" id="input-2" placeholder="Description"> </b-form-textarea>
        </b-col>
       </b-row>

         <b-button type="button" variant="success" @click="addPosts()">Submit Post</b-button>
     </b-container>
         
        </div>



</template>

<script>
import axios from "axios";
export default {

  mounted() {
    if(!localStorage.getItem('access_token')){
      window.location.href='/';
    }
  },
  data() {
    return {
      title: "",
      content: "",
      alerts:false,
      mandatory:false,
      message:null
    };
  },
  methods: {
    addPosts() {
      if(this.title == "" || this.content == ""){
           this.message = "Both field are Mandatory";
           this.alerts = false;
           this.mandatory = true;

      }

      const headers = {
      'Accept': 'application/json',
      Authorization : 'Bearer '+ localStorage.getItem('access_token')
      }
       const data = { 
            title: this.title,
            content: this.content,
      }
        axios.post("http://localhost:9999/api/addpost", data ,{ headers: headers })
      .then(response => {
        console.log(response.data);
           this.title = "";
           this.content = "";
           this.message = "Posted SuccessFully";
           this.mandatory = false;
           this.alerts = true;
           
      })
    }
  }
};
</script>


<style lang="css">
</style>