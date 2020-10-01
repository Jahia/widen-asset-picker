
const _WEAKREFERENCE_ = "WEAKREFERENCE";
//TODO voir si avec SDL je peux passe l'URL des images!
function getProperties(properties,context){
    if(!properties) return;
    return properties.reduce(function(bundle,property){
        const key = property.name.split(":").pop();
        let value = property.value || property.values;
// console.log("property : ",property);
        if(property.type === _WEAKREFERENCE_ &&
            property.weakreference &&
            property.weakreference.path
        ){
            property.weakreference.url=
                `${context.files_endpoint}${encodeURI(property.weakreference.path)}`;
            value = property.weakreference;
        }

        bundle[key]=value;
        return bundle;
    },{});
};

// function getWeakURL(filesEndpoint,nodePath){
//     return `${filesEndpoint}${encodeURI(nodePath)}`;///encodeURIComponent()
// };

function getRandomString (length, format){
    let mask = "";
    if (format.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
    if (format.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (format.indexOf("#") > -1) mask += "0123456789";
    if (format.indexOf("!") > -1) mask += "~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\";
    let result = "";
    for (let i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
};

function getGQLWorkspace(workspace){
    return workspace==="default"?
        "EDIT":
        workspace.toUpperCase()
}

export {
    getProperties,
    getRandomString,
    getGQLWorkspace
}