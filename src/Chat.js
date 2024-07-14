import { useContext, useEffect, useRef, useState } from "react";
import { Store } from "./Store";
import bck from './NoChat.png'
 import { usersCollection, query, where, getDocs } from './database';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from './database';
import { ReactMic } from 'react-mic';
import AudioRecord from "./AudioRecord";
import pic from './userPic.jpg'
const Chat = () => {
    let store=useContext(Store);
    let [chatMs,setChatMs]=useState([]);
    let [name,setname]=useState("");
    let [number,setnumber]=useState("");
    let textRef=useRef("");
    let message=useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const audioRef = useRef(null);
    let [send,setSend]=useState(false);
    const onStart = () => {
        console.log('Recording started');
        setIsRecording(true);
        setAudioChunks([]);
      };
      
      async function onStop(recordedBlob) {
        console.log('Recording stopped');
        setIsRecording(false);
        const audioChunks = recordedBlob.blob;
      
        let receiver= await getUserByPhoneNumber();
        let sender=await getCurrUser();
  
        const audioBuffer = await audioChunks.arrayBuffer();
        const base64String = btoa(new Uint8Array(audioBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

        let senderObj = {
          content: base64String,
          time: getTime(),
          type: "out",
          seen: false,
        };
      
        let recieverObj = {
          content: base64String,
          time: getTime(),
          type: "in",
          seen: false,
        };
      
        addMsg(receiver.id, receiver, recieverObj, sender.number);
        addMsg(sender.id, sender, senderObj, receiver.number);
      
        setTimeout(() => {
          scrollToBottom();
        }, 200);
      }
      function isBase64(str) {
        if (/^([A-Za-z0-9+/=])\1+$/.test(str)) {
            return false;
        }

        try {
            let decoded = atob(str);
            return  str.length>50&&btoa(decoded) === str;
        } catch (err) {
            return false;
        }
    }

      useEffect(() => {
        let temp = [];
        if (getChat() && store.chatClicked) {
          let chat = getChat();
          let ms = chat.messages;
      
          if (Array.isArray(ms)) {
            temp = ms.map((message, index) => {
              if (isBase64(message.content)) {
                return (
                  <div key={index} className={message.type === "in" ? 'messageleft' : 'messageright'}>
                    <AudioRecord key={index} base64String={message.content} />
                    <p className={message.type === "in" ? 'timeleft' : 'timeright'}>{message.time}</p>
                  </div>
                );
              } else {
                return (
                  <div key={index} className={message.type === "in" ? 'messageleft' : 'messageright'}>
                    {message.content}
                    <p className={message.type === "in" ? 'timeleft' : 'timeright'}>{message.time}</p>
                  </div>
                );
              }
            });
          } else {
            console.error("invalid messages format:", ms);
          }
      
          setname(chat.name);
          setnumber(chat.number);
          setChatMs(temp);
          setTimeout(() => {
            scrollToBottom();
          }, 200);
        }
      },[store.clickedChat, store.currUser]);
      
    function getTime(){
        const currentDate = new Date();
        let hours = currentDate.getHours();
        let minutes = currentDate.getMinutes();
        let seconds = currentDate.getSeconds();
        const amOrPm = hours >= 12 ? 'PM' : 'AM';
        if(hours>=12){
            hours-=12;
        }
        if(minutes<10){
          minutes='0'+minutes;
        }
        let time=hours+":"+minutes+" "+amOrPm;
        return time;
    }
    function getChat(){
        if(store.currUser.chats){
        for(let i=0;i<store.currUser.chats.length;i++){
            if(store.currUser.chats[i].number===store.clickedChat){
                let x={
                    messages:store.currUser.chats[i].messages,
                    name:store.currUser.chats[i].name,
                    number:store.currUser.chats[i].number
                }
                //console.log(x);
                return x;
            }
        }
    }
    }
    async function sendMs(event,x){

        if(event.key==='Enter' && textRef.current.value!==""){
        let receiver= await getUserByPhoneNumber();

        let sender=await getCurrUser();
        let senderObj={
            content:textRef.current.value,
            time:getTime(),
            type:"out",
            seen:false
      }
      let recieverObj={
        content:textRef.current.value,
        time:getTime(),
        type:"in",
        seen:false
    }
        addMsg(receiver.id,receiver,recieverObj,sender.number);
        addMsg(sender.id,sender,senderObj,receiver.number);
        textRef.current.value="";
        setTimeout(()=>{
            scrollToBottom();
        },200);
    }
    }
    async function sendClicked(){
        if(textRef.current.value===""){
            return
        }
        let receiver= await getUserByPhoneNumber();

        let sender=await getCurrUser();
        let senderObj={
            content:textRef.current.value,
            time:getTime(),
            type:"out",
            seen:false
      }
      let recieverObj={
        content:textRef.current.value,
        time:getTime(),
        type:"in",
        seen:false
    }
        addMsg(receiver.id,receiver,recieverObj,sender.number);
        addMsg(sender.id,sender,senderObj,receiver.number);
        textRef.current.value="";
        setTimeout(()=>{
            scrollToBottom();
        },200);

        
        
    }
    const getUserByPhoneNumber = async () => {
        try {
            let currUser=store.currUser;
            let num=localStorage.getItem('clickedNum');
            const phoneNumber = num;
            console.log(phoneNumber);
            const q = query(usersCollection, where('number', '==', phoneNumber));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.size > 0) {
                const userDoc = querySnapshot.docs[0];
                const userData = {
                    id: userDoc.id,
                    ...userDoc.data(),
                };
                
                return userData;
            } else {
                console.log('User not found');
                
            }
        } catch (error) {
            console.error('Error getting user by phone number:', error);
            
        }
    };
    async function addMsg(id,user,msObj,num){
            try {
                const userRef = doc(firestore, 'users', id);
                    let temp = [...user.chats];
                    for(let i=0;i<temp.length;i++){
                        if(temp[i].number===num){
                            temp[i].messages.push(msObj);
                            break;
                        }
                    }
                    updateDoc(userRef, {
                        chats: temp,
                    });
                    await getCurrUser();
            } catch (error) {
                console.error('Error updating user:', error);
            }
    }
    const getCurrUser = async () => {
        try {
            let currUser=JSON.parse(localStorage.getItem('currUser'));
            const phoneNumber = currUser.number;
            const q = query(usersCollection, where('number', '==', phoneNumber));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.size > 0) {
                const userDoc = querySnapshot.docs[0];
                const userData = {
                    id: userDoc.id,
                    ...userDoc.data(),
                };
                //console.log(userData,"ahoh");
                localStorage.removeItem('currUser');
                localStorage.setItem('currUser', JSON.stringify(userData));
                store.updateCurrUser(userData);
                return userData;
                //console.log('User Data:', store.currUser);
            } else {
                console.log('User not found');
                
            }
        } catch (error) {
            console.error('Error getting user by phone number:', error);
            
        }
    };
    const scrollToBottom = () => {
        if (message.current) {
          message.current.scrollTop = message.current.scrollHeight;
          
        }
      };
    return ( 
        <div style={{backgroundImage: name == "" ? `url(${bck})` : "none"}} className="chat">


            <div style={{textAlign:"left"}} className="chathead">
                
                <h1 style={{margin:0,textAlign:"left",display:'inline'}}>{name}</h1>
                {name!==""&&<img style={{
                  display:'inline',
                  position: 'absolute',
                  top: 0,
                  right: 20,
                }}  className='userpic' src={pic} alt="" />}
                <p style={{margin:0,textAlign:"left"}}>{number}</p>
            <div className="messages" ref={message}>
                {chatMs}
                
            </div>    
            
            </div>


            {store.clickedChat!=="" &&
            <div className="send">
                <input onKeyDown={sendMs} type="text" ref={textRef}/>
                <button  onClick={sendClicked}><i className="fa-solid fa-paper-plane fa-lg"></i></button>
                <ReactMic
                    record={isRecording}
                    className="sound-wave"
                    onStop={onStop}
                    strokeColor="#000000"
                    backgroundColor="#FF4081"
                />
                <button onClick={onStart} disabled={isRecording}>
                    <i className="fa-solid fa-microphone fa-lg"></i>
                </button>
                <button onClick={() => setIsRecording(false)} disabled={!isRecording}>
                    
                    <i className="fa-solid fa-share fa-lg"></i>
                </button>
            </div>}
            
        </div>
     );
}
 
export default Chat;