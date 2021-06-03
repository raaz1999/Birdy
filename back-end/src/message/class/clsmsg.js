const { resolve } = require("path");


//par azoui rayane

//class des message //
class message{

    constructor(db){

        this.db=db

        this.db.loadDatabase()
        
    }





    insert(user_id,pseudo,message){

        return new Promise((resolve,reject)=>{

            this.db.findOne({id:"index"},(err,doc)=>{
                
                if(err){

                    reject("index not found")
                
                }else{

                    console.log("index");

                    console.log(doc);

                    this.db.insert({
                        
                        user_id:user_id,
                        
                        pseudo_name : pseudo,

                        message:message,
                
                        message_id:++doc.value,
                
                        comment: [],
                
                        date: new Date()

                    },(err)=> {
                        if(err){

                            reject("error with the insertion !")
                        
                        }else{
                        
                            this.db.update({id:"index"},{$set :{value:++doc.value}})
                            resolve("susses !")
                        
                        }
                    })
                }
            })
            
        });
    }






    
    getallMessage(){
        // data =req.session
        return new Promise((resolve,reject)=>{
          
            
            

            this.db.find({message_id:{ $exists: true }},(err,doc)=>{

                if(err){
        
                    reject("no data found !");
        
                }else{
                    

                    
                    resolve(doc.sort((a, b) => b.date - a.date));
        
                }
            })
        })
       
    
    }


    rechercheMsg(name,msg){

        return new Promise((resolve,reject)=>{    
            
            
            this.db.find({$and: [{ pseudo_name: new RegExp(name) }, { message:new RegExp(msg) }]},(err,doc)=>{

                if(err){
        
                    reject("no data found !");
        
                }else{
                    

                    
                    resolve(doc);
        
                }
            })
        })
    }

    getMessage(data){
        // data =req.session
        return new Promise((resolve,reject)=>{
          
            
            let ma_requete={}


            this.db.find
          
            
            if (data.user_id){
                ma_requete.user_id=data.user_id ;
            }

           
            if (data.pname){
                ma_requete.pseudo_name=data.pname;
            }


            if (data.message_id){
                ma_requete.message_id=data.message_id;
            }

            if(data.to_user){
                ma_requete.user_id=data.to_user;
            }

            this.db.find( ma_requete ,(err,doc)=>{

                if(err){
        
                    reject("no data found !");
        
                }else{
                    

                    
                    resolve(doc);
        
                }
            })
        })
       
    
    }


    delMessage(data){


        return new Promise((resolve,reject)=>{

            let ma_requete={}

            


            if (data.message_id){
                ma_requete.message_id=data.message_id;
            }

            
            this.db.remove(ma_requete,{},(err)=>{
               
                if(err){
        
                    reject("problem with del !");
        
                }else{
        
                    resolve(1);
        
                }
            })
        })
       
    
    }
    
    addcomment(data,pname){

        return new Promise((resolve,reject)=>{
           
            this.db.update({ message_id: data.message_id }, {$push: {comment:{'user_pseudo':pname, 'comment':data.comment}}}, {}, (err)=>{
               if (err){
                   console.log("rerr")
                   reject("add comment with issue ")
               }
               resolve("comment added with succes ")
            }); 
        });
    }


/* non utiliser*/
    delcomment(data){

        return new Promise((resolve,reject)=>{
            
            this.data.update({ message_id: data.message_id }, { $pull: {comment:{user_id: data.user_id, comment:data.comment}} }, {}, (err)=>{
               if (err){
                   
                   reject("sub comment with issue ")
               }
               
               resolve("comment subed with succes ")
            
            }); 

        });
    }



    

    close(){
        this.db.close();
    }

}

exports.default = message;