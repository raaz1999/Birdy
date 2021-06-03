const express=require("express");
const bodyParser = require('body-parser')
const data =require("sqlite3");
const New_user = require("./classe/new_user.js");

//par azoui rayane

/*
api doc : 
cette api authentifcation renvoi un routeur responsable de ces 3 requetes :
post /authentification/registre : responsable de la creation des utilisateurs 
post /authentification/login : creation de ta session et entre dans ton profil 
get /authentification/logout : supprimer la session et renvoyer l'utilisateur de son profil 
get  /authentification/allusers : recuperer tout les utilisateurs
post /authentification/change password : pour changer le mots de passe 
del /authentification/delete_user :supprimer un utilisateur
*/





function init(){

    /* 
    fonction init : renvoi un routeur avec les requetes suivantes 
    */

    const router =express.Router();       // creation du routeur 
         
    router.use(express.json());         // configuré le routeur pour utiliser le format json 

    router.use((req, res, next) => {          // afficher les requetes solicites par le serveur 

        console.log('API: method %s, path %s', req.method, req.path);
        
        console.log('Body', req.body);
        
        next();
    });

    const db=new data.Database("mydata",(err)=>{        //  creation de notre fichier data base (sql) qui contiendra la table des utilisateurs 
        
        if(err){
        
            throw err;
    
        }
    
    });
       
    const user= new New_user.default(db)                    //  passe la data base en arg au constructeur pour eviter que notre class crée a chaque foit une nouvelle data base 
 
    router.use(bodyParser.urlencoded({
    
        extended: true
      
    }));

    router.post("/register", async (req, res) => {        //requette pour la création de l'utilisateur 
        
        try{

            const {email , first_name, last_name, password, pseudo_name}=req.body

            if(!email || !first_name || !last_name || !password || !pseudo_name){    // verifier que tout les informations sont la 

                res.status(401).json({      // renvoyer un message d'erreur sous forme json 
 
                    status: 401,            
                    
                    "message": "Requête invalide : il faut remplire tout les champs !"
                
                })
                
                return;
            }
            
            
            if(await user.exists(email,pseudo_name)){   // une verification de l'existance de cette utilisateur 
                
                res.status(401).json({
                
                    status: 500,
                
                    "message": "l'utilisateur existe deja !!"
                
                })

            }else{

                if(await user.register(email,first_name,last_name,password,pseudo_name)){ // creation de notre utilisateur 

                    res.status(201).json({
                
                        status: 200,
                    
                        "message": "utilisateur crée !"
                    
                    })
               
                }

            }
                
               

        }catch(err){
            
            res.status(500).json({

                status: 500,
                
                message: err,
    
            });
        }
    })



    router.post("/login", async(req,res)=>{

        const {email, password}=req.body    //recupérer l'email et le password du body    



        try{
        const data=await user.existsuser(email,password) // si l'utilisateur a entré les bons identifiant on lui crée sa session 

           

            
            req.session.user_id=data.user_id      // session contiendra le user id 
            
            req.session.pseudo_name=data.pname   // pseudo name 
            
            req.session.auth=true       // l'agrement du serveur 
            
            


            res.status(201).json({
                status:201,
                "message":"seesion open !"
            })
        
        }catch(e){
            

            console.log(e)
            res.json({
        
                status: 500,
        
                "message": "error"
            });
            
        }

        return;
        
    });
    
    const authen=(req, res, next) => {       // fonction qui va etre utiliser par la requete qui le suive afin de verifier que l'utilisateur et bien authentifier 
        
        if (req.session.auth) {
        
            next();
        
        } else {
        
            req.session.error = "You have to Login first";
        
            res.redirect("/login_page");
        }
    }; 

   router.get("/allusers",authen,async(req,res)=>{
       try{
        const data=await user.gealltuser()
        res.json({
            status :200,
            users: data
        })

       }catch(e){
        res.json({
            status : 403,
            'message':"couldn't get users from our data base"

        })
       }
   })
    
    router.post("/user",authen,async(req,res)=>{
        try{

            const data=await user.getuser(req.session.user_id)

            res.status(201).json({
                status:201,
                user : data
            })

        }catch(e){
            res.status(500).json({
                status:500,
                "message": "erreur pendant la récupération du user !"
            })
        }
    })

    router.get("/logout",async(req,res)=>{      // requete pour le logout et pour la destruction de ta session 
    
        
        req.session.destroy((err) => {
            

            try{

                if (err) throw err;
    
                res.status(201).json({
                    status:201,
                    "message":"session fermer"
                })


            }catch(e){
                res.json({
                    status:400,
                    "message":"error session non fermer !"
                })
            }
           
    
        });
    
    })


    router.put("/change_password", authen,async(req,res)=>{ // authen pour vérifier que l'utilisateurs s'est bien authentifié
        
        try{
            const {password}=req.body // récuperer le nouveau mot de passe 

            if(!password){    

                res.status(401).json({      
 
                    status: 401,            
                    
                    "message": "ajouter le nouveau mots de passe "
                
                })
                
                return;
            }

            const d=await user.changepassword(req.session.user_id,req.session.pname,password)

            if(d){
                res.status(201).json({ // en cas de succés 

                    status:201,
                    
                    message :d
                })
            }

        }catch(e){

            res.status(401).json({      
 
                status: 401,            
                
                "message": e
            
            })
        }
    });
    

    router.delete("/delete_user",authen,async(req,res)=>{//delete l'utilisateur actuelle (sa session doit etre ouverte )
        
        try{
            console.log("here")
            var d=await  user.delete(req.session.user_id)     

            if(d){

                res.status(201).json({      
 
                    status: 201,            
                    
                    "message": d
                
                })
                
                return;
            }
        }catch(e){
            res.status(401).json({
                status:401,
                "message":e
            })
        }
    })
    return router;
}


exports.default = init;