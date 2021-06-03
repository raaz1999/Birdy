import React from 'react';
import Home from './homepage/home';
import Login from './login/login'
import Register from './registre/register'
import Profil from './profil/profil.jsx'
import axios from 'axios'
import Messageprv from './message/msgprv.jsx'
import Profilamis from './profil/profilamis.jsx'
import Recherche from './recherche/recherche.jsx'





class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'register', // valeurs possibles: 'login', 'messages', 'signin',
      isConnected: false,
    }
    this.api_request = axios.create({ // création de l'api axios
      baseURL : '',
      timeout : 10000,
      headers : {'X-Custom-Header':'foobar'}
    });
  }

  setConnected = () => {
    this.setState({
      isConnected: true,
      currentPage: 'home', // I.T
    });
  }

  setLogout = () => {
    this.setState({
      isConnected: false,
      currentPage: 'login'
    });


    this.api_request.get("/authentification/logout").then((response)=>{

			alert("session fermer !")
						
		}).catch((e)=>{
			    console.log(e)
		})

  }


  setLogout_reg = () => {
    this.setState({
      isConnected: false,
      currentPage: 'login'
    });
  }





  setSignIn=()=>{
    this.setState({
      isConnected: false,
      currentPage: 'register'
    });

  }


  goprofile=()=>{
    this.setState({
      currentPage: 'profile'
    });
  }



  gomessage=()=>{
    this.setState({
      currentPage: 'message'
    });
  }

  gohome=() => {
    this.setState({ currentPage: 'home' });
  }
  

  goami=(elem)=>{
    this.setState({ currentPage: 'ami' });
    this.setState({ ami:elem})
  }


  gosearch=()=>{
    this.setState({ isConnected: true,currentPage: 'recherche' });
  }
  
  render() {
    const { isConnected, currentPage } = this.state;

    return <div>
      
      <div className='main'>

        {( isConnected === false && currentPage==='login')
          && <Login log={()=>{this.setConnected()}}   reg={()=>{this.setSignIn()}} api_request={this.api_request}  />}

        {( isConnected === false && currentPage==='register')
          && <Register reg={()=>{this.setLogout_reg()}} api_request={this.api_request}  />}

        { (isConnected === true && currentPage==='home')
          && <Home   gohome={()=>{this.gohome()}} gosearch={()=>{this.gosearch()}}   goami={(elem)=>{this.goami(elem)}}  logout={()=>{this.setLogout() }} api_request={this.api_request} goprofile={()=>{this.goprofile()}}   gomessage={()=>{this.gomessage()}}/>}

        { (isConnected === true && currentPage==='profile')
          && <Profil logout={()=>{this.setLogout() }} api_request={this.api_request} gohome={()=>{this.gohome()}}/>}

        { (isConnected === true && currentPage==='message')
          && <Messageprv logout={()=>{this.setLogout() }} api_request={this.api_request} gohome={()=>{this.gohome()}} />}

        { (isConnected === true && currentPage==='ami')
          && <Profilamis   ami={this.state.ami} logout={()=>{this.setLogout() }} api_request={this.api_request} gohome={()=>{this.gohome()}}/>}

        { (isConnected === true && currentPage==='recherche')
          && <Recherche  api_request={this.api_request} gohome={()=>{this.gohome()}}/>}


      </div>
    </div>;
  }
}

export default MainPage;
