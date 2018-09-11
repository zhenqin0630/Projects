import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Permission from '@/views/Permission'
import Resource from '@/views/Resource'
import Demand from '@/views/Demand'
import Mapping from '@/views/Mapping'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'Index',
            component: Index
        },
        {
            path: '/permission',
            name: 'Permission',
            component: Permission
        },
        {
            path: '/resource',
            name: 'Resource',
            component: Resource
        },
        {
            path: '/demand',
            name: 'Demand',
            component: Demand
        },
        {
            path: '/mapping',
            name: 'Mapping',
            component: Mapping
        },
        {
            path: '/*',
            name: 'Default',
            component: Index
        }
    ]
})