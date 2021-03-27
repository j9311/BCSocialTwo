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
  const networkData = SocialNetwork.networks[networkId]
  if(networkData) {
    const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
    // console.log(socialNetwork)
    this.setState({socialNetwork}) //key value pair socialNetwork
    const postCount = await socialNetwork.methods.postCount().call()
    this.setState({postCount})
    // console.log(postCount)
    for (var i = 1; i <= postCount; i++) {
      const post = await socialNetwork.methods.posts(i).call()
      this.setState({
        posts: [...this.state.posts, post]
      })
    }
    // console.log({posts: this.state.posts})
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
    account: '',
    socialNetwork: null
  ,
  postcount: 0, 
  posts:[]
  }
}



  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '500px'}}>
              <div className="content mr-auto ml-auto">
              {this.state.posts.map((post, key) => {
                return(
                  <div className=" card mb-4" key={key}>
                    <div className="card-header">
                    <small classname="text-muted">{post.author}</small>
                    </div>
                    <ul id="postlist" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p> {post.content}</p>
                      </li>
                      <li className="list-group-item py-2" key={key}>
                        <small> Tips: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')}</small>
                        <button className="btn btn-link btn-sm float-right pt-0"><span>TIP 0.1 ETH</span></button>
                      </li>
                    </ul>
                  </div>
                )
              })}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
