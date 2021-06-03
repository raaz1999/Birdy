import React from 'react';
import ReactDOM from 'react-dom';
import './login_style.css';




class Login extends React.Component{
    constructor(props){
        super(props);


        this.ref_email=React.createRef();
        this.ref_password=React.createRef();


        this.state={
            message : ""
        }
    }



    checkLogin(){
        
        const data={
            'email':this.ref_email.current.value,
            'password':this.ref_password.current.value,
        }

        this.props.api_request.post('/authentification/login',data) 
                .then(response => {
                   
                    console.log(response.data.status)
                    if(response.data.status === 201){

                        this.setState({
                            message : ""
                        })
                        this.props.log()
                        
                    }else{
                        this.setState({
                            message : "mauvais mot de passe ou email"
                        })
                    }
                }).catch(error=>{
                    console.log(error)
                })


        
    }


    render(){
        return(
            

            <div className="Login">

                <div id="logo">
                        <h1>Birdy</h1>
                </div>

            
                <div className='main2'>
                    <h1>Login    <small style={{color:"red",fontSize: 10  }}>{this.state.message}</small></h1>
            
                    <div className="information">
                    
                        <label for="email">Email: </label><input type="email" name="email" id="email" ref={this.ref_email} required/>
            
                        <label for="motdepasse">Password: </label><input type="password" name="password" id="motdepasse" ref={this.ref_password} required/>
            
            
                    
                    </div>
                    
                    <div className="b&l">
                    
                    <button onClick={()=>{this.checkLogin()}}>login</button>
                    
                        <div id="links">
            
                            <p><a onClick={this.props.reg}>inscriver vous !</a></p>
            
                        </div>
                    
                    </div>
                </div>


            </div>
         )
    }
}



export default Login;