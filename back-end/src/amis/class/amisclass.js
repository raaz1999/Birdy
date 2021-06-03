const express = require("express");
const { resolve } = require("path");

//par azoui rayane


/* 
CLASS : amis 
cette class est chargé de crée la base de donnée pour les couples d'amis 
ca fonction consiste a insere les nouveau amis 
verifier l'exitance de ces dernier 
*/

class clsfriends{
    
    constructor(db){
     
        this.db=db

        this.db.run("CREATE TABLE IF NOT EXISTS Friends (from_user INTEGER, to_user INTEGER )");
        //this.db.run("CREATE TABLE IF NOT EXISTS BlockedFriends (from_user INTEGER NOT NULL, to_user INTEGER NOT NULL, date TIMESTAMP NOT NULL)")
    }


    bound(from_user,to_user){
        /*
        @param from_user-le premier utilisateur
        @param to_user-le deusieme utilisateur 

        inserer un nouveau couple d'amis 
        */


        return new Promise((resolve,reject)=>{

            const requete="INSERT INTO Friends(from_user,to_user) VALUES(?,?)" //preparation de la requete
            
            this.db.all(requete, [from_user,to_user],(err, data)=>{   // inserer nos parametres dans notre db
                
                console.log(data)
                console.log(err)
               
                if(err){
                
                    reject("impossible de crée cette amitié !")
            
                }
                
                resolve("amitier crée !")

            })
        
            
        })
    }





    getfriends(user){
        /*
        @param user récuperer tout les amis du user(session actuelle ) 
        */

        const requete="SELECT to_user FROM Friends WHERE from_user=?"

        return new Promise((resolve,reject)=>{
        this.db.all(requete, [user], (err, data) => {
                
            if (err) {
                
                reject("erreur dans notre base de donnée ")
        
            }else{
                resolve(data)
            }
        })
    });

    }


    exists(from_user,to_user,rel){
        
        /*
        @param from_user-le premier utilisateur
        @param to_user-le deusieme utilisateur 
        @param int 1 for friends and 2 for blockfriends
        */

        return new Promise((resolve,reject)=>{
            
            let requete="SELECT from_user,to_user FROM Friends WHERE from_user=? AND to_user=?"   // verifier l'éxistance du couple d'amis dans la database des amis 

        

            this.db.all(requete, [from_user,to_user], (err, data) => {
                
                if (err) {
                    
                    reject("erreur dans notre base de donnée ")
            
                }else{
                    
                    
                    if (data.length != 0) {
            
                        resolve(1)  // 1 indique que le couple d'ami existe déja, 0 sinon 
            
                    } else {
            
                        resolve(0) //sinon
                    }
                }
            });
            
        })

    }

    unBound(from_user,to_user){
        /*
        @param from_user  l'identifiant de l'utilisateur actuelle
        @param to_user   l'identifiant de l'ami

        enlever le couple (from_user,to_user) de notre table des amis 
        */
        
        return new Promise((resolve,reject)=>{

            const stmt=this.db.prepare("DELETE FROM Friends WHERE from_user=? AND to_user=? ")
            
            stmt.run([from_user,to_user],(err)=>{
                
                if(err){
                
                    reject("probleme interne a la base de donnée friends");
            
                }

                console.log(this.us)
           
                resolve("thats sad !")
            
            })
        
            
        })
    }


    closedb(){

        this.db.close((err)=>{
            
        if(err){

            throw err
        }

        console.log("you succesfuly close your data base !!!!!!")
        
    })
    }
}

exports.default =clsfriends;


/* méthode non utilisé (pas eu de temps de la déployer) */
/*
    block(from_user,to_user){
        
        //@param from_user-le premier utilisateur
        //@param to_user-le deusieme utilisateur 
        


        return new Promise((resolve,reject)=>{

            const stmt=this.db.prepare("INSERT INTO BlockedFriends(from_user,to_user) VALUES(?,?)") //preparation de la requete
            
            stmt.run([from_user,to_user],(err)=>{   // inserer nos parametres dans notre db
                
                if(err){
                
                    reject("impossible blocker c'est deux utilisateurs !")
            
                }

                console.log(this.us)
           
                resolve("Now you two are  blocked !")
            
            })
        
            
        })
    }
*/

/*
    unBlock(from_user,to_user){
        
        return new Promise((resolve,reject)=>{

            const stmt=this.db.prepare("DELETE FROM BlockedFriends WHERE from_user=? AND to_user=? ")
            
            stmt.run([from_user,to_user],(err)=>{
                
                if(err){
                
                    reject("probleme interne a la base de donnée blockedfriends");
            
                }

                console.log(this.us)
           
                resolve("now you two are again friends weird relationship  !")
            
            })
        
            
        })
    }
*/
