<template>
    <div class="container-fluid">
    <div class="pb-2 mb-3 border-bottom"><h2>Users</h2></div>
 <b-breadcrumb>
  <b-breadcrumb-item><router-link to="/dash">Dashboard</router-link></b-breadcrumb-item>
   <b-breadcrumb-item active>Users</b-breadcrumb-item>
 </b-breadcrumb>  
      
<b-button variant="success" size="sm" @click="$bvModal.show('userModal')">+AddNewUser </b-button>
       
        <!---Table--->
            <!---Search--->
      <b-col lg="4" class="my-1">
        <b-form-group
          label="Filter"
          label-cols-sm="2"
          label-cols-lg="3"
          label-align-sm="left"
          label-size="sm"
          label-for="filterInput"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              @keyup="getUsers()"
              id="filterInput"
              placeholder="Type to Search"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''; getUsers();" >Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
        <b-table
          striped
          hover
          responsive
          show-empty
          :fields = fields
          :items = items
        >

          <template v-slot:cell(id)="row">
              {{ row.index+1 }}
          </template>

          <template v-slot:cell(details)="row">
              <b-icon icon="eye-fill" font-scale="2"  @click="$bvModal.show('showDetails'); getDetails(row.item);" variant="info"></b-icon>
          </template>

          <template v-slot:cell(actions)="row">
              <b-icon icon="pencil" font-scale="2" @click="editDetails(row.item); $bvModal.show('updateUserModal');" variant="info"></b-icon>
              <b-icon icon="trash-fill" font-scale="2" @click="deleteUser(row.item.id);" variant="danger"></b-icon>
              <b-icon icon="unlock-fill" v-if="row.item.blocked==0" font-scale="2" @click="blockUser(row.item.id);" variant="danger"></b-icon>
              <b-icon icon="lock-fill" v-if="row.item.blocked==1" font-scale="2" @click="unblockUser(row.item.id);" variant="danger"></b-icon>
          </template>

        </b-table>

        <!---Table end--->

    <!----pagination----> 
     <b-button-group style="float:right">
       <b-button variant="secondary"  @click="navigate(pagination.current_page-1);" :disabled="!pagination.prev_page_url">&laquo; Previous</b-button>
       <!-- <span> Page {{ pagination.current_page }} of {{ pagination.last_page }} </span> -->
       <b-button variant="secondary"  @click="navigate(pagination.current_page+1);" :disabled="!pagination.next_page_url"> Next &raquo;</b-button>
     </b-button-group>

        <!---Details Modal--->

        <b-modal id="showDetails">
            <template v-slot:modal-title>
               USER INFO
            </template>

            <div class="form-group">
               <p> <b>ID:</b> {{ data.id }} </p>
               <p> <b>Name:</b> {{ data.name }} </p>
               <p> <b>Email:</b> {{ data.email }} </p>

            </div>
        </b-modal>

        <!---Modalend--->

        <!---User Modal--->

        <b-modal id="userModal">
            <template v-slot:modal-title>
               <b>Add User</b>
            </template>

            <div class="form-group">
                <b-form-group
                  id="input-group-1"
                  label="Name"
                >
                
                  <b-form-input
                     id="input-1"
                     type="text"
                     v-model= "userdata.name"
                     placeholder= "Enter User Name"
                     required
                  ></b-form-input>
                </b-form-group>
 
                <b-form-group
                  id="input-group-2"
                  label="Email"
                >
                
                  <b-form-input
                     id="input-2"
                     type="text"
                     v-model= "userdata.email"
                     placeholder= "Enter User Email"
                     required
                  ></b-form-input>
                </b-form-group>


                <b-form-group
                  id="input-group-3"
                  label="Password"
                >
                
                  <b-form-input
                     id="input-3"
                     type="password"
                     v-model= "userdata.password"
                     placeholder= "password"
                     required
                  ></b-form-input>
                </b-form-group>


                <b-form-group
                  id="input-group-4"
                  label="Confirm Password"
                >
                
                  <b-form-input
                     id="input-4"
                     type="password"
                     v-model= "userdata.confirm_pwd"
                     placeholder= "confirm_pwd"
                     required
                  ></b-form-input>
                </b-form-group>
            </div>


            <template v-slot:modal-footer>
                <b-button variant="secondary" @click= "$bvModal.hide('userModal');">close</b-button>
                <b-button variant="success" @click="addUser(); $bvModal.hide('userModal');">Add</b-button>
            </template>
        </b-modal>

        <!---UserModalend--->


         <!---UpdateUserModal--->

        <b-modal id="updateUserModal">
            <template v-slot:modal-title>
               <b>Update User</b>
            </template>
            

            <!---hidden input---->
            <input type="hidden" v-model = "update.userId">


            <div class="form-group">
                <b-form-group
                  id="input-group-1"
                  label="Name"
                >
                
                  <b-form-input
                     id="input-1"
                     type="text"
                     v-model= "update.name"
                     placeholder= "Enter User Name"
                     required
                  ></b-form-input>
                </b-form-group>
 
                <b-form-group
                  id="input-group-2"
                  label="Email"
                >
                
                  <b-form-input
                     id="input-2"
                     type="text"
                     v-model= "update.email"
                     placeholder= "Enter User Email"
                     required
                  ></b-form-input>
                </b-form-group>
            </div>


            <template v-slot:modal-footer>
                <b-button variant="secondary" @click= "$bvModal.hide('updateUserModal');">close</b-button>
                <b-button variant="success" @click="updateUser(); $bvModal.hide('updateUserModal');">Save Changes</b-button>
            </template>
        </b-modal>

        <!---UpdateUserModalend--->
    </div>
</template>


<script>
import axios from "axios";
import router from "@/router.js"
import Customers from "@/views/Customers.vue"; 
export default {
    data() {
        return {
            items:[],
            url:"http://localhost:9999/api",
            fields:[
                {key:"id", label:"SNO"},
                {key:"name", label:"NAME"},
                {key:"email", label:"EMAIL"},
                {key:"details", label:"SHOW DETAILS"},
                {key:"actions", label:"ACTIONS"},
     
            ],
            data: {
                id:'',
                name:'',
                email:''
            },
            userdata: {
                name:'',
                email:'',
                password:'',
                confirm_pwd:''
            },
            update: {
                name: '',
                email: '',
                userId: ''
            },
            pagination: [],
            filter:null
        }
    },
    mounted(){
    if(!localStorage.getItem('access_token')){
      window.location.href='/';
    }
    
    //onload  method
    this.getUsers();

    },
    methods: {
        getUsers(){
            
            let $this = this;
            var headers = {Authorization: 'Bearer '+localStorage.getItem("access_token")}
            axios.post(this.url + "/customers?page="+this.$route.query.page, { letter: this.filter } ,{headers:headers})
            .then(response => {
              this.items = response.data.data;
              $this.makePagination(response.data);
            })
        },
        getDetails(data){
            this.data.id = data.id;
            this.data.name = data.name;
            this.data.email = data.email;
        },
        deleteUser(id){
        this.$bvModal.msgBoxConfirm('Please confirm that you want to delete this User.', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => {
                if(value == true){
                  var headers = {Authorization: 'Bearer '+localStorage.getItem("access_token")}
                  axios.post(this.url+'/deleteUser',{id:id}, {headers: headers})
                  .then(response => {
                    console.log(response.data);
                   this.getUsers();
                   })
                   .catch(error=> {
                    console.log(error);
                    })
                  }
          })
        },
        addUser(){
            var headers = {Authorization: 'Bearer '+localStorage.getItem("access_token")}
            var data = { name: this.userdata.name, email: this.userdata.email, password: this.userdata.password, password_confirmation: this.userdata.confirm_pwd}
            axios.post(this.url+'/adduser',data, {headers: headers})
            .then(response => {
                console.log(response);
                this.userdata.name = '';
                this.userdata.email = '';
                this.userdata.password = '';
                this.userdata.confirm_pwd = '';
                this.getUsers(); 
            })
        },
        editDetails(data){
          
          this.update.userId = data.id;
          this.update.name = data.name;
          this.update.email = data.email
        },
        updateUser(){
            var headers = {Authorization: 'Bearer '+localStorage.getItem("access_token")}
            var data = { name: this.update.name, email: this.update.email, userId: this.update.userId }
            axios.post(this.url+'/updateUser',data, {headers: headers})
            .then(response => {
                console.log(response),
                this.getUsers()
            })
        },
        makePagination(data){
      let pagination = {
        current_page : data.current_page,
        last_page : data.last_page,
        next_page_url : data.next_page_url,
        prev_page_url : data.prev_page_url
      }
      this.pagination = pagination;
    },
    
    navigate(page){
       router.push({ path: '/users?page='+page, component:Customers  });
       this.getUsers();
      },
    blockUser(id){
            var headers = {Authorization: 'Bearer '+localStorage.getItem("access_token")}
            axios.post(this.url+'/blockUser',{ id: id}, {headers: headers})
            .then(response => {
                console.log(response),
                this.getUsers()
            })
    },
    unblockUser(id){
            var headers = {Authorization: 'Bearer '+localStorage.getItem("access_token")}
            axios.post(this.url+'/unblockUser',{ id: id}, {headers: headers})
            .then(response => {
                console.log(response),
                this.getUsers()
            })
    },
    }
}
</script>