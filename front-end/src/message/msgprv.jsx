import React from 'react'
import './msgprv.css'


class Messageprv extends React.Component{
    constructor(props){
        super(props)
    }




    render(){

        return(
            <div className="message">
                <header>
				<h1     onClick={()=>{this.props.gohome()}}>Birdy</h1>    				
				<button id ='deconnect_message' >deconnexion</button>
		        </header>

		        <div className="mere">
			
                    <div className="amis" >

                        <div id="rayane">

                            <p><h3>Rayane</h3></p>

                            
                        </div>

                    </div>

			        <span className="vertical-line"></span>


			        <div className="chatt">

				        <div id="conversation">

				        </div>


				        <div id="messagetext">

					        <hr id ="message"/>
					        <input type="text" name="message" id="message"/><button>submit</button>
					
				        </div>

			        </div>

                </div>
            </div>
        )

    }
}


export default Messageprv;