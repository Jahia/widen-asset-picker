(this["webpackJsonpwiden-picker"]=this["webpackJsonpwiden-picker"]||[]).push([[0],{140:function(e,a,t){"use strict";t.r(a);var r=t(34),n=t(0),c=t.n(n),l=t(23),s=t.n(l),o=(t(81),t(10)),i=t.n(o),u=t(14),d=t(60),E=t.n(d),m=(t(83),t(19)),h=t.n(m),f=t(147),p=t(148),T=t(61),R=c.a.createContext(null),b=t(149),g=t(144),v=t(62),O=t(7),_=function(e){var a=c.a.useContext(R),t=a.state,r=a.dispatch,n=t.isLoading,l=function(){var e=Object(u.a)(i.a.mark((function e(a){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a.preventDefault(),r({case:"EXECUTE_QUERY"});case 2:case"end":return e.stop()}}),e)})));return function(a){return e.apply(this,arguments)}}();return c.a.createElement(b.a,{className:"pT4__form",onSubmit:l},c.a.createElement(b.a.Group,{controlId:"basicSearch"},c.a.createElement(g.a,{className:"mb-3"},c.a.createElement(b.a.Control,{type:"text",name:"query",onChange:function(e){var a=e.target.value;r({case:"UPDATE_TEXT_QUERY",payload:{searchQuery:a}})},placeholder:"Que cherchez-vous ?"}),c.a.createElement(g.a.Append,null,c.a.createElement(v.a,{type:"reset",variant:"outline-secondary",disabled:n,onClick:function(e){r({case:"RESET_TEXT_QUERY"})}},c.a.createElement(O.a,{icon:["fas","times"]}))),c.a.createElement(g.a.Append,null,c.a.createElement(v.a,{type:"submit",variant:"secondary",disabled:n},c.a.createElement(O.a,{icon:["fas","search"]})))),c.a.createElement(b.a.Text,{className:"text-muted"},c.a.createElement(O.a,{icon:["fas","power-off"]})," by Jahia For Widen")))},P=t(11),y=t(150),S=function(e){var a=e.item,t=c.a.useContext(R),r=t.state,n=t.dispatch,l=r.selectedItem,s=a.thumbnails,o=a.created_date,i=a.filename,u=a.id,d=a.embeds,E=h()(s,"160px.url",null),m=h()(d,"templated.url",null),f=new Date(o);f=f.toLocaleDateString("fr-FR",{weekday:"long",year:"numeric",month:"long",day:"numeric"});var p=l.id===u?"active":"";return c.a.createElement(y.a,{className:p,onClick:function(){return n({case:"UPDATE_SELECTED_ITEM",payload:{id:u,url:m}})}},E&&c.a.createElement(y.a.Img,{variant:"top",src:E}),c.a.createElement(y.a.Body,null,c.a.createElement(y.a.Title,null,i)),c.a.createElement(y.a.Footer,{className:"text-center"},f))},x=(t(145),t(6)),w=function(e){var a=e.searchResultPerPage;return{offset:(e.searchResultPageIndex-1)*a,limit:a}},A=function(e){var a=e.searchSortBy,t=e.searchSortByDirection,r=e.searchSortListDirection.filter((function(e){return e.value===t})),n=Object(P.a)(r,1)[0];return{sort:"".concat(n.symbol).concat(a)}},j=function(){var e=Object(u.a)(i.a.mark((function e(a){var t,r,n,c,l,s,o,u,d,E,m,f,p;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=a.path,r=void 0===t?"/":t,n=a.state,c=a.dispatch,l=n.widenEngine,s=n.searchQuery,n.searchFacets,n.searchFilters,o=n.searchResultPerPage,u=n.searchResultPageIndex,d=n.searchSortBy,E=n.searchSortByDirection,m=n.searchSortListDirection,c({case:"LOADING",payload:{value:!0}}),f=Object(x.a)(Object(x.a)({query:s,expand:"embeds,thumbnails,file_properties"},w({searchResultPerPage:o,searchResultPageIndex:u})),A({searchSortBy:d,searchSortByDirection:E,searchSortListDirection:m})),e.prev=4,e.next=7,l(r,{params:f});case 7:p=e.sent,c({case:"UPDATE_SEARCH_RESULTS",payload:{searchResults:h()(p,"data",{})}}),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(4),c({case:"ERROR",payload:{error:e.t0}});case 14:c({case:"LOADING",payload:{value:!1}});case 15:case"end":return e.stop()}}),e,null,[[4,11]])})));return function(a){return e.apply(this,arguments)}}(),I=function(e){var a=e.index,t=c.a.useContext(R),r=t.state,n=t.dispatch,l=r.searchResultPageIndex===a?"active":"";return c.a.createElement("li",null,c.a.createElement("a",{href:"#",className:l,onClick:function(e){e.preventDefault(),n({case:"GOTO_RESULT_PAGE",payload:{index:a}})}},a))},D=function(){var e=c.a.useContext(R).state.searchResultMaxPage;return c.a.createElement(c.a.Fragment,null,Object(r.a)(Array(e)).map((function(e,a){return c.a.createElement(I,{key:a,index:a+1})})))},L=function(){var e,a=c.a.useContext(R).state,t=a.searchResultPageIndex,r=a.searchResultMaxPage,n=t>3,l=r-t>2;switch(!0){case t<=2:e=[2,3];break;case r-t>1:e=[t-1,t,t+1];break;case r-t===1:e=[t-1,t];break;default:e=[t-2,t-1]}return c.a.createElement(c.a.Fragment,null,c.a.createElement(I,{index:1}),n&&c.a.createElement("li",{className:"interlayer"},c.a.createElement(O.a,{icon:["fas","ellipsis-h"]})),e.map((function(e,a){return c.a.createElement(I,{key:a,index:e})})),l&&c.a.createElement("li",{className:"interlayer"},c.a.createElement(O.a,{icon:["fas","ellipsis-h"]})),c.a.createElement(I,{index:r}))},U=function(){var e=c.a.useContext(R),a=e.state,t=e.dispatch,r=a.searchResultPerPage;return c.a.createElement("li",null,c.a.createElement(g.a,null,c.a.createElement(g.a.Prepend,null,c.a.createElement(g.a.Text,{id:"inputGroupPrepend"},c.a.createElement(O.a,{icon:["far","file-alt"]}))),c.a.createElement(b.a.Control,{as:"select",defaultValue:r,onChange:function(e){t({case:"UPDATE_RESULT_PER_PAGE",payload:{value:e.target.value}})},title:"Result per page"},[5,10,20,50,100].map((function(e){return c.a.createElement("option",{key:e,value:e},e)})))))},C=function(){var e=c.a.useContext(R),a=e.state,t=e.dispatch,r=a.isLoading,n=a.searchResultPageIndex,l=a.searchResultMaxPage,s=c.a.useState(n),o=Object(P.a)(s,2),i=o[0],u=o[1];c.a.useEffect((function(){u(n)}),[n]);return c.a.createElement("li",null,c.a.createElement(b.a,{className:"pT4__form-goto",onSubmit:function(e){e.preventDefault(),l<i||t({case:"GOTO_RESULT_PAGE",payload:{index:i}})}},c.a.createElement(g.a,null,c.a.createElement(g.a.Prepend,null,c.a.createElement(g.a.Text,{id:"inputGroupPrepend"},c.a.createElement(O.a,{icon:["far","paper-plane"]}))),c.a.createElement(b.a.Control,{type:"text",name:"paging",value:i,onChange:function(e){u(e.target.value)},title:"Goto Page"}),c.a.createElement(g.a.Append,null,c.a.createElement(v.a,{type:"submit",variant:"outline-secondary",disabled:r},c.a.createElement(O.a,{icon:["fas","sync-alt"]}))))))},F=t(146),k=t(73);function G(e,a){var t="";a.indexOf("a")>-1&&(t+="abcdefghijklmnopqrstuvwxyz"),a.indexOf("A")>-1&&(t+="ABCDEFGHIJKLMNOPQRSTUVWXYZ"),a.indexOf("#")>-1&&(t+="0123456789"),a.indexOf("!")>-1&&(t+="~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\");for(var r="",n=e;n>0;--n)r+=t[Math.floor(Math.random()*t.length)];return r}var N=function(){var e=c.a.useContext(R),a=e.state,t=e.dispatch,r=a.searchSortBy,n=a.searchSortByDirection,l=a.searchSortList,s=a.searchSortListDirection,o=l.filter((function(e){return e.value===r})),i=Object(P.a)(o,1)[0],u=s.filter((function(e){return e.value===n})),d=Object(P.a)(u,1)[0],E=function(e){var a=e.target.id;t({case:"UPDATE_SORT_ITEM",payload:{sortBy:a}})};return c.a.createElement(c.a.Fragment,null,c.a.createElement("li",null,c.a.createElement(F.a,{alignRight:!0,variant:"outline-dark",title:"Sort by ".concat(i.label),id:"sortBy_".concat(G(6,"aA#"))},l.map((function(e,a){return c.a.createElement(k.a.Item,{key:a,id:e.value,onClick:E},e.label)})))),c.a.createElement("li",null,c.a.createElement(v.a,{variant:"outline-dark",onClick:function(e){return t({case:"TOGGLE_SORT_DIRECTION"})}},c.a.createElement(O.a,{icon:["fas",d.label]}))))},M=function(e){var a=c.a.useContext(R),t=a.state,r=a.dispatch,n=(t.searchResultPerPage,t.searchResultMaxPage),l=t.searchResultAvailableAnswersCount,s=n>10;if(!n)return c.a.createElement(c.a.Fragment,null);return c.a.createElement(c.a.Fragment,null,c.a.createElement("ul",{className:"pT4__paging results"},c.a.createElement("li",{className:"results"},c.a.createElement("h6",null,"R\xe9sultats : ",l)),c.a.createElement(N,null),c.a.createElement(U,null),s&&c.a.createElement(C,null)),c.a.createElement("ul",{className:"pT4__paging"},c.a.createElement("li",{className:"nav"},c.a.createElement("a",{href:"#",onClick:function(e){e.preventDefault(),r({case:"PREVIOUS_RESULT_PAGE"})}},c.a.createElement(O.a,{icon:["fas","chevron-left"]}))),n<=5&&c.a.createElement(D,null),n>5&&c.a.createElement(L,null),c.a.createElement("li",{className:"nav"},c.a.createElement("a",{href:"#",onClick:function(e){e.preventDefault(),r({case:"NEXT_RESULT_PAGE"})}},c.a.createElement(O.a,{icon:["fas","chevron-right"]})))))},B=(t(90),t(24)),Q=t(69),X=t(9),Y=t(17);B.b.add(Q.a,X.i,X.h,Y.b,Y.e,X.a,X.m,X.n,X.o,Y.f,Y.a,X.d,X.b,X.c,X.g,X.e,X.f,Y.c,X.l,Y.d,X.j,X.k);var z=function(e){var a=e.e;return c.a.createElement(c.a.Fragment,null,c.a.createElement("h1",null,"Oups something get wrong"),c.a.createElement("p",null,a.message))},V=function(e){var a=c.a.useContext(R),t=a.state,r=a.dispatch,n=(t.context,t.error),l=t.isLoading,s=t.searchAnswers,o=(t.searchIframe,t.searchFacets,t.needToFetch);return c.a.useEffect((function(){o&&function(){var e=Object(u.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,j({path:"/assets/search",state:t,dispatch:r});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()()}),[o]),n?c.a.createElement(z,{e:n}):c.a.createElement(f.a,{className:"pT4"},c.a.createElement(p.a,null,c.a.createElement(T.a,null,c.a.createElement(_,null),c.a.createElement(M,null))),c.a.createElement(p.a,null,c.a.createElement(T.a,null,l&&c.a.createElement("img",{className:"pT4__spinner",src:E.a}),!l&&c.a.createElement("div",{className:"pT4__result ".concat(l?"":"fade-in")},s.map((function(e){return c.a.createElement(S,{key:e.id,item:e,locale:t.locale})})))),c.a.createElement(T.a,{xs:"4",sm:"3",md:"4",lg:"3"})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var q=function(e){var a=e.item,t=e.errors;return c.a.createElement("div",null,c.a.createElement("h1",null,"Validation errors"),c.a.createElement("p",null,"An error occurred when validating ",c.a.createElement("b",null,a)),c.a.createElement("ul",null,t.map((function(e,a){return c.a.createElement("li",null,e.dataPath," : ",e.message)}))))},W=t(70),J={context:{title:"context validation schema ",description:"context is an object provided by the page in charge to load the app",type:"object",properties:{host:{type:"string",format:"uri",default:"http://localhost:8080"},workspace:{type:"string",enum:["default","live"],default:"live"},scope:{type:"string",pattern:"[a-zA-Z0-9-_]+",default:"lamode"},widen:{type:"object",properties:{url:{type:"string",format:"uri",default:"https://api.widencollective.com"},site:{type:"string",default:"virbac"},token:{type:"string",default:"ba4d0a71907a17aff9ebddc1fc91fd3a"},version:{type:"string",default:"v2"},lazyLoad:{type:"boolean",default:JSON.parse("false")},resultPerPage:{type:"integer",default:Number.parseInt("20",10)}},required:["url","site","token","version","lazyLoad","resultPerPage"],additionalProperties:!1}},required:["host","workspace","scope","widen"],additionalProperties:!1}},H=new W({useDefaults:!0}),Z=t(71),$=t.n(Z),K=function(e){var a=$.a.create({baseURL:"".concat(e.widen.url,"/").concat(e.widen.version),headers:{"Content-Type":"application/json",Accept:"application/json",Authorization:"Bearer ".concat(e.widen.site,"/").concat(e.widen.token)},responseType:"json",timeout:3e3}),t=e.widen,r=t.lazyLoad,n=t.resultPerPage;return{context:e,error:null,isLoading:!1,needToFetch:!r,selectedItem:{},widenEngine:a,searchAnswers:[],searchIframe:null,searchSortBy:"created_date",searchSortByDirection:"DESC",searchSortList:[{value:"created_date",label:"Date Added"},{value:"last_update_date",label:"Date Updated"},{value:"filename",label:"Filename"},{value:"file_format",label:"File Format"},{value:"file_size",label:"File Size"}],searchSortListDirection:[{value:"ASC",label:"sort-amount-up",symbol:""},{value:"DESC",label:"sort-amount-down",symbol:"-"}],searchQuery:null,searchFacets:[],searchFilters:[],searchBanners:[],searchResultPerPage:Number.parseInt(n,10),searchResultMaxPage:null,searchResultPageIndex:1,searchResultAvailableAnswersCount:null}},ee=function(e,a){var t=a.payload;switch(a.case){case"UPDATE_TEXT_QUERY":return console.debug("[STORE] UPDATE_TEXT_QUERY - query: ",t.searchQuery),Object(x.a)(Object(x.a)({},e),{},{searchQuery:t.searchQuery});case"RESET_TEXT_QUERY":return console.debug("[STORE] RESET_TEXT_QUERY"),Object(x.a)(Object(x.a)({},e),{},{searchQuery:"",needToFetch:!0});case"EXECUTE_QUERY":return console.debug("[STORE] EXECUTE_QUERY"),Object(x.a)(Object(x.a)({},e),{},{searchResultPageIndex:1,needToFetch:!0});case"UPDATE_SELECTED_ITEM":var r=t.url;return console.debug("[STORE] UPDATE_SELECTED_ITEM - payload: ",t),console.log("[STORE] UPDATE_SELECTED_ITEM - window.widenPickerInterface: ",window.widenPickerInterface),window.widenPickerInterface.add(r),console.log("[STORE] UPDATE_SELECTED_ITEM - window.widenPickerInterface.data: ",window.widenPickerInterface.data),Object(x.a)(Object(x.a)({},e),{},{selectedItem:t});case"UPDATE_SEARCH_RESULTS":console.debug("[STORE] UPDATE_SEARCH_RESULTS - searchResults: ",t.searchResults);var n=t.searchResults,c=n.items,l=n.total_count,s=e.searchResultPerPage,o=e.searchResultPageIndex,i=e.searchResultMaxPage,u=l;return 1===o&&(i=Math.ceil(u/s)),Object(x.a)(Object(x.a)({},e),{},{searchAnswers:c,searchResultAvailableAnswersCount:u,searchResultMaxPage:i,needToFetch:!1});case"TOGGLE_FILTER":var d=t.filter;console.debug("[STORE] TOGGLE_ANSWER -> filter id :",d.id);var E=e.searchFacets.reduce((function(e,a,t){return a.id===d.type&&(e=[a,t]),e}),[]),m=Object(P.a)(E,2),h=m[0],f=m[1],p=h.list.map((function(e){return e.id===d.id?Object(x.a)(Object(x.a)({},e),{},{selected:!e.selected}):e}));h=Object(x.a)(Object(x.a)({},h),{},{list:p});var T=e.searchFacets.slice();return T.splice(f,1,h),console.debug("[STORE] searchFacets :",T),Object(x.a)(Object(x.a)({},e),{},{searchFacets:T,searchResultPageIndex:1,needToFetch:!0});case"REMOVE_FILTER":var R=t.filter;console.debug("[STORE] REMOVE_FILTER -> filter id :",R.id);var b=e.searchFacets.filter((function(e){return e.id!==R.id}));console.debug("[STORE] searchFacets :",b);var g=e.searchFilters.filter((function(e){return e.id!==R.id}));return Object(x.a)(Object(x.a)({},e),{},{searchFacets:b,searchFilters:g,searchResultPageIndex:1,needToFetch:!0});case"ERROR":return console.debug("[STORE] ERROR - searchResults: ",t.error),Object(x.a)(Object(x.a)({},e),{},{error:t.error});case"LOADING":return console.debug("[STORE] LOADING - value: ",t.value),Object(x.a)(Object(x.a)({},e),{},{isLoading:t.value});case"PREVIOUS_RESULT_PAGE":if(console.debug("[STORE] PREVIOUS_RESULT_PAGE"),e.searchResultPageIndex<=1)return Object(x.a)({},e);var v=e.searchResultPageIndex-1;return Object(x.a)(Object(x.a)({},e),{},{needToFetch:!0,searchResultPageIndex:v});case"NEXT_RESULT_PAGE":console.debug("[STORE] NEXT_RESULT_PAGE");var O=e.searchResultMaxPage;if(e.searchResultPageIndex>=O)return Object(x.a)({},e);var _=e.searchResultPageIndex+1;return Object(x.a)(Object(x.a)({},e),{},{needToFetch:!0,searchResultPageIndex:_});case"GOTO_RESULT_PAGE":console.debug("[STORE] GOTO_RESULT_PAGE payload : ",t);var y=Number(t.index),S=e.searchResultMaxPage;return!y||y<1||y>S?Object(x.a)({},e):Object(x.a)(Object(x.a)({},e),{},{needToFetch:!0,searchResultPageIndex:y});case"UPDATE_RESULT_PER_PAGE":console.debug("[STORE] UPDATE_RESULT_PER_PAGE payload : ",t);var w=t.value;return Object(x.a)(Object(x.a)({},e),{},{searchResultPerPage:w,searchResultPageIndex:1,needToFetch:!0});case"UPDATE_SORT_ITEM":console.debug("[STORE] UPDATE_SORT_ITEM payload : ",t);var A=t.sortBy;return Object(x.a)(Object(x.a)({},e),{},{searchSortBy:A,needToFetch:!0});case"TOGGLE_SORT_DIRECTION":console.debug("[STORE] TOGGLE_SORT_DIRECTION");var j=e.searchSortByDirection,I=e.searchSortListDirection.filter((function(e){return e.value!=j})),D=Object(P.a)(I,1)[0];return Object(x.a)(Object(x.a)({},e),{},{searchSortByDirection:D.value,needToFetch:!0});default:return Object(x.a)(Object(x.a)({},e),{},{error:new Error("[STORE] action case '".concat(a.case,"' is unknown "))})}},ae=function(e){var a=c.a.useReducer(ee,e.context,K),t=Object(P.a)(a,2),r=t[0],n=t[1];return c.a.createElement(R.Provider,{value:{state:r,dispatch:n}},e.children)},te={_context:{},_data:[],get context(){return this._context},get data(){return this._data},set context(e){this._context=e},set data(e){this._data=e},load:function(e){console.log(e.d),void 0!==e.d&&Array.isArray(e.d)&&(te.data=Array.from(e.d))},add:function(e,a){return this.data=[].concat(Object(r.a)(this.data),[e]),this.data},remove:function(e){this.data=this.data.filter((function(a){return!a.endsWith(e)}))},removeAt:function(e){return-1!==e?(this.data=this.data.splice(e,1),this.data):null},removeAll:function(){te.data=[]}};window.widenPicker=function(e,a){try{a=function(e){if(!H.validate(J.context,e))throw{item:"Context configuration object",errors:H.errors};return e}(a);s.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(ae,{context:a},c.a.createElement(V,null))),document.getElementById(e))}catch(t){console.error("error : ",t),s.a.render(c.a.createElement(q,{item:t.item,errors:t.errors}),document.getElementById(e))}},window.widenPickerInterface=te,"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},60:function(e,a,t){e.exports=t.p+"modules/widen-picker/icons/loader_4.a6ec563b.gif"},76:function(e,a,t){e.exports=t(140)},81:function(e,a,t){},83:function(e,a,t){}},[[76,1,2]]]);
//# sourceMappingURL=main.04d1bee9.chunk.js.map