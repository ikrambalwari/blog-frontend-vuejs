<template>
  <div>

<img src="https://top2bottomcleaning.com/wp-content/uploads/2018/11/cleaning-blog.jpg" width="100%">
  <hr>

    <!----pagination----> 
 <div class="pagination" style="float:left">
     <b-button variant="outline-success" size="sm" @click="navigate(pagination.current_page-1);" :disabled="!pagination.prev_page_url">&laquo; Previous</b-button>
   <span> <h4>Page {{ pagination.current_page }} of {{ pagination.last_page }} </h4></span>
     <b-button variant="outline-success" size="sm" @click="navigate(pagination.current_page+1);" :disabled="!pagination.next_page_url"> Next &raquo;</b-button>
  </div>
  <br/>


  <div v-for="post in posts" :key="post.id">
   <div class="mt-4">
    <b-card img-src="https://picsum.photos/250/250/?image=54" img-alt="Card image" img-left class="mb-3">
      <h4>{{ post.title }}</h4>
      <b-card-text>
          {{ post.content }}
      </b-card-text>
    </b-card>
   </div>
  </div>
    <!-- <center>
      <div v-for="post in posts" :key="post.id">
        <hr />
        <div class="span8">
          <h4>
            <strong>
              <a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Title: {{ post.title }}</a>
            </strong>
          </h4>
        </div>
       <div>
      <div>
      <b-container fluid class="p-4 bg">
       <b-row>
       <b-img center thumbnail fluid src="https://picsum.photos/250/250/?image=54" alt="Image 1"></b-img>
       </b-row>
      </b-container>
      </div>
     <div class="span6">
         <p>Description: {{ post.content }}</p>
       </div>
      </div>
    </div>
  </center> -->

</div>
</template>

<script>
import axios from "axios";
import router from "@/router.js";
import Home from "@/views/Home.vue";

 export default {


  data () {
    return {
      posts: null,
      pagination: []
    }
  },
  mounted () {
    if(!localStorage.getItem('access_token')){
      window.location.href='/';
    }
    this.getPosts();

  },
 methods: {
     getPosts(){
       var headers = { Authorization : 'Bearer '+ localStorage.getItem('access_token') }
        let $this = this;
      this.loading = true;
    axios
      .get('http://localhost:9999/api?page='+this.$route.query.page, { headers: headers })
      .then(response => { 
        this.posts = response.data.data;
        $this.makePagination(response.data);
      })
     },
     post(){
       window.location.href='/addpost';
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

        router.push({ path: '/home?page='+page, component:Home  });

        this.getPosts();
          
    }
  
 }
 }

</script>