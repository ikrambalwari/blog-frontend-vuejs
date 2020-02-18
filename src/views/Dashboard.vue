<template>
<div class="container-fluid mt-4">
<div class="pb-2 mb-3 border-bottom"><h2>Dashboard</h2></div>
<nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item active">Dashboard</li></ol></nav>
 <div class="container-fluid p-4">
  <b-card-group columns>
     <b-link to="/users" tag="b-card">
      <b-card  bg-variant="dark" text-variant="white" class="text-center p-5">
        <b-card-text><h3><b>USERS [{{ users }}]</b></h3></b-card-text>
      </b-card>
     </b-link>
      
     <b-link to="/view" tag="b-card">
      <b-card bg-variant="dark" text-variant="white" class="text-center p-5">
        <b-card-text><h3><b>POSTS [{{ posts }}]</b></h3></b-card-text>
      </b-card>
     </b-link>
  
     <b-link to="/users" tag="b-card">
      <b-card bg-variant="dark" text-variant="white"  class="text-center p-5">
        <b-card-text><h3><b>BLOCKED [{{ blocked }}]</b></h3></b-card-text>
      </b-card>
     </b-link>
  </b-card-group>
 </div>
</div>
</template>


<script>
import axios from 'axios';
export default {
    data() {
        return {
            users:null,
            posts: null,
            blocked:null,
            url: 'http://localhost:9999/api/count'
        }
    },
      mounted() {
          var headers = { Authorization: 'Bearer '+localStorage.getItem('access_token')}
          axios
          .get(this.url, {headers:headers})
          .then(response => {
            this.users = response.data.users;
            this.posts = response.data.posts;
            this.blocked = response.data.blockedUsers;
          })
          .catch(error => {
            console.log(error);
          })

      },
}
</script>