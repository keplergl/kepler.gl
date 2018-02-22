// required by enzymev3
const configure = require('enzyme').configure;
const Adapter = require('enzyme-adapter-react-15.4');
configure({adapter: new Adapter()});

import './injector-test';
import './container-test';
import './data-table-model-test';
