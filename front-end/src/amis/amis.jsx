

import React from 'react'




class Ami extends React.Component{
    constructor(props){
        super(props)
    }



    delme(){


        const data={
            friends_id:this.props.ami.user_id
        }

        console.log(data)

        this.props.api_request.post('/amis/unbound',data).then(response=>{

            this.props.update()
    
          }).catch(e=>{
        
             console.log("Error")
          })



    }






    render(){

        return (
           
            <div className="amis">

                <h3>{this.props.ami.pname}                       <small  onClick={()=>{this.delme()}} style={{color:'red',fontSize:10}}>X</small></h3>
                
            </div>
        
        )
    }
}





export default Ami