<template>
  <div class="container-fluid">
    <div class="pb-2 mb-3 border-bottom"><h2>Posts</h2></div>

 <b-breadcrumb>
  <b-breadcrumb-item><router-link to="/dash">Dashboard</router-link></b-breadcrumb-item>
   <b-breadcrumb-item active>Posts</b-breadcrumb-item>
 </b-breadcrumb> 
 <b-container fluid>
    <b-row>
      <!----sorting---->
      <b-col lg="3" class="my-1">
        <b-form-group
          label="Sort"
          label-cols-sm="2"
          label-cols-lg="3"
          label-align-sm="left"
          label-size="sm"
          label-for="sortBySelect"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-select v-model="sortBy" id="sortBySelect" @change = "sorting()" :options="sortOptions" class="w-75">
              <template v-slot:first>
                <option value="">-- none --</option>
              </template>
            </b-form-select>
            <b-form-select v-model="sortDesc" size="sm" @change = "sorting()" :disabled="!sortBy" class="w-25">
              <option :value="false">Asc</option>
              <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>
    
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
              @keyup="getUsers();"
              id="filterInput"
              placeholder="Type to Search"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''; getUsers();">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>


      <!----perPage---->
      <b-col lg="4">
       <b-form-group
          label="Per page"
          label-cols-sm="6"
          label-cols-md="2"
          label-cols-lg="3"
          label-for="perPageSelect"
        >
          <b-form-select
            v-model="perPage"
            id="perPageSelect"
            size="sm"
            @change="count()"
            :options="pageOptions"
          ></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
 </b-container>
      <b-table 
          id= "my-table"
          striped
          hover
          :fields="fields" 
          :items="items" 
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :filtered="ordering()"
          responsive
      >


        <template v-slot:cell(id)="data">
           {{ data.index+1 }}
        </template>
     
        <template v-slot:cell(edit)="row">
           <b-icon icon="pencil" font-scale="2" @click="show(row.item); $bvModal.show('editModal')" variant="info"></b-icon>
        </template>

        <template v-slot:cell(delete)="row">
           <b-icon icon="trash-fill" font-scale="2"  @click="deletepost(row.item.id)" variant="danger"></b-icon>
        </template>
      </b-table>
      <hr>

    <!----pagination----> 
     <b-button-group style="float:right">
       <b-button variant="secondary"  @click="navigate(pagination.current_page-1);" :disabled="!pagination.prev_page_url">&laquo; Previous</b-button>
       <!-- <span> Page {{ pagination.current_page }} of {{ pagination.last_page }} </span> -->
       <b-button variant="secondary"  @click="navigate(pagination.current_page+1);" :disabled="!pagination.next_page_url"> Next &raquo;</b-button>
     </b-button-group>


   <!---Modal--->   
  <b-modal id="editModal">
    <template v-slot:modal-title>
      EDIT POST
    </template>
      <b-form>
      <!---hidden input--->
          <b-form-input
           type="text"
           v-model="unik"
           hidden
          ></b-form-input>
      <!---end--->
        <b-form-group
          id="input-group-1"
          label="TITLE"
        >
          <b-form-input
           id="input-1"
           type="text"
           v-model="title"
           required
          ></b-form-input>

        </b-form-group>

          <b-form-group
          id="input-group-2"
          label="CONTENT"
        >
          <b-form-textarea
           id="input-2"
           type="text"
           v-model="content"
           required
          ></b-form-textarea>
         
        </b-form-group>
      </b-form>
      <template v-slot:modal-footer>
        <b-button variant="secondary" @click="$bvModal.hide('editModal')">Close</b-button>
        <b-button variant="success"  @click="update(); $bvModal.hide('editModal');">Save Changes</b-button>
      </template>
  </b-modal>
  </div>
  
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.18/vue.min.js"></script>
<script type="text/javascript">
import Vue from "vue";
import axios from "axios";
import View from "@/views/View.vue";
import Router from "vue-router";
import Auth from "@/Auth.vue";
import router from "@/router.js";
Vue.use(Router);

export default {

  data() {
    return {
  
      items: [],
      fields:[{ key:'id',label:'SNO', sortable:'true',  },
              { key:'title',label:'TITLE', sortable:'true' },
              { key:'created_at',label: 'POSTED_AT', sortable:'true' },
              { key:'edit',label:'EDIT'},
              { key:'delete',label:'DELETE'}
             ],
      single: null,
      title: '',
      content: '',
      unik:'',
      url:'http://localhost:9999/api/paginateData',
      pagination: [],
      perPage:'10',
      pathname: '',
      pageOptions:[ 5, 10, 20],
      filter:null,
      sortBy:null,
      sortDesc: null,
      sortDirection: null,
      sortOptions: [ 'id','title', 'created_at']

    };
  },
  mounted() {
  
    if(!localStorage.getItem('access_token')){
      window.location.href='/';
    }
    this.getUsers();
    if(this.$route.query.perPage!==undefined){
      this.perPage = this.$route.query.perPage;
    }

    // if(this.$route.query.sortBy!==""){
    //     this.sortBy = this.$route.query.sortBy;
    // }


    // if(this.$route.query.sortDesc!==""){
    //     this.sortDirection = this.$route.query.sortDesc;
    // }

    if(this.$route.query.sortDesc == 'asc'){
         this.sortDesc = 'false';
         this.sortDirection = 'asc';
    }else{
         this.sortDesc = 'true';
         this.sortDirection = 'desc';
    }


  },


  
  methods: {
    ordering(){
           if(this.sortBy!=null){
             this.sorting();
           }
    },
  getUsers(){
    

    var headers = { 
      'Accept': 'application/json',
      Authorization : 'Bearer '+ localStorage.getItem('access_token')
    }


    let $this = this;

    axios
      .post(this.url+'?page='+this.$route.query.page, 
        { 
          perPage : this.$route.query.perPage,
          letter : this.filter,
          sortBy : this.$route.query.sortBy,
          sortDesc: this.$route.query.sortDesc,
        }, 
        { 
          headers: headers 
        })
      .then(response => {
        //console.log(response.data),
        (this.items = response.data.data)
        $this.makePagination(response.data)
      })
    }, 

    show(data){
        this.unik= data.id;
        this.title = data.title;
        this.content = data.content;
    },

    hide() {
      this.$modal.hide("md");
    },

    deletepost(id){
    const headers = { 
        'Accept': 'application/json',
         Authorization : 'Bearer '+ localStorage.getItem('access_token')
    }
    const data = { 'id': id}

         axios.post("http://localhost:9999/api/deletepost",data, {headers: headers})
         .then(response => {
              this.getUsers();
         })
    },


    update(){
        const headers = { 
         'Accept': 'application/json',
          Authorization : 'Bearer '+ localStorage.getItem('access_token')
        }
        const data = {             
            id : this.unik,
            title: this.title,
            content: this.content
        }
      axios.post("http://localhost:9999/api/updatepost",data, {headers: headers})
      .then(response => {

        this.getUsers();
      })
      .catch(error=>{
        console.log(error)
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
        var paths = window.location.href;
        var data = paths.split('?');
     
        if(data[1]==undefined){
             router.push({ path: '/view?page='+page, component:View  });
              var paths = window.location.href;
              var data = paths.split('?');
 
           
        }
         if(this.$route.query.page==undefined){
             router.push({ path: '/view?'+data[1]+'&page='+page, component:View  });
          }else{
             router.replace({ path: '/view?'+data[1], query: { page : page }, component: View});
          }

          
        this.getUsers();
          
    },
    count(){
       var paths = window.location.href;
       var data = paths.split('?');
        if(data[1]==undefined){
         router.push({ path: '/view?perPage='+this.perPage, component:View  });
         var paths = window.location.href;
         var data = paths.split('?');
        }
        if(this.$route.query.perPage==undefined){
          router.push({ path: '/view?'+data[1]+'&perPage='+this.perPage, component:View  });
        }else{
           router.replace({ path: '/view?'+data[1], query: { perPage : this.perPage }, component: View});
        }

        this.getUsers();

    },
    sorting(){
      if(this.sortDesc == false){
        var order = 'asc';
      }else{
        var order = 'desc';
      }

       var paths = window.location.href;
       var data = paths.split('?');

        if(data[1]==undefined){
         router.push({ path: '/view?sortBy='+this.sortBy+'&sortDesc='+order, component:View  });
         var paths = window.location.href;
         var data = paths.split('?');
         }

        if(this.$route.query.sortBy==undefined){
          router.push({ path: '/view?'+data[1]+'&sortBy='+this.sortBy+'&sortDesc='+order, component:View  });
        }else{
          router.replace({ path: '/view?'+data[1], query: { sortBy : this.sortBy, sortDesc: order }, component: View});
        }
   
      }
    }
    

};
 
</script>