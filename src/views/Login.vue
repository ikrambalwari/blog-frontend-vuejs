<template>
<div class="container">
<div class="sidenav">
         <div class="login-main-text">
            <h2>Application<br> Login Page</h2>
            <p>Login or register from here to access.</p>
         </div>
      </div>
      <div class="main">
         <div class="col-md-8 col-sm-12">
            <div class="login-form">
               <b-alert v-model="alerts"  variant="danger" dismissible>{{ errors }}</b-alert>
               <b-form>
                   <b-form-group
                      id="input-group-1"
                      label-for="input-1"
                   >
                   <b-form-input 
                       id="input-1"
                       type="email"
                       v-model="email"
                       required
                       placeholder="Enter Email"
                   ></b-form-input>
                   </b-form-group>
                   <b-form-group
                       id="input-group-2"
                       label-for="input-2"
                   >
                   <b-form-input
                       id="input-2"
                       type="password"
                       v-model= "pwd"
                       required
                       placeholder ="Password"
                   ></b-form-input>
                
                   </b-form-group>

                  <b-button type="button"  @click="login()" variant="success">Login</b-button>&nbsp;
                  <b-button type="button"  @click="register()" variant="primary">Register</b-button>
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
         email: '',
         pwd: '',
         errors: [],
         alerts:false
      }
   },

   methods: {
      login() {

         var data = {'email' : this.email,'password': this.pwd}
          
         axios
         .post('http://localhost:9999/api/login', data
        )
         .then(response => {
            console.log(response)
            if(response.data['id']){
               localStorage.setItem('id', response.data['id']);
               localStorage.setItem('access_token' , response.data['access_token']),
               window.location.href='/dash';
           }else{
              this.errors = response.data.message
              this.alerts = true;
           }
         })
         .catch(error => {
             console.log(error);
             this.errors = 'Email and Password Field is mandatory';
             this.alerts = true;
         })
      },

      register(){
         window.location.href='/register'
      }
   }
}
</script>

