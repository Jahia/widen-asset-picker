const schema = {
    context:{
        title:"context validation schema ",
        description:"context is an object provided by the page in charge to load the app",
        type:"object",
        properties:{
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
                    mountPoint:{
                        type:"string",
                        default:process.env.REACT_APP_WIDEN_MOUNT_POINT
                    },
                    lazyLoad:{
                        type:"boolean",
                        default:JSON.parse(process.env.REACT_APP_WIDEN_LAZY_LOAD)
                    },
                    resultPerPage:{
                        type:"integer",
                        default:Number.parseInt(process.env.REACT_APP_WIDEN_RESULT_PER_PAGE, 10)
                    }
                    //"fr" or "fr-FR" TODO voir si je suis permissif et accpete 'fr'
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
                required: ["url", "site","token","version","lazyLoad","resultPerPage","mountPoint"],//,"locale"
                additionalProperties:false
            },
        },
        required: [
            "widen",
        ],
        additionalProperties:false
    }
}

export default schema;