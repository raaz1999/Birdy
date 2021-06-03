import React from 'react'
import './profil.css'



class Profilamis extends React.Component{



    constructor(props){
        super(props)

    }


    addfriend(){
        const data={
            user_id:this.props.ami.user_id
        }
        this.props.api_request.post('/amis/bound',data).then(response=>{

            alert("vous venez d'ajoute cette personne a votre liste d'amis")
            
        }).catch(e=>{
            console.log(e)
            console.log("Error")
        })
    }


    delme(){
        const data={
            friends_id:this.props.ami.user_id
        }

        console.log(data)

        this.props.api_request.post('/amis/unbound',data).then(response=>{

            alert("vous venez d'enlever cette personne de votre liste d'amis")
    
          }).catch(e=>{
        
             console.log("Error")
          })
    }

    render(){
        return(
            <div className="profil">
                
                <h1 onClick={()=>{this.props.gohome()}} >birdy</h1>


                    
                <div className="case">
                    nom : {this.props.ami.fname}
                </div>

                <div className="case">
                    prenom : {this.props.ami.lname}
                </div>

                <div className="case">
                    pseudo_name : {this.props.ami.pname}
                </div>


                <div className="case">
                    email : {this.props.ami.email}
                </div>


                <div className="two_buttons">

                    <button id="vert" onClick={()=>{this.addfriend()}}>ajouter {this.props.ami.pname}</button>
                    <button id="rouge" onClick={()=>{this.delme()}}>enlever {this.props.ami.pname} de votre liste d'amis </button>
                </div>
            
            </div>





        )
    }
}

export default Profilamis;