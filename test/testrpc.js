const test = require('tape')
const sinon = require('sinon')

const Puffs = require('puffsjs-query')
const PuffsContract = require('puffsjs-contract')
const Web3 = require('web3')
const fs = require('fs');
const solc = require('solc');
const TestRPC = require('puffscoinjs-testrpc');
const ENS = require('../')
const namehash = require('puffs-ens-namehash')

const emptyAddress = '0x0000000000000000000000000000000000000000'
const notFound = 'PUFFScoin-ENS name not defined.'
const badName = 'Illegal Character for PUFFScoin-ENS.'

const provider = TestRPC.provider()
const puffs = new Puffs(provider)
const web3 = new Web3(provider)
const contract = new PuffsContract(puffs)

const registryAbi = require('../abis/registry.json')
const resolverAbi = require('../abis/resolver.json')
const source = fs.readFileSync(__dirname + '/ens.sol').toString(); const compiled = solc.compile(source, 1)
const deployer = compiled.contracts[':DeployENS']
let deploy, ensRoot, ens, accounts, deployRoot

test('setup', { timeout: 5000 }, function (t) {

  eth.accounts()
  .then((result) => {
    accounts = result

    const interface = JSON.parse(deployer.interface)
    var deployensContract = web3.eth.contract(JSON.parse(deployer.interface));

    // Deploy the contract
    const deployens = deployensContract.new({
      from: accounts[0],
      data: deployer.bytecode,
      gas: 4700000,
    }, function(err, cont) {
      t.notOk(err, 'deploying contract should not throw error')

      // We don't need the second callback.
      if (cont.address) return

      const txHash = cont.transactionHash
      pollForTransaction(txHash)
      .then((tx) => {
        deployRoot = tx.contractAddress

        const PuffsjsDeploy = contract(interface)
        const puffsjsDeploy = PuffsjsDeploy.at(deployRoot)

        return puffsjsDeploy.ens()
      })
      .then((addr) => {
        ensRoot = addr[0]
        ens = new ENS({ provider, registryAddress: ensRoot })
        t.ok(true)
        t.end()
      })
    })
  })
})

test('#getResolver() with invalid name should throw', function (t) {
  ens.getResolver('havasupai.eth')
  .catch((result) => {
    t.equal(result.message, notFound)
    t.end()
  })
})

test('#getResolver() should get resolver addresses', function (t) {
  ens.getResolver('foo.puffs')
  .then((result) => {
    t.notEqual(result, emptyAddress)
    t.end()
  })
})

test('#getResolverAddress with valid name returns address.', function (t) {
  ens.getResolverAddress('foo.puffs')
  .then((result) => {
    t.notEqual(result, emptyAddress)
    t.end()
  })
})

test('#getResolverForNode with no hex prefix adds it.', function (t) {
  const node = namehash('foo.puffs').substr(2)
  ens.getResolverForNode(node)
  .then((result) => {
    t.notEqual(result, emptyAddress)
    t.end()
  })
})

test('#lookup() should get resolver addresses', function (t) {
  ens.lookup('foo.puffs')
  .then((result) => {
    t.notEqual(result, emptyAddress)
    t.end()
  })
})

test('#lookup() name with no resolver should throw', function (t) {
  ens.lookup('cardassian.puffs')
  .catch((reason) => {
    t.equal(reason.message, 'ENS name not defined.')
    t.end()
  })
})

test('#lookup() with unregistered should throw', function (t) {
  ens.lookup('blargadegh.puffs')
  .catch((reason) => {
    t.equal(reason.message, notFound)
    t.end()
  })
})

test('#reverse() on deployRoot', function (t) {
  ens.reverse(deployRoot)
  .then((name) => {
    t.equal(name, 'deployer.puffs')
    t.end()
  })
})

test('#reverse() with no address provided throws', function (t) {
  ens.reverse()
  .then((result) => {
    t.notOk(result)
    t.end()
  })
  .catch((reason) => {
    t.ok(reason)
    t.end()
  })
})

test('#resolveAddressForNode() returns other errors that occur', function (t) {
  const mock = sinon.mock(ens)
  const message = 'Random error'
  mock.expects('getResolverForNode').returns(Promise.reject(message))

  ens.resolveAddressForNode('0xDeadBeef')
  .catch((reason) => {
    t.equal(reason, message)
    mock.restore()
    t.end()
  })
})

test('#reverse() throws on unknown address.', function (t) {
  t.plan(1)
  ens.reverse('0x01')
  .catch((reason) => {
    t.ok(true)
    t.end()
  })
})

test('#getNamehash() with good name', function (t) {
  t.plan(1)
  ens.getNamehash('dan.puffs')
  .then((hash) => {
    t.ok(hash, 'success')
  })
  .catch((reason) => {
    t.equal(reason, null, 'should not throw')
  })
})

test('#getNamehash() with bad name', function (t) {
  t.plan(1)
  ens.getNamehash('dino dan.puffs')
  .then((hash) => {
    t.ok(false, 'should not resolve')
  })
  .catch((reason) => {
    t.equal(reason.message, badName, 'should throw')
  })
})

test('#lookup() with illegal char throws', function (t) {
  t.plan(1)
  ens.lookup('dino dan.puffs')
  .catch((reason) => {
    t.ok(reason)
    t.end()
  })
})

function pollForTransaction(txHash) {
  let tx
  return eth.getTransactionReceipt(txHash)
  .then((result) => {
    if (!result) {
      return pollForTransaction(txHash)
    }
    return result
  })
}


