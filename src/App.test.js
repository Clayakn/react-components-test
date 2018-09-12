import React from 'react';
import axios from 'axios';
import { doIncrement, doDecrement, Counter } from './App';
import App from './App';



// Testing Pure Functions
describe('Local State', () => {
  it('should increment the counter in state', () => {
    const state = { counter: 0 };
    const newState = doIncrement(state);

    expect(newState.counter).toEqual(1);
  });

  it('should decrement the counter in state', () => {
    const state = { counter: 0 };
    const newState = doDecrement(state);

    expect(newState.counter).toEqual(-1);
  });
});



describe('App Component', () => {
  // Use sinon to stub a promise
  const result = [3, 5, 9]
  const promise = Promise.resolve(result);
  beforeAll(() => {
    sinon.stub(axios, 'get').withArgs('http://mypseudodomin/counter').returns(promise)
  });

  afterAll(() => {
    axios.get.restore();
  });

  // Using shallow on App to see if App is rendering Counter component and given it proper props
  it('renders the Counter wrapper', () => {
    const wrapper = shallow(<App/>);
    expect(wrapper.find(Counter)).toHaveLength(1);
  });
  it('passes all props to Counter wrapper', () => {
    const wrapper =  shallow(<App/>);
    let counterWrapper = wrapper.find(Counter);
    expect(counterWrapper.props().counter).toEqual(0);
    wrapper.setState({ counter: -1 });

    counterWrapper = wrapper.find(Counter);
    expect(counterWrapper.props().counter).toEqual(-1)
  })
  // Testing to see if button click properly setState
  it('increments the counter', () => {
    const wrapper  = shallow(<App/>);

    wrapper.setState({ counter: 0 });
    wrapper.find('button').at(0).simulate('click');

    expect(wrapper.state().counter).toEqual(1)
  })
  it('decrements the counter', () => {
    const wrapper = shallow(<App/>);

    wrapper.setState({ counter: 0 });
    wrapper.find('button').at(1).simulate('click');

    expect(wrapper.state().counter).toEqual(-1);
  })
  // Spying on componentDidMount to see if it has been called
  it('calls ComponentdidMount', () => {
    sinon.spy(App.prototype, 'componentDidMount');

    const wrapper = mount(<App/>);
    expect(App.prototype.componentDidMount.calledOnce).toEqual(true)
  })

  // Test stub for async functionality
  it('fetches async counters', () => {
    const wrapper =  shallow(<App/>);
    expect(wrapper.state().asyncCounters).toEqual(null);

    promise.then(() => {
      expect(wrapper.state().asyncCounters).toEqual(result)
    })
  })
});


