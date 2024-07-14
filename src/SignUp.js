import { useRef, useState } from 'react';
import { usersCollection, addDoc,getDocs,where,query } from './database';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const SignUpLogin = () => {
    let nameRef=useRef("");
    let passRef=useRef("");
    let [signUpState,setSignUpState]=useState("signup");
    let [phone,setPhone]=useState("");
    let [code,setCode]=useState("");
    let ref1=useRef("");
    let ref2=useRef("");
    let ref3=useRef("");
    let ref4=useRef("");
    let ref5=useRef("");
    let ref6=useRef("");
    let [name,setName]=useState("");
    let [number,setNumber]=useState("");
    let [pass,setPass]=useState("");
    let[userExist,SetUserExist]=useState(false);
    const addUser = async (user) => {
        try {
            await addDoc(usersCollection, user);
            localStorage.setItem("currUser", JSON.stringify(user));
            window.location.reload();
            console.log('User added to Firestore successfully!');
          } catch (error) {
            console.error('Error adding user to Firestore:', error);
          }
      };

    function submitClick(){
        let stringWithoutFirstTwo = phone.slice(2);
            let newUser={
                name:nameRef.current.value,
                number:stringWithoutFirstTwo,
                password:passRef.current.value,
                notifications:[],
                chats:[]
            }
            console.log(newUser);
            addUser(newUser);
        
    }
    async function sendVerificationCode(){
        console.log(phone);
        SetUserExist(false)
        let rand=Math.floor(100000 + Math.random() * 900000);
        rand=""+rand;
        setCode(rand);
        console.log(code);
        let textms="Welcome To TetraTalks, your Verification code is"+` ${rand}`;
        console.log(textms);
        const url = 'https://donald544-mocean-moceanapi-v1.p.rapidapi.com/rest/1/sms';
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '30bbe95bb8mshd18d66efbdf604ep1ab26ajsndc5b0723adc1',
                'X-RapidAPI-Host': 'donald544-mocean-moceanapi-v1.p.rapidapi.com'
            },
            body: new URLSearchParams({
                'mocean-resp-format': 'json',
                'mocean-to': `${phone}`,
                'mocean-api-key': 'ff5aff05',
                'mocean-api-secret': '3278a23e',
                'mocean-from': 'TetraTalks',
                'mocean-text': textms
            })
        };
        setName(nameRef.current.value);
        let stringWithoutFirstTwo = phone.slice(2);
        setNumber(stringWithoutFirstTwo);
        setPass(passRef.current.value);
        // if(checkIfUserExists(stringWithoutFirstTwo)){
        //     SetUserExist(true);
        //     return;
        // }
        try {
            const response = await fetch(url, options);
            const result = await response.text();
            console.log(result);
            setSignUpState("otp");
        } catch (error) {
            console.error(error);
        }
            }
    const checkIfUserExists = async (phoneNumber) => {
        const userQuery = query(usersCollection, where('number', '==', phoneNumber));
        
        try {
            const querySnapshot = await getDocs(userQuery);
        
            if (querySnapshot.size > 0) {
            return true;
            } else {
            return false;
            }
        } catch (error) {
            console.error('Error checking user existence:', error);
            throw error;
        }
        };
    return ( 
        <div className='signotp'>
            {signUpState==="signup" &&
            <div className="login-box">
                <p>Sign Up</p>
                <form>
                    <div className="user-box">
                        <input required="" name="" type="text" ref={nameRef}/>
                        <label>Name</label>
                    </div>
                    <br />
                    <div className="user-box">
                        <PhoneInput value={phone} onChange={setPhone}/>
                        
                    </div>
                    <br />
                    <div className="user-box">
                        <input required="" name="" type="password" ref={passRef}/>
                        <label>Password</label>
                    </div>
                    <button type="button" onClick={submitClick}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Submit
                    </button>
                </form>
            </div>}      
        </div>
     );
}
 
export default SignUpLogin;