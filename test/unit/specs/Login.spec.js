import Vue from 'vue'
import Login from '@/views/login'

describe('login.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      template: '<div><login></login></div>',
      components: { Login }
    }).$mount()
    console.log(vm.$el)
    expect(vm.$el.querySelector('.title').textContent).to.contain('User Login')
  })
})
