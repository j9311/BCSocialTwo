const { assert } = require('chai')

const SocialNetwork = artifacts.require('./SocialNetwork.sol')

require ('chai')
    .use(require('chai-as-promised'))
    .should()

    contract('SocialNetwork', ([deployer, author, tipper]) => {
        let socialNetwork 

        before(async () => {
            socialNetwork = await SocialNetwork.deployed()
        })

        describe('deployment', async () => {
            it('deploys successfully', async () => {
                const address = await socialNetwork.address
                assert.notEqual(address, 0x0)
                assert.notEqual(address, '')
                assert.notEqual(address, null)
                assert.notEqual(address, undefined)
            })

            it('has a name', async () => {
                const name = await socialNetwork.name()
                assert.equal(name, 'My Social Network')
            })
        })

        describe('posts', async () => {
            let result, postCount
            before(async () => {
                result = await socialNetwork.createPost('This is my first post', { from: author })
                postCount = await socialNetwork.postCount()
            })
            it('creates posts' , async () => {
//success
                assert.equal(postCount, 1)
                const event = result.logs[0].args
                assert.equal(event.id.toNumber(), postCount.toNumber(), 'CORRECT ID')
                assert.equal(event.content, 'This is my first post', 'VALID CONTENT')
                assert.equal(event.tipAmount, '0', 'VALID TIP')
                assert.equal(event.author, author, 'VALID AUTHOR')
//failure
                await socialNetwork.createPost('', {from: author}).should.be.rejected;
            })
            it('lists posts' , async () => {
                const post = await socialNetwork.posts(postCount)
                assert.equal(post.id.toNumber(), postCount.toNumber(), 'CORRECT ID')
                assert.equal(post.content, 'This is my first post', 'VALID CONTENT')
                assert.equal(post.tipAmount, '0', 'VALID TIP')
                assert.equal(post.author, author, 'VALID AUTHOR')
            })
            
            //test for confirm receipt prompt on send and receive. 
            
            
            it('allows users to tip posts' , async () => {
//author balance before purchase
                let lastAuthBal
                lastAuthBal = await web3.eth.getBalance(author)
                lastAuthBal = new web3.utils.BN(lastAuthBal)

                result = await socialNetwork.tipPost(postCount, {from: tipper, value: web3.utils.toWei('1', 'Ether')}) 
//success
                const event = result.logs[0].args
                assert.equal(event.id.toNumber(), postCount.toNumber(), 'CORRECT ID')
                assert.equal(event.content, 'This is my first post', 'VALID CONTENT')
                assert.equal(event.tipAmount, '1000000000000000000', 'VALID TIP')
                assert.equal(event.author, author, 'VALID AUTHOR')
//author balance after purchase
                let newAuthBal
                newAuthBal = await web3.eth.getBalance(author)
                newAuthBal = new web3.utils.BN(newAuthBal)

                let tipAmount
                tipAmount = web3.utils.toWei('1', 'Ether')
                tipAmount = new web3.utils.BN(tipAmount)

                const expectedBalance = lastAuthBal.add(tipAmount)

                assert.equal(newAuthBal.toString(), expectedBalance.toString())

//failure
                await socialNetwork.tipPost(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
            })
        })
    })
