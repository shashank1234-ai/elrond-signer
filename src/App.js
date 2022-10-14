import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import { WalletProvider, WALLET_PROVIDER_DEVNET } from "@elrondnetwork/erdjs-web-wallet-provider";
import * as Crypto from 'crypto-js';
import Accordion from './Accoridian';
//aes secret key:2yw6OLwKiooMNw1h04HNba7dzrkxHBxE
function App() {
  const provider = new WalletProvider(WALLET_PROVIDER_DEVNET);
  const [signedData, setSignedData] = useState('');
  const [verifyData, setVerifyData] = useState('');
  const stringToHex = (str) => {
    console.log(str);
    if (str) {
      const arr1 = [];
      for (let n = 0, l = str.length; n < l; n++) {
        const hex = Number(str.charCodeAt(n)).toString(16);
        arr1.push(hex);
      }
      return arr1.join('');
    }
    return '';
  };
  console.log(signedData)
  function handleSign() {
    console.log("sign");
    console.log(message);
    const address = window.location.href.split("=")
    if(address.length==1){
      login();
    }else{
    console.log(address);
    var signature = Crypto.AES.encrypt(message, '2yw6OLwKiooMNw1h04HNba7dzrkxHBxE').toString();
    console.log(signature);
    const SignedData = {
      address:address[1],
      message:stringToHex(message),
      signature:signature,
    }
    setSignedData(JSON.stringify(SignedData));
    // var bytes = Crypto.AES.decrypt(SignedData.signature, '2yw6OLwKiooMNw1h04HNba7dzrkxHBxE');
    // var decryptedData = bytes.toString(Crypto.enc.Utf8)
    console.log(signedData)
  }
  }

const [decryptedMessage, setDecryptedMessage] = useState('');
const [address, setAddress] = useState('');
  function verify(){
    const verificationData=JSON.parse(verifyData);
    var bytes = Crypto.AES.decrypt(verificationData.signature, '2yw6OLwKiooMNw1h04HNba7dzrkxHBxE');
    var decryptedsignature = bytes.toString(Crypto.enc.Utf8)
    verificationData.signature = decryptedsignature
    setDecryptedMessage(decryptedsignature);
    setAddress(verificationData.address);
    setVerifyData(JSON.stringify(verificationData));
  }
  function onChangeVerify(e) {
    setVerifyData(JSON.stringify(e.target.value));
  }
  async function login(){
    const callbackUrl = encodeURIComponent("http://localhost:3000/");
    await provider.login({ callbackUrl });
  }
  async function logout(){
    const callbackUrl = window.location.href.split("?")[0];
    await provider.logout({ callbackUrl: callbackUrl });
  }
  const [message, setMessage] = useState('');
  const accordionData = [
    {
      title: 'Sign',
      content: 
      <>
      <div className="name">Simple Elrond Signer</div>
      <br />
      <textarea type={'text'} cols={50} rows={5} className='form-control col-lg-12' value={message} onChange={(e)=>{setMessage(e.target.value)}}></textarea>
      <br/>
      {signedData.length>0 && 
        <textarea cols={50} rows={5} disabled value={signedData}>{signedData}</textarea>
      }
      <button className='button btn-primary' style={{position:'relative', 'top':'10px'}} onClick={handleSign}>Sign</button>
      
      </>
    },
    {
      title: 'Verify',
      content:
             <>
             <textarea type={'text'} cols={50} rows={5} className='form-control col-lg-12' value={verifyData} onChange={(e)=>{setVerifyData(e.target.value)}} ></textarea>
             {decryptedMessage.length>0 && 
             <>
             <br />
             <span>Message:{decryptedMessage}</span>
             <br />
             <span>Address:{address}</span>
             </>
             }
            <button className='button btn-primary' style={{position:'relative', 'top':'10px'}} onClick={verify}>Verify</button>
             </>
    },
  ];
  return (
    <div className="App">
      <header className="App-header">    
     <div id="container">
<div className='row'>
<button className='button' onClick={logout}>Logout</button>
<br/>
<button className='button' onClick={login}>Login</button>
</div>
<div className="accordion">
        {accordionData.map(({ title, content }) => (
          <Accordion key={title} title={title} content={content} />
        ))}
      </div>

</div>

        

      </header>
    </div>
  );
}

export default App;
