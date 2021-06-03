import React from 'react'
import './profil.css'
import Msgplcperso  from '../message/msgplcperso.jsx'
import Msgplc from '../message/msgplc.jsx'
import Ami from '../amis/amis.jsx'

class Profil extends React.Component{



    constructor(props){
        super(props)
        this.state={
            "profil" :{},
            "message":[],
            "users":[]
        }
    }


    getuserinformation(){
        this.props.api_request.post('/authentification/user').then(response=>{

            this.setState({
                "profil" : response.data.user
            })

            
        }).catch(e=>{
            console.log("Error")
        })
    }

    users(){

		this.props.api_request.get("/authentification/allusers").then(response=>{
				
			const users=response.data.users

			this.setState({
					'users': users
			})

		}).catch(err=>{
			console.log("Error")
		})
	}



    update(){

		let data={}

		this.props.api_request.get('/amis/getfriends').then(response=>{
			
            console.log("ici le probleme")

            console.log(response.data.friends)
			
			data={
				'users':response.data.friends
			}






            console.log(this.state.users)

            const data2=[]

            for(let elem in data.users){
              
                for(let elem2 in this.state.users){
                    if (data.users[elem].to_user===this.state.users[elem2].user_id){
                        
                        data2.push(this.state.users[elem2])
                        break
                    }
                }
                
            }
            console.log("data2")

            console.log(data2)

            this.setState({
                'message':this.state.message,
                'users': data2
            })



			
		}).then((h)=>{

				this.props.api_request.post('/message/get_msg_unique').then((response)=>{

					console.log(response.data.data)
		
					this.setState({
							'message' : response.data.data
					})
						
			}).then((e)=>{
                

                for(let elem in this.state.user)
                this.props.api_request.post("/authentification/user")



            })

		}).catch((e)=>{
			console.log(e)
		})

	}



    
    componentDidMount(){

        this.users()
        this.getuserinformation()
        this.update()
    }


    


    render(){
        return(
            <div className="profil">
                
                <h1 onClick={()=>{this.props.gohome()}} >birdy</h1>
              
                    
                <div className="case">
                    nom : {this.state.profil.fname}
                </div>


                <div className="case">
                    prenom : {this.state.profil.lname}
                </div>

                <div className="case">
                    pseudo_name : {this.state.profil.pname}
                </div>


                <div className="case">
                    email : {this.state.profil.email}
                </div>


                <div className="info">

                <div className="message">

                        <h1 onClick={()=>{this.update()}}>les messages</h1>
  
						{
							
                                this.state.message.map((msg,index)=>{
                                    console.log(msg)
                                    return(
                                    
                                    
                                    <Msgplcperso  toto={msg}  api_request={this.props.api_request} update={()=>{this. this.users()
                                        this.getuserinformation()
                                        this.update()}} />
                                            
                                    )									
                                })
                                
                        }	

                </div>


                <div className="friends">

                        <h1 onClick={()=>{this.update()}}>les amis :</h1>

                        <ul>
                            {
                                this.state.users.map(elem=>{
                                    return(
                                        <Ami ami={elem} api_request={this.props.api_request}/>
                                    )
                                })
                            }
                        </ul>


                </div>

                </div>


               
                


            
            </div>

        )
    }
}

export default Profil;