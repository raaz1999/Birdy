import React from 'react'
import "./recherche.css"
import Msgplc from "../message/msgplc.jsx"



class Recherche extends React.Component{
    
    constructor(props){
        super(props)


        this.ref_name=React.createRef()
        this.ref_msg=React.createRef()

        this.state={
            "msg":[]
        }
    }


    recherche(){
        const data={
            "name":this.ref_name.current.value,
            "mssg":this.ref_msg.current.value
        }


        this.props.api_request.post("/message/recherche_msg",data).then(response=>{

            console.log(response.data)

            this.setState({
                "msg":response.data.message
            })

        }).catch(e=>{
            console.log(e)
        })
    }

    render(){
        
        return(
            <div className='recherche'>
                	<header >
						<h1 onClick={()=>{this.props.gohome()}}>Birdy</h1>
                    </header>


                    <div className="info_msg">

                        <div id='bare_de_recherche'>
                            <label for="name">donnez le nom de l'utilisateur :</label>
                            <input type="text" name="name" ref={this.ref_name} placeholder="type..."/>
                            <label for="msg">contenu du message :</label>
                            <input type="text" name="msg" ref={this.ref_msg} placeholder="type..."/>
                            <button onClick={()=>{this.recherche()}}>chercher</button>
                        </div>


                        <div id="messages">
                            <h1>les messages</h1>

                            {
                                this.state.msg.map((msg)=>{
                                    return(<Msgplc  toto={msg}  api_request={this.props.api_request} update={()=>{this.update()}} />)
                                })
                            }
                        </div>





                    </div>
            </div>
        )
    }
}


export default Recherche;