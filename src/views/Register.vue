<template>
<div class="container">
      <div class="sidenav">
         <div class="login-main-text">
            <h2>Application<br> Register Page</h2>
            <p>Login or register from here to access.</p>
         </div>
      </div>
    
      <div class="main">
         <div class="col-md-7 col-sm-12">
            <div class="login-form">
               <b-form>
                  <b-form-group 
                    id="input-group-1"
                    labelfor="input-1"
                    
                  >
                  <b-form-input
                     id="input-1"
                     type="text"
                     v-model= "name"
                     required
                     placeholder="Name"
                  ></b-form-input>
                  </b-form-group>

                  <b-form-group
                     id="input-group-2"
                     labelfor="input-2"
                  >
                  <b-form-input
                     id="input-2"
                     type="email"
                     v-model="email"
                     required 
                     placeholder="Email"
                  ></b-form-input>
                  </b-form-group>
                   

                  <b-form-group
                     id="input-group-3"
                     labelfor="input-3"
                  >
                  <b-form-input
                     id="input-3"
                     type="password"
                     v-model="pwd"
                     required 
                     placeholder="password"
                  ></b-form-input>
                  </b-form-group>

                  <b-form-group
                     id="input-group-4"
                     labelfor="input-4"
                  >
                   <b-form-input
                     id="input-4"
                     type="password"
                     v-model="confirmpwd"
                     required 
                     placeholder="confirm password"
                  ></b-form-input>
                  </b-form-group>
                  <b-button type="button" @click="register()" variant="secondary">Register</b-button>
                  <a href="/" style="float:right">Login in, if you have already register?</a>
               </b-form>
            </div>
         </div>
      </div>
  
      <router-view></router-view>
</div>
</template>

<script>

import axios from 'axios';
export default {
    data() {
        return {
            name: '',
            email: '',
            pwd: '',
            confirmpwd: ''
        }
    },
    methods: {
        register() {
            const data = {
                'name': this.name,
                'email': this.email,
                'password': this.pwd,
                'password_confirmation': this.confirmpwd
            }
            axios
             .post('http://localhost:9999/api/register',data)
             .then(response=>{
                  //console.log(response.data);
                 if(response.data){
                     window.location.href='/';
                 }else{
                     alert("Registration Not Done");
                 }
             })
        }
    }
}
</script>