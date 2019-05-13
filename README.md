# PuffsJS ENS

A convenience interface for using the PUFFScoin Decentralized Name Service, based on the [PuffsJS contract abstraction](https://github.com/puffscoin/puffsjs-contract).

## Installation

Install from npm:

`npm install puffsjs-ens --save`

## Usage

```javascript
const ENS = require('puffsjs-ens')
const HttpProvider = require('puffsjs-provider-http')

// For MetaMask or Mist compatibility:
if (typeof window === 'object' && typeof window.web3 !== 'undefined') {
  setupEns(web3.currentProvider)
} else {
  const provider = new HttpProvider('https://ropsten.infura.io')
  setupEns(provider)
}

function setupEns (provider) {

  // Currently requires both provider and
  // either a network or registryAddress param
  const ens = new ENS({ provider, network: '3' })

  puffs.lookup('legalize.puffs')
  .then((address) => {
    const expected = '0xb8a6cc26aa01304ecb5b05d0b7591b4ff9e40135405688139979efa10d168751'

    if (address === expected) {
      alert("That's how you do it!")
    }
  })
  .catch((reason) => {
    // There was an issue!
    // Maybe the name wasn't registered!
    console.error(reason)
  })
}
```

## Available APIs

### puffs.lookup( name )

Takes a valid [ENS](http://puffscoin.leafycauldronapothecary.com/services/puffsdns/) name, like `legalize.puffs`, or `some.specialname.puffs`.

Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to a hex-prefixed hexadecimal string for the resolved address.

If a matching name can not be found, will throw:

```javascript
new Error('PUFFScoin-ENS name not found.')
```

### puffs.reverse( address )

Takes a PUFFScoin address (hex-encoded), and attempts to look up a corresponding name on the registry's reverse-registrar.

Returns a promise that resolves a string if a name exists, or throws if it does not.

### puffs.registry

A [puffsjs contract](https://github.com/puffscoin/puffsjs-ens) instance initialized for the specified network's address.

Implements the registry interface specified in [EIP 137](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-137.md):

```
function owner(bytes32 node) constant returns (address);
Returns the owner (registrar) of the specified node.

function resolver(bytes32 node) constant returns (address);
Returns the resolver for the specified node.

function ttl(bytes32 node) constant returns (uint64);
```

## Current Supported Networks

Network support is added by adding a registry for that network to the [network map](./lib/network-map.json).

- Main net (id 420)

## Licence

This project is licensed under the MIT license, Copyright (c) 2016 Dan Finlay. For more information see LICENSE.md.

```
The MIT License

Copyright (c) 2017 Dan Finlay. danfinlay.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
