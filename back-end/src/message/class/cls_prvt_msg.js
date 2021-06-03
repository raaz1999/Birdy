

/*classe non deployer ni tester*/


class Message_prive{

    constructor(db){

        this.db=db

        this.db.loadDatabase()
        
    }





    insert(user_id,friend_id,message){

        return new Promise((resolve,reject)=>{

            this.db.findOne({id:"index"},(err,doc)=>{
                
                if(err){

                    reject("index not found")
                
                }else{

                    console.log("index");

                    console.log(doc);

                    this.db.insert({
                        
                        user_id:user_id,
                        
                        freind_id : friend_id,

                        message:message,
                
                        message_id:++doc.value,
                
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




    getMessage(data,user_id){
        // data =req.session
        return new Promise((resolve,reject)=>{
          
            
            let ma_requete={}

            ma_requete.user_id=user_id;

            if (data.friend_id){
                ma_requete.user_id=data.friend_id ;
            }



            if (data.message_id){
                ma_requete.message_id=data.message_id;
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


    delMessage(data,user_id){

        return new Promise((resolve,reject)=>{

            let ma_requete={}

          
            ma_requete.user_id=user_id;
            
            if (data.user_id){
                ma_requete.user_id=data.user_id ;
            }

            if (data.message_id){
                ma_requete.message_id=data.message_id;
            }


            this.db.remove(ma_requete,(err,doc)=>{
        
                if(err){
        
                    reject("Huston !; we have a problem(problem with del) ");
        
                }else{
        
                    resolve(doc);
        
                }
            })
        })
       
    
    }
    
    close(){
        this.db.close();
    }

}

exports.default =Message_prive;