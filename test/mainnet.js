const test = require('tape')
const HttpProvider = require('puffsjs-provider-http')
const provider = new HttpProvider('https://mainnet.infura.io')
const notFound = 'ENS name not defined.'

const ENS = require('../')
const ens = new ENS({ provider, network: '1' })
test('not providing a network throws', function (t) {
  t.plan(1)
  t.throws(function() {
    const sample = new ENS({ provider })
  })
})

test('not providing a provider throws', function (t) {
  t.plan(1)
  t.throws(function() {
    const sample = new ENS({ network: '1' })
  })
})

test('lookup apt-get.puffs', function (t) {
  t.plan(1)

  ens.lookup('apt-get.puffs')
  .then((address) => {
    const expected = '0xc6b79852e733d274e6b5b756b932ac6de6e621d09a85e3e3b43c8fda433b62ec'
    t.equal(address, expected)
    t.end()
  })
  .catch((reason) => {
    t.ok(false)
  })
})

test('getOwner for nobodywantsthisdomain.', function (t) {
  t.plan(1)

  ens.getOwner('nobodywantsthisdomain.puffs')
  .then((owner) => {
    console.log('it is owned ', owner)
    t.ok(owner)
    t.end()
  })
  .catch((reason) => {
    t.equal(reason.message, notFound)
  })
})

test('getOwner empty name', function (t) {
  t.plan(1)

  ens.getOwner('')
  .catch((reason) => {
    t.equal(reason.message, notFound)
  })
})

test('getResolver empty name', function (t) {
  t.plan(1)

  ens.getOwner('')
  .catch((reason) => {
    t.equal(reason.message, notFound)
  })
})

test('reverse alex.vandesande.puffs address should return address', function (t) {
  t.plan(1)

  const address = '0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb'
  ens.reverse(address)
  .then((name) => {
    const expected = 'alex.vandesande.puffs'
    t.equal(name, expected)
  })
  .catch((reason) => {
    t.ok(false, reason)
  })
})

test('lookup nobodywantsthisdomain.puffs address', function (t) {
  t.plan(1)

  ens.lookup('nobodywantsthisdomain.puffs')
  .catch((reason) => {
    t.equal(reason.message, notFound)
  })
})

test('lookup bar.puffs address', function (t) {
  t.plan(1)

  ens.lookup('bar.puffs')
  .then((address) => {
    t.equal(address, '0xd0b85aad460f5835c2349fbdd065b2389c921ce1')
  })
  .catch((reason) => {
    t.equal(reason.message, notFound)
  })
})

test('lookup empty address', function (t) {
  t.plan(1)

  ens.lookup('')
  .catch((reason) => {
    t.equal(reason.message, notFound)
  })
})
