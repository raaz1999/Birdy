const express=require("express");
const bodyParser = require('body-parser')
const Datastore = require('nedb')
const message= require("./class/clsmsg.js");
const mesgprv=require("./class/cls_prvt_msg.js")
const { Router } = require("express");




//par azoui rayane


/*
api requete :
post message/make_msg: crée des messages
post message/get_msg: recuperer les messages
get message/get_msg_unique: pour recuperer les messages propre a l'utilisateur actuel
post message/del_message : supprimer message
post message/add_comment : ajouter commentaire
post message/recherche_msg: recherhce de message
*/



function init(){

    const router =express.Router();
    
    const db=new Datastore('msgdata.db')   // creation de notre database  
    const dbprivate= new Datastore("prvmsgdata.db")

    db.loadDatabase()      // telecharger le fichier 

    db.find({id:"index"},(err,data)=> {  // pour numéroter les messages
        

        if(data.length==0){                    

            db.insert({id:'index',value:-1});
        
        }
    
    })

    const msg=new message.default(db);
    const msgprvt=new mesgprv.default(dbprivate)


    router.use(express.json());

    router.use((req, res, next) => {

        console.log('API: method %s, path %s', req.method, req.path);
        
        console.log('Body', req.body);
        
        next();
    
    });
   
    router.use(bodyParser.urlencoded({
      
        extended: true
    
    }));

    const authen=(req, res, next) => {

        if (req.session.user_id) {
        
            next();
        
        } else {
        
            req.session.error = "You have to Login first";
        
            res.json({
                "session " :"session fermé !"
            });
        
        }
    }; 


    router.post("/make_msg",authen,async(req,res)=>{
        
        try{
            
            const {message}=req.body 

            if(!message){

                res.status(400).json({
                
                    status: 400,
                
                    "message": "message introuvable"
                
                })
                
                return;
            }
            
            if(await msg.insert(req.session.user_id,req.session.pseudo_name,message)){
            
                allmsg=await msg.getMessage(req.session)
                
                allmsg.sort(function(a,b){// ordonner les messages par dates d'apparition
                    
                    return -1*(new Date(b.date) - new Date(a.date)) ;
                });

                


                res.status(200).json({
                    status:201,
                    "message" :"message ajouté"
                })

            }

        }catch(err){
            
            res.status(500).json({
                
                status: 500,
                
                message: err,
                
                details: ("Erreur inconnue de catch").toString()
           
            });
        }
    })


    router.post("/get_msg",authen, async(req,res)=>{
        /*
        récuperer les message de tes amis
        */

        try{


                        
            let allmsg=await msg.getMessage(req.session);

            const {users}=req.body

            for (const elem of users){
                
                const d=await msg.getMessage(elem)
                if(d.length!=0){
                    allmsg=allmsg.concat(d)
                }
            }




            res.status(200).json({
                "data":allmsg
            });
        
        }catch(err){
            
            res.status(500).json({
               
                status: 500,
               
                message: "erreur interne",
               
               
            
            })
         }
 
    })



    router.get("/get_msg",authen, async(req,res)=>{
        /*
        récuperer tout les messages de tout les utilisateurs
         */
        try{



                        
            let allmsg=await msg.getallMessage();

            res.status(200).json({
                "data":allmsg
            });
        
        }catch(err){
            
            res.status(500).json({
               
                status: 500,
               
                message: "erreur interne",
               
               
            
            })
         }
 
    })





    router.post("/get_msg_unique",authen, async(req,res)=>{

        try{


                        
            let allmsg=await msg.getMessage(req.session);

            res.status(200).json({
                "data":allmsg
            });
        
        }catch(err){
            
            res.status(500).json({
               
                status: 500,
               
                message: "erreur interne",
               
               
            
            })
         }
 
    })




    

    router.post("/del_message",authen, async(req,res)=>{

        try{
             
             const d=await msg.delMessage(req.body)
            
           if(d==1){

            res.status(200).json({
                'message':"message supprimer"
            })

           }
           throw Error;

        }catch(err){
            
            res.status(500).json({

                status: 500,
                
                message: "erreur interne",
            
            });
        }    
    })




    router.post("/add_comment",authen, async(req,res)=>{

        
        try{
        
         
           if(await msg.addcomment(req.body,req.session.pseudo_name)){

            res.status(200).json({
                status : 200,
                'message':'commentaire ajouter'
            })

           }else{

            res.json({
                status : 403,
                'message':'commentaire non ajouter'
            })
           }

           

           

     
        }catch(err){
            
            res.json({

                status: 500,
                
                message: "un reject de add_comment ",
            
            });
        }    
    })



    router.delete("/del_comment",authen, async(req,res)=>{

        try{
             
           if(await msg.delmessage(req.body)){

            res.status(200).send(allmsg);

           }
           throw Error;

           

     
        }catch(err){
            
            res.status(500).json({

                status: 500,
                
                message: "erreur interne",
                
                details: ("Erreur inconnue ta3 catch").toString()
            
            });
        }    
    })

    
    router.post("/recherche_msg",authen,async(req,res)=>{

        const {name,mssg}=req.body


        try{
            const message=await msg.rechercheMsg(name,mssg)



            res.status(201).json({
                status:201,
                "message":message

            })
        }catch(e){
            console.log(e)


            res.json({
                status:500,
                "message":"erreur interne",
                "erreur":e
            })
        }
       



    })


  





    return router;

}


exports.default = init;



/*

    router.post("/private_message",authen,async(req,res)=>{
         
        try{
            
            const {message,friend_id}=req.body 

            if(!message||!friend_id){

                res.status(400).json({
                
                    status: 400,
                
                    "message": "rempli la case des messages privé"
                
                })
                
                return;
            }
            
            if(await msgprvt.insert(req.session.user_id,friend_id,message)){
            
                res.status(201).json({
                    status:201,
                    "message": "succes !"
                })
                return;

            }


            

        }catch(err){
            
            res.status(500).json({
                
                status: 500,
                
                message: err,
                
                details: ("Erreur inconnue ta3 catch").toString()
           
            });
        }
    })


    router.delete("/delete_private_message",authen,async(req,res)=>{
        try{
            
            const {message_id,friend_id}=req.body 

            if(!message||!friend_id){

                res.status(400).json({
                
                    status: 400,
                
                    "message": "rempli la case des messages privé"
                
                })
                
                return;
            }
            
            if(await msgprvt.del(req.body,re.session.user_id)){
            
                res.status(201).json({
                    status:201,
                    "message": "succes !"
                })
                return;

            }


            

        }catch(err){
            
            res.status(500).json({
                
                status: 500,
                
                message: err,
                
                details: ("Erreur inconnue de catch").toString()
           
            });
        }
    })*/



      /*
    router.get("/get_private_Message",authen,async(req,res)=>{

        try{
                        
            const allmsg=await mesgprv.getMessage(req.body,req.session.user_id);

            res.status(200).redirect("");

        
        }catch(err){
            
            res.status(500).json({
               
                status: 500,
               
                message: "erreur interne",
            
            
            })  }



    })*/