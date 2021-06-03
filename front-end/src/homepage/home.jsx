import React from 'react'
import './home.css';
import Msgplc from '../message/msgplc.jsx'
import Profilamis from '../profil/profilamis.jsx'



class Home extends React.Component {


	constructor(props){
		super(props)
		this.ref_msgtxt=React.createRef();

		this.state={
			'message':[],
			'users' :[]
		}

		this.ref_bare_de_recherche=React.createRef();
		
	}

	users(){

		this.props.api_request.get("/authentification/allusers").then(response=>{
				
			const users=response.data.users

			this.setState({
					'message':this.state.message,
					'users': users
			})

			console.log("ici state")
			console.log(this.state.users)

		}).catch(err=>{
			console.log("Error")
		})
	}


	update(){

		let data={}

		this.props.api_request.get('/amis/getfriends').then(response=>{
			console.log(response.data.friends)
			
			data={
				'users':response.data.friends
			}
			
		}).catch((e)=>{
			console.log(e)
		})


		this.props.api_request.get('/message/get_msg').then((response)=>{

			this.setState({
							'message' : response.data.data
					})
						
		}).catch((e)=>{
			console.log(e)
		})

	}

	componentDidMount(){
		this.update()
		this.users()
	}
/*
	componentDidUpdate(){
		this.update()
	}*/
	newmsg(){
		const data={
            'message':this.ref_msgtxt.current.value,

        }


		this.props.api_request.post('/message/make_msg',data).then(response=>{

			this.update()

		}).catch(e=>{

		})

	
	}


	amis(){

		this.state.users.map(elem=>{
			if (elem.pname===this.ref_bare_de_recherche.current.value){
				this.props.goami(elem);
				
			}
		})

		
	}




	render(){

		return (
			<div className="App">
				<header >
						<h1  onClick={()=>{this.update()   }}>Birdy</h1>
						<input list="users" type="text" name="recherche" ref={this.ref_bare_de_recherche}/>
						<datalist id="users">
							{
							this.state.users.map((elem)=>{
								 return(<option value={elem.pname} ></option>)
							})
							}
						</datalist>
						<button id="recherche" onClick={()=>{this.amis()}} >recherche</button>
						<button id="recherche_msg" onClick={this.props.gosearch}>recherche message </button>
						<button id='message' onClick={this.props.gomessage}>message</button>
						<button id='profile' onClick={this.props.goprofile}>profil</button>
						<button id='logout' onClick={this.props.logout}>logout</button>
						{/*<button id ='register'>register</button>*/}
				</header>

				<div id="mere">
					

					<div id ="display">

						<section id="crée_msg">
							
							<h3><strong>Nouveau message ?</strong></h3>
							
							<div class="fils">

								<label for="message">ecrivez ici : </label><input type="text" name="messsge" id="message"  ref={this.ref_msgtxt}/>

								<button  onClick={()=>{this.newmsg()}}>submit</button>

							</div>

						
						</section>


						
						<div id="récuperer_msg">

							
							

							
							{
								
							this.state.message.map((msg,index)=>{

								return(

								<Msgplc  toto={msg}  api_request={this.props.api_request} update={()=>{this.update()}} />

								)									
							})
							
							}








														
						</div>

					</div>
				</div>
				
			</div>
		);
}
}

export default Home;
