import Vue from 'vue'
import LoginPage from '@/views/login'

describe('login page', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(LoginPage)
    }).$mount()

    expect(vm.$el.querySelector('.title').textContent).to.contain('User Login')
  })
})
