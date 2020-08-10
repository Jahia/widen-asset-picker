import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from 'components/App';
import * as serviceWorker from 'misc/serviceWorker';

const widenPickerInterface = {
    _context: {},
    _data: [],

    get context() {
        return this._context;
    },
    get data(){
        return this._data;
    },

    set context(contextData) {
        this._context = contextData;
    },

    set data(data){
        this._data = data;
    },

    load: function (values) {
        console.log(values.d);
        if (values.d !== undefined && Array.isArray(values.d)) {
            widenPickerInterface.data = Array.from(values.d);
        }
    },

    add: function (path, product) {
        this.data = [...this.data,path];
        return this.data;
    },

    remove: function (path) {
        this.data = this.data.filter( item => !item.endsWith(path) );
    },

    removeAt: function (index) {
        if(index !== -1) {
            this.data = this.data.splice(index, 1);
            return this.data;
        }
        return null;
    },

    removeAll: function () {
        widenPickerInterface.data = [];
    },

    // get: function () {
    //     return productPickerData.data;
    // }

};

const render = (target,context) =>{
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById(target)
    );
}

window.widenPicker = render;
window.widenPickerInterface = widenPickerInterface;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
