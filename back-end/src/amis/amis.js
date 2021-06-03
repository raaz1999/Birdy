const express=require("express");
const bodyParser = require('body-parser')
const data =require("sqlite3");
const friends = require("./class/amisclass.js");

//par azoui rayane

/*
api rest pour ajouter et supprimer les amis 

dans cette api y'a des requetes de bloquer et debloquer non déployer 

api doc :

post : amis/bound :ajouter amis 
post: amis/unbound :supprimer un couple d'amis
get: amis/getfriends : récuperer tout les amis 



*/
function init(){

    const router =express.Router();    // creation de mon routeur 
         
    router.use(express.json());         // pour l'utilisation de json   

    router.use((req, res, next) => {            // pour afficher chaques requetes qu'on utilise 

        console.log('API: method %s, path %s', req.method, req.path);
        
        console.log('Body', req.body);
        
        next();
    });

    const db=new data.Database("frdsdata",(err)=>{   // creation du fichier avec la data base suivante
        
        if(err){
        
            throw err;
    
        }
    
    });
       

    const authen=(req, res, next) => {       // fonction qui va etre utiliser pour vérifier que l'utilisateur est bien authentifié

        if (req.session.auth) {
            next();
        } else {
            req.session.error = "You have to Login first";
        }
    }; 

    const user= new friends.default(db)   // transmettre  notre database a la classe 
 
    router.use(bodyParser.urlencoded({
    
        extended: true
      
    }));   // pour les requtes json

    router.post("/bound", authen,async (req, res) => {
        
        /*
        
        requete qui consiste de rendre deux utilisateur  ami 
        
        */
       

        const {user_id}=req.body   // recuperer l'id de l'ami que l'utilisateur veut ajouter a sa liste d'amis 

        if(!user_id){     //verification 

            res.status(401).json({
                "message" :"inserer l'ami que vous voudriez ajouter !"
            });
        }

        console.log("existance2")
        try{

            

            var existance1 =await user.exists(req.session.user_id,user_id,1) // verifier si les deux utilisateurs sont déja ami
            

                if(existance1!=0){
                     // mettre les deux utilsateur dans notre base de donnée 
                     res.status(201).json({
                        status:201,
                        "message":"c'est deux utilisateur sont deja amis !"
                    })
                    
                }else{
                  
                    var d=await user.bound(req.session.user_id,user_id)   //sinon on met c'est deux utilisateurs dans notre base de données
                    
                    res.status(201).json({
                        status :201,
                        "message": "ami ajouter"
                    }
                    )
            }
        

        }catch(e){  // en cas de reject on affiche l'erreur sourvenue 

            res.status(401).json({
                status :401,
                "message": "propablement dans reject",
                "error":e
        })

        }
       
    });






    router.post("/unbound", async(req,res)=>{

        const {friends_id}=req.body   // recuperer l'id de l'ami que l'utilisateur veut supprimer de sa liste d'amis 


        
        if(!friends_id){     //verification 

            res.status(401).json({
                status:401,
                "message" :"inserer l'ami que vous voudriez supprimer !"
            
            });
            return;
        }else{
            try{
                
                        
                if(await user.unBound(req.session.user_id,friends_id)){
                    res.status(201).json({
                        status:201,
                        "message":"c'est deux utilisateurs ne sont plus ami :( "
                        })
                            return;
                        }
                

            }catch(e){  // en cas de reject 

                res.status(401).json({
                    status :401,
                    "message": e
            })

        }
            
        }   
    });


   

    router.get("/getfriends",authen, async(req,res)=>{
        /*
        récuperer tout les amis
        */

        try{

        
        const data=await user.getfriends(req.session.user_id);

        res.json({
            status : 200,
            friends: data
        })


        }catch(e){

            res.json({
                status : 400,
                friends: "erreur",
                "error":e
            })

        }

    })
        
    
    return router;
}


exports.default = init;



/*
            var existance1 =await user.exists(req.session.user_id,friends_id,2) // verifier que les deux utilisateurs ne sont pas déja bloquer 
            var existance2 =await user.exists(friends_id,req.session.user_id,2) // dans les deux sens (moche comme méthode)


            if (existance1||existance2){ // renvoyer une erreur si les deux utilisateurs sont bloquer 
                res.status(401).json({
                    status:401,
                    "message":"c'est deux utilisateur sont blocker"
                })
                return;

            }else{
            */


                
    /*
    router.post("/block", authen,async (req, res) => {

        const {friends_id}=req.body   // recuperer l'id de l'ami que l'utilisateur veut ajouter a sa liste d'amis 

        if(!friends_id){     //verification 

            res.status(401).json({
                "message" :"inserer l'ami que vous voudriez ajouter !"
            });
        }


        try{


            var existance1 =await user.exists(req.session.user_id,friends_id,1)
            var existance2 =await user.exists(friends_id,req.session.user_id,1)


            if (existance1){
                
                await user.unBound(req.session.user_id,friends_id,1)

            }

            if(existance2){
                await user.unBound(friends_id,req.session.user_id,1)
            }
            

            var existance1 =await user.exists(req.session.user_id,friends_id,2)
            var existance2 =await user.exists(friends_id,req.session.user_id,2)

            if(existance2||existance1){
                // mettre les deux utilsateur dans notre base de donnée 
                res.status(201).json({
                status:201,
                "message":"c'est deux utilisateur sont deja bloquer !"
                })

                return;

            }else{
                
                    var d=await user.block(req.session.user_id,friends_id)   
                    res.status(201).json({
                        status :201,
                        "message": "ami bloquer"
                    })
            }
        

        }catch(e){  // en cas de reject 

            res.status(401).json({
                status :401,
                "message": e
        })

        }
       
    });
    */
/*
                var existance1 =await user.exists(req.session.user_id,friends_id,1) // verifier que c'est deux sont deja amis sinon 
                var existance2 =await user.exists(friends_id,req.session.user_id,1) // sa sert a rien de les sepparé 
                
                if(existance1){

                    if(await user.unBound(req.session.user_id,friends_id)){ //separer !
                        
                        res.status(201).json({
                            
                            status:201,
                            "message":"c'est deux utilisateurs ne sont plus ami :("
                        })
                        return;
                    }
                }else{

                    if(existance2){
                */



                         /*
    router.delete("/unblock", async(req,res)=>{

        const {friends_id}=req.body   // recuperer l'id de l'ami que l'utilisateur veut supprimer de sa liste d'amis 

        if(!friends_id){     //verification 

            res.status(401).json({
                status:401,
                "message" :"inserer l'ami que vous voudriez debloquer !"
            
            });
            return;
        }else{

            try{
            
                var existance1 =await user.exists(req.session.user_id,friends_id,2)
                var existance2 =await user.exists(friends_id,req.session.user_id,2)
                
                if(existance1){

                    if(await user.unBlock(req.session.user_id,friends_id)){
                        res.status(201).json({
                            status:201,
                            "message":"c'est deux utilisateurs ne sont plus bloquer "
                        })
                        return;
                    }
                }else{

                    if(existance2){
                        
                        if(await user.unBound(friends_id,req.session.user_id)){
                            res.status(201).json({
                                status:201,
                                "message":"c'est deux utilisateurs ne sont plus bloquer "
                            })
                            return;
                        }

                    }else{
                        res.status(401).json({
                            status:401,
                            "message":"c'est deux utilisateurs ne sont sont pas dans la liste des utilisateurs bloquer "
                        })
                        return;
                    }
                }

            }catch(e){  // en cas de reject 

                res.status(401).json({
                    status :401,
                    "message": e
            })

        }          
        } 
    });
    */