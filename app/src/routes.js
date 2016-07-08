import Vue from 'vue'

export default {
  '/': {
    component: Vue.component('landing-page', require('./components/LandingPage')),
    name: 'landing-page'
  },
  '/refunds': {
    component: Vue.component('refunds', require('./components/Refunds')),
    name: 'refunds',
    subRoutes: {
      '/': {
        component: Vue.component('refunds-index', require('./components/refunds/Index')),
        name: 'index'
      },
      '/step-one': {
        component: Vue.component('refunds-step-one', require('./components/refunds/StepOne')),
        name: 'step1'
      },
      '/step-two': {
        component: Vue.component('refunds-step-two', require('./components/refunds/StepTwo')),
        name: 'step2'
      },
      '/step-three': {
        component: Vue.component('refunds-step-three', require('./components/refunds/StepThree')),
        name: 'step3'
      },
      '/step-four': {
        component: Vue.component('refunds-step-four', require('./components/refunds/StepFour')),
        name: 'step4'
      }
    }
  },
  '/coming-soon': {
    component: Vue.component('coming-soon', require('./components/ComingSoon')),
    name: 'coming-soon'
  }
}
