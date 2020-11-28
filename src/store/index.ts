import { createStore } from 'vuex';
import { auth } from "./auth.store";
import { home } from "./home.store";

export const store = createStore({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        auth,
        home
    },
})
