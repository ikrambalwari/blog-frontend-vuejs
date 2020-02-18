<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="dark" sticky class="py-0">
    <b-link to="/dash" tag="b-navbar-brand"><b-navbar-brand><h2>Blog</h2></b-navbar-brand></b-link>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav >
      <b-navbar-nav >
        <b-nav-item>
          <router-link to="/dash" tag="h6"><h6>Dashboard</h6></router-link>
        </b-nav-item>
        <b-nav-item>
          <router-link to="/home" tag="h6"><h6>Home</h6></router-link>
        </b-nav-item>
        <b-nav-item v-if="role == 'admin'">
          <router-link to="/addpost" tag="h6"><h6>AddPost</h6></router-link>
        </b-nav-item>
        <b-nav-item v-if="role == 'admin'">
          <router-link to="/view" tag="h6"><h6>View</h6></router-link>
        </b-nav-item>
         <b-nav-item v-if="role == 'admin'">
          <router-link to="/users" tag="h6"><h6>Users</h6></router-link>
        </b-nav-item>

     </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <em>{{ role }}</em>
          </template>
          <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
       </b-navbar-nav>
     </b-collapse>
    </b-navbar>
   <router-view/>
  </div>
 </template>
<script>

export default {
  data() {
    return {
       role: localStorage.getItem('id')
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("id");
      localStorage.removeItem("access_token");
      window.location.href = "/";
    }
  }
};
</script>



