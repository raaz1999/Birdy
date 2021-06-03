import React from 'react';
/*import ReactDOM from 'react-dom';*/
import './register_style.css';




class Register extends React.Component{
    constructor(props){
        super(props);


        this.ref_name=React.createRef();
        this.ref_prenom=React.createRef();
        this.ref_email=React.createRef();
        this.ref_password=React.createRef();
        this.ref_pname=React.createRef();



    }



    addUser(){

        const data={
            "pseudo_name":this.ref_pname.current.value,
            "password":this.ref_password.current.value,
            "last_name":this.ref_prenom.current.value,
            "first_name":this.ref_name.current.value,
            "email":this.ref_email.current.value
        }

        this.props.api_request.post('/authentification/register',data) 
                .then(response => {
                    console.log(response); // à tester la première fois pour voir ce que retourne le serveur
                    this.props.reg()
                }).catch(e=>{
                  console.log()
                })
    }
    

    render() {
        return (
           

            <div className="register">
                



            <div id="logo">
                    <h1>Birdy</h1>
            </div>

            <div className='main'>
                <h1>register</h1>

                <div class="information">

                    <label for="nom">Nom: </label><input type="text" name="nom" id="nom"  ref={this.ref_name} required/>

                    <label for="prenom">Prenom: </label><input type="prenom" name="prenom" id="prenom"  ref={this.ref_prenom} required/>

                    <label for="pnom">Pseudo nom : </label><input type="pname" name="pname" id="pname" ref={this.ref_pname}required/>

                    <label for="email">Email: </label><input type="email" name="email" id="email" ref={this.ref_email} required/>

                    <label for="motdepasse">Password: </label><input type="password" name="password" id="motdepasse" ref={this.ref_password} required/>


                </div>

                <div class="b&l">

                    <button onClick={()=>{this.addUser()}}>register</button>

                        <div id="links">


                        <p><a onClick={this.props.reg}>vous avez deja un comptes ?</a></p>

                        </div>

                </div>
            </div>
    </div>
        
        )
    }
}

export default Register;