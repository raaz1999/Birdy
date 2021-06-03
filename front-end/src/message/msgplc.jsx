import React from 'react';



class Msgplc extends React.Component {
  constructor(props) {

    super(props)

    this.ref_comment=React.createRef();

  }



  addcomment(){

      const data={
        'comment':this.ref_comment.current.value,
        'message_id':this.props.toto.message_id
      }

      this.props.api_request.post('/message/add_comment',data).then(response=>{

			this.props.update()

      }).catch(e=>{
        
        console.log("Error")
      })

  }



  render(){
      return(      
                  <div className="msg">
                          
                        <h3><strong>{this.props.toto.pseudo_name}</strong>  <small style={{color:'silver',fontSize:10}}>{this.props.toto.date}</small></h3>
                                                        
                        <div id="fils">
                            {console.log(this.props.toto.comment)}
                            <p>{this.props.toto.message}</p>
                    
                            <div id="comment">
                                                                
                                <a href="#">comment</a>
                                <ul>
				
				
			
                                {this.props.toto.comment.map(cmt=>{
                                  console.log(cmt)
                                  return(
                                    <li><strong>{cmt.user_pseudo} </strong>{cmt.comment}</li>
                                  )
                                })}

                                </ul>

                                <div id="addcomment">
                                    <input type="text" name="newcomment"  placeholder="type......"  ref={this.ref_comment}/><button  on onClick={()=>{this.addcomment()}}>add</button>
                                </div>
                    
                            </div>

                        </div>
                    
              
              
                  </div>
      )
  }

}



export default Msgplc;