import React,{Component, createContext} from "react";
export const Store=createContext();

class StoreProvider extends Component {
    state = { 
        currUser:JSON.parse(localStorage.getItem('currUser')),
        chatClicked:false,
        currUserid:"",
        clickedChat:""
     } 
     updateChatClicked = (newChatClicked) => {
        this.setState({
          chatClicked: newChatClicked
        });
      };
      updateCurrUser=(user)=>{
        this.setState({
            currUser: user
          });
      }
      updateCurrUserId=(userId)=>{
        //console.log(userId);
        this.setState({
            currUserid: userId
          });
      }
      updateClickedChat=(userNum)=>{
        //console.log(userNum);
        this.setState({
            clickedChat: userNum
          });
      }
    render() { 
        return (
            <Store.Provider value={{...this.state,updateClickedChat:this.updateClickedChat,updateChatClicked:this.updateChatClicked,updateCurrUser :this.updateCurrUser,updateCurrUserId:this.updateCurrUserId}}>
                {this.props.children}
            </Store.Provider>
        );
    }
}
 
export default StoreProvider;