// import jCustomer from "./definitions/jCustomer";
// import jContent from "./definitions/jContent";
// import gql from "./definitions/gql";
import {workspace} from "douane/lib/config";

export default{
    context:{
        title:"context validation schema ",
        description:"context is an object provided by the page in charge to load the app",
        // definitions: {
        //     jContent:jContent,
        //     jCustomer:jCustomer,
        //     gql:gql
        // },
        type:"object",
        // properties:{
        //     jContent:{$ref:"#jContent"},
        //     gql:{$ref:"#gql"},
        //     jCustomer:{$ref:"#jCustomer"}
        // },
        properties:{
            //"fr" or "fr-FR" TODO voir si je suis permissif et accpete 'fr'
            host:{
                type:"string",
                format:"uri",
                default:process.env.REACT_APP_JCONTENT_HOST || "http://localhost:8080"
            },
            workspace:{
                type:"string",
                enum:workspace,
                default:process.env.REACT_APP_JCONTENT_WORKSPACE || workspace[1]//"live"
            },
            scope:{
                type:"string",
                pattern:"[a-zA-Z0-9-_]+",//iso
                default:process.env.REACT_APP_JCONTENT_SCOPE
            },
            widen:{
                type:"object",
                properties:{
                    url:{
                        type:"string",
                        format:"uri",
                        default:process.env.REACT_APP_WIDEN_ENDPOINT //could be null in case of edit!
                    },
                    site:{
                        type:"string",
                        default:process.env.REACT_APP_WIDEN_SITE
                    },
                    token:{
                        type:"string",
                        default:process.env.REACT_APP_WIDEN_TOKEN
                    },
                    version:{
                        type:"string",
                        default:process.env.REACT_APP_WIDEN_VERSION
                    },
                    lazyLoad:{
                        type:"boolean",
                        default:JSON.parse(process.env.REACT_APP_WIDEN_LAZY_LOAD)
                    },
                    resultPerPage:{
                        type:"integer",
                        default:Number.parseInt(process.env.REACT_APP_WIDEN_RESULT_PER_PAGE, 10)
                    }
                    // locale:{
                    //     type:"object",
                    //     properties:{
                    //         user:{
                    //             type:"string",
                    //             pattern:"^[a-z]{2}$",//"[a-z]{2}(?:-[A-Z]{2})?"
                    //             default:process.env.REACT_APP_WIDEN_USER_LOCALE
                    //         },
                    //         search:{
                    //             type:"string",
                    //             pattern:"^[a-z]{2}-[A-Z]{2}$",
                    //             default:process.env.REACT_APP_WIDEN_SEARCH_LOCALE
                    //         }
                    //     },
                    //     required: ["user", "search"],
                    //     additionalProperties:false
                    //
                    // },
                },
                required: ["url", "site","token","version","lazyLoad","resultPerPage"],//,"locale"
                additionalProperties:false
            },
            // cdp_endpoint:{
            //     type:"string",
            //     format:"uri",
            //     default:process.env.REACT_APP_JCUSTOMER_ENDPOINT //could be null in case of edit!
            // },
            // cdp_token:{
            //     type:"string",
            //     default:process.env.REACT_APP_JCUSTOMER_TOKEN
            // },
            // gql_endpoint:{
            //     type:"string",
            //     format:"uri",
            //     default:process.env.REACT_APP_JCONTENT_GQL_ENDPOINT || "http://localhost:8080/modules/graphql"
            // },
            // gql_authorization:{
            //     type:"string",
            //     default:process.env.REACT_APP_JCONTENT_GQL_AUTH || "Basic cm9vdDpyb290"
            // },
            // gql_variables:{
            //     type:"object",
            //     properties:{
            //         language:{
            //             type:"string",
            //             pattern:"[a-z]{2}(?:_[A-Z]{2})?",//"fr" or "fr_FR"
            //             default:process.env.REACT_APP_WIDEN_USER_LOCALE
            //         }
            //
            //     },
            //     required: ["language"],
            //     additionalProperties:false
            // },
            // files_endpoint:{
            //     type:"string",
            //     format:"uri",
            //     default:process.env.REACT_APP_JCONTENT_FILES_ENDPOINT || "http://localhost:8080/files/live"
            // }
        },
        required: [
            "host",
            "workspace",
            "scope",
            "widen",
            // "cdp_endpoint",
            // "cdp_token",
            // "gql_endpoint",
            // "gql_authorization",
            // "gql_variables",
            // "files_endpoint"
        ],
        additionalProperties:false
    }
}