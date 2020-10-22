import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from 'components/App';
import * as serviceWorker from 'misc/serviceWorker';

import AjvError from "components/Error/Ajv";
import {contextValidator} from "douane";
import {Store} from "components/Store";

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
    try{
        // console.log("context : ",JSON.stringify(context));
        context = contextValidator(context);
        const headers={};
        // if(context.gql_authorization)
        //     headers.Authorization=context.gql_authorization;

        // const client = new ApolloClient({
        //     uri:context.gql_endpoint,
        //     headers
        // })

        ReactDOM.render(
            <Store context={context}>
                <App />
            </Store>,
            document.getElementById(target)
        );

        // ReactDOM.render(
        //     <React.StrictMode>
        //         <Store context={context}>
        //             {/*<ApolloProvider client={client}>*/}
        //             <App />
        //             {/*</ApolloProvider>*/}
        //         </Store>
        //     </React.StrictMode>,
        //     document.getElementById(target)
        // );

    }catch(e){
        console.error("error : ",e);
        //TODO create a generic error handler
        ReactDOM.render(
            <AjvError
                item={e.item}
                errors={e.errors}
            />,
            document.getElementById(target)
        );
    }

    // ReactDOM.render(
    //     <React.StrictMode>
    //         <App />
    //     </React.StrictMode>,
    //     document.getElementById(target)
    // );
}

window.widenPicker = render;
window.widenPickerInterface = widenPickerInterface;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
