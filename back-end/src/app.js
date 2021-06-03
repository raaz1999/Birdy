const path = require('path');
express = require('express');
const session = require("express-session");
const NedbStore = require('nedb-session-store')(session);
const api_auth= require("./authentification/input.js")
const api_msg=require("./message/msg.js")
const app = express()
const api_ami=require("./amis/amis.js")



//const api = require('./api.js');

// Détermine le répertoire de base

const basedir = path.normalize(path.dirname(__dirname));

console.debug(`Base directory: ${basedir}`);


app.use(session({
    
    secret: "technoweb rocks",
   
    resave: false,  // pour mettre a jour notre db(session) a chaque modification de la session actuelle

    cookie: { maxAge: 100000000 },
   
    saveUninitialized: false, // pour sauvgarder que les sessions modifier 
   
    store: new NedbStore({
   
    filename: 'sessionsave.db'
   
    })
}));


//app.use('/api', api.default());
app.use('/message',api_msg.default());

app.use('/authentification',api_auth.default());


app.use('/amis',api_ami.default())


// Démarre le serveur

app.on('close', () => {

});
exports.default = app;

