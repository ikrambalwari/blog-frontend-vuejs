import Vue from "vue";
import Auth from "./Auth"
import Router from "vue-router";
import Home from "./views/Home.vue";
import AddPost from "./views/AddPost.vue";
import View from "./views/View.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Admin from "./views/Admin.vue";
import Customer from "./views/Customers.vue";
import Dashboard from "./views/Dashboard.vue";
Vue.use(Router);


export default new Router ({
     mode: "history",
     base: process.env.BASE_URL,
     routes: [
        {
            path: "/",
            name: "login",
            component: Login
        },
        {
            path: "/register",
            component: Register
        },
        {
            path: "/admin",
            component: Admin
        },
        {
         path: "/auth",
         component: Auth,
         children : [
             {
                 path: "/dash",
                 component: Dashboard
             },
             {
                 path: "/home",
                 component: Home
             },
             {
                path: "/addpost",
                name: "addpost",
                component: AddPost
             },
             {
                path: "/view",
                name: "view",
                component: View
             },

             {
                 path: "/users",
                 name: "users",
                 component: Customer
             }
              
         ]
       },
    ]
});