import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json';
import Navbar from './Navbar';







class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockChainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('non-etherum browser detected, try downloading MetaMask')
  }
}

async loadBlockChainData() {
  const web3 = window.web3
  //load account
  const accounts = await web3.eth.getAccounts()
  console.log(accounts)
  this.setState({account: accounts[0]})
  //network id 5777 for ganache testing
  const networkId = await web3.eth.net.getId()
  console.log(networkId)
  if(SocialNetwork.networks[networkId]) {
    
  } else {
    window.alert('SocialNetwork contract not deployed to detected network.')
  }
  //address "0xE5b033dFd9cC755D21B22743BF196eBaC4Cb922f"

  //abi SocialNetwork.json
  //
}

constructor(props) {
  super(props)
  this.state = {
    account: ''
  }
}



  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
