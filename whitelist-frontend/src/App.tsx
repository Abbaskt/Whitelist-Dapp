import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import cryptoDev from './crypto-devs.svg';
import Web3Modal from 'web3modal';
import { Contract, providers } from 'ethers';
import { WHITELIST_CONTRACT_ADDRESS, ABI } from "./constants";

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numOfWhiteListed, setNumOfWhiteListed] = useState(0);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async(needSigner = false) => {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const {chainId} = await web3Provider.getNetwork();

      if(chainId !== 4) {
        window.alert("Change the network to rinkeby");
        throw new Error("Change network to rinkeby");
      }
      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
  }

  const addAddressToWhitelist = async() => {
    try{
      const signer = await getProviderOrSigner(true);
      const whitelistedContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        ABI,
        signer
      );
      const tx = await whitelistedContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumOfWhitelisted();
    }catch(err) {
      console.error(err)
    }
  }

  const checkIfAddressIsWhitelisted = async() => {
    try{
      const signer = await getProviderOrSigner(true)
      const whitelistedContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        ABI,
        signer
      );

      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistedContract.whitelistedAddress(address);
      setJoinedWhitelist(_joinedWhitelist);
    }catch(err){
      console.error(err);
    }
  }

  const getNumOfWhitelisted = async() => {
    try{
      const provider = await getProviderOrSigner();
      const whitelistedContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        ABI,
        provider
      );
      const _numOfWhitelisted = await whitelistedContract.numAddressesWhitelisted();
      setNumOfWhiteListed(_numOfWhitelisted);
    }catch(err){
      console.error(err);
    }
  }

  const renderButton = () => {
    if(walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className='description'>
            Thanks for joining the whitelist!
          </div>
        )
      }else if (loading) {
        return(
          <button className='button'>Loading...</button>
        )
      } else {
        return (
            <button onClick={addAddressToWhitelist} className="button">Join the whitelist</button>
        )
      }
    } else {
      <button onClick={connectWallet} className='button'>
        Connect your wallet
      </button>
    }
  }

  const connectWallet= async() => {
    try{
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelisted();
      getNumOfWhitelisted();
    }catch(err){
      console.error(err)
    }
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network:"rinkeby",
        providerOptions:{},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected])

  return (
    <div className="App">
      <header className="App-header">
        <title>Whitelist dApp</title>
        <meta name="description" content="Whitelist-dApp" />
      </header>
      <div className='main'>
        <h1 className='title'>
          Welcome to crypto devs!
        </h1>
        <div className='description'>
          {numOfWhiteListed} have joined the Whitelist
        </div>
        {renderButton()}
        <div>
          <img className='image' src={cryptoDev}/>
        </div>
      </div>
      <footer className='footer'>
        Made with &#10084; Crypto Devs
      </footer>
    </div>
  );
}

export default App;
