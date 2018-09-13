import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App program_id={document.getElementById('root').getAttribute('data-program-id')}/>, document.getElementById('root'));
registerServiceWorker();
