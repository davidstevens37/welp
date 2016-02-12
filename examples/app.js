import React from 'react';
import ReactDOM from 'react-dom';

import {WelpComponent, WelpStore, WelpDispatcher} from './../lib/Welp';

const button_styles = { display: 'block', marginTop: 15};


const UPDATE_NUMBER = 'UPDATE_NUMBER';
const ROLLBACK_CHANGES = 'ROLLBACK_CHANGES';
const SAVE_CHANGES = 'SAVE_CHANGES';

function update_number(value) {
  WelpDispatcher.dispatch({
    type: UPDATE_NUMBER,
    data: value
  });
}

function revert_changes() {
  WelpDispatcher.dispatch({
    type: ROLLBACK_CHANGES
  });
}

function save_changes() {
  WelpDispatcher.dispatch({
    type: SAVE_CHANGES
  });
}

const HelloStore = new WelpStore(
  {hello: {
    count: 0
  }},
  action => {
    switch (action.type) {
      
      case UPDATE_NUMBER:
        return HelloStore.replace(HelloStore.data().updateIn(['hello', 'count'], _ => action.data));
        
      case SAVE_CHANGES:
        HelloStore.replaceClean(HelloStore.data());
        HelloStore.emitChange();
        return HelloStore.data();
        
      case ROLLBACK_CHANGES:
        return HelloStore.rollback();
    }
  }
);

class App extends WelpComponent {
  constructor(props) {
    super(props, [HelloStore]);
    this.handleUpdateNumberChange = this.handleUpdateNumberChange.bind(this);
  }
  handleUpdateNumberChange() {
    return update_number(this.state.hello.count + 1);
  }
  handleSaveChanges() {
    return save_changes();
  }
  handleRevertChanges() {
    return revert_changes();
  }
  render() {
    return (
      <div>
        <p>Hello world! {this.state.hello.count}</p>
        <button onClick={this.handleUpdateNumberChange}>Add + 1</button>
        {
          HelloStore.isDirty() ?
          <div>
            <button style={button_styles} onClick={this.handleSaveChanges}>Save</button>
            <button style={button_styles} onClick={this.handleRevertChanges}>Revert Changes</button>
          </div>
          : ''
        }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('example'));
