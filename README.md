# Swoop deployment

This repository & tooling deploys Swoop (a Uniswap V2 fork) on Harmony.

The deployment consists of two separate sections - one for smart contracts and one for client-side libraries and code.

## Requirements

- NodeJS version 10+
- Yarn

## Installation

```
git clone https://github.com/harmony-one/swoop-deployment.git && cd swoop-deployment
yarn install
```

## Smart Contracts

The smart contract deployment of Swoop contains of two mandatory steps (core and periphery) and an optional step (external) depending on if you've already deployed required/supporting third party contracts or not.

### Core

The core deployment tool will deploy the `UniswapV2Factory` factory and it'll also output the init code hash of the `UniswapV2Pair` contract. The init code hash is extremely important - it's used by the UniswapV2Factory to create new trading pairs as well as the Uniswap SDK to calculate pair addresses.

After deploying the UniswapV2Factory contract pay attention to the factory address as well as the init code hash the tool outputs.

#### Usage
```
$ node tools/deployment/core/deploy.js --network NETWORK
```

You should see output similar to the following:
```
$ node tools/deployment/core/deploy.js --network testnet

Deployed contract UniswapV2Factory: 0xfD01DA6dFFD444c16157716939c789a5f70c19b2 (one1l5qa5m0l63zvzc2hw95nn3uf5hmscxdjkvk29v)
Init code hash for UniswapV2Pair is: 0x87356c32b1d11f0ecc268fbd499639821bf3bcbd0547a703a3437ff4673abb84

export NETWORK=testnet; export UNISWAPV2FACTORY=0xfD01DA6dFFD444c16157716939c789a5f70c19b2; export INIT_CODE_HASH=0x87356c32b1d11f0ecc268fbd499639821bf3bcbd0547a703a3437ff4673abb84;
```

As previously mentioned - pay attention to both the UniswapV2Factory address as well as the init code hash.

### External (only required for first deployment)

Just like Uniswap V2 on Ethereum, Swoop also depends on two separate external contracts: [Multicall by MakerDAO](https://github.com/makerdao/multicall) and [wETH/wrapped ETHER](https://github.com/gnosis/canonical-weth/blob/master/contracts/WETH9.sol).

These contracts only have to be deployed once for each respective network (testnet or mainnet) and won't have to be deployed every single deployment.

The external deployment also includes a set of ERC-20 token contracts that can be deployed and used for testing.

See below for already deployed contracts - most likely you won't have to perform this step most of the time.

#### List of deployed contracts

| Contract     | Testnet                                                                                 | Mainnet     |
| -----------  | --------------------------------------------------------------------------------------- | ----------- |
| Multicall    | 0xbcd3451992B923531615293Cb2b2c38ba8DE9529 (one1hnf52xvjhy34x9s49y7t9vkr3w5da9ffd3nz4u) | 0xFE4980f62D708c2A84D3929859Ea226340759320 (one1leycpa3dwzxz4pxnj2v9n63zvdq8tyeq09t0eu) |
| WONE         | 0x7466d7d0C21Fa05F32F5a0Fa27e12bdC06348Ce2 (one1w3nd05xzr7s97vh45raz0cftmsrrfr8zg26pdl) | 0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a (one1eanyppa9hvpr0g966e6zs5hvdjxkngn6jtulua) |
| OneBUSD      | 0x0E80905676226159cC3FF62B1876C907C91F7395 (one1p6qfq4nkyfs4nnpl7c43sakfqly37uu40nn5yj) | 0xCefa2dF6A6FAcd50E7ABe1e6664e82DCd05d5EcD (one1emazma4xltx4peatu8nxvn5zmng96hkdddgaqc) |
| OneBTC       | 0xcA65E483e885BbECF8FBc3856593E66577e06bC2 (one1efj7fqlgska7e78mcwzktylxv4m7q67zwcvr6k) | 0x95Eb8075F7f7aFB37f5F4cC90663F709040088e1 (one1jh4cqa0h77hmxl6lfnysvclhpyzqpz8p3jfks7) |
| OneETH       | 0x1E120B3b4aF96e7F394ECAF84375b1C661830013 (one1rcfqkw62l9h87w2wetuyxad3cescxqqnkrnfcc) | 0xdF0EEeAfc1d84Bb2d572e1cBD8CAB40dbDA0Ff6F (one1mu8wat7pmp9m94tju89a3j45pk76plm0jnm35s) |
| OneChainlink | 0x2C6e26B2faD89bc52d043e78E3D980A08af0Ce88 (one193hzdvh6mzdu2tgy8euw8kvq5z90pn5g7j0kqd) | 0x2CD7392Dbdd387C80E1A3D910f1Ad21fC4Ad5811 (one19ntnjtda6wrusrs68kgs7xkjrlz26kq3kxezww) |
| OneSeed      | 0x6689F57AD16c374783585ba2C77F5316789886F2 (one1v6yl27k3dsm50q6ctw3vwl6nzeuf3phj072j9r) | 0x77C1225F07EDdd8eCb1E37d04a0D4f45EAe3F051 (one1wlqjyhc8ahwcajc7xlgy5r20gh4w8uz3n45dr8) |

#### Usage
##### Deploy Multicall and wETH contracts:
```
$ node tools/deployment/external/deploy.js --network NETWORK (valid arguments: testnet, mainnet)
```
After running the deployment tool you'd for example see:
```
$ node tools/deployment/external/deploy.js --network testnet

Deployed contract Multicall: 0xd11760dc29e81cA88c66f43619897443AAEA397a (one16ytkphpfaqw23rrx7smpnzt5gw4w5wt6pf83nh)
Deployed contract WONE: 0xa772D488bc4F66d84bC675B168528673896eAA85 (one15aedfz9ufandsj7xwkcks55xwwyka259nz598s)

export NETWORK=testnet; export MULTICALL=0xd11760dc29e81cA88c66f43619897443AAEA397a; export WONE=0xa772D488bc4F66d84bC675B168528673896eAA85;
```

Pay attention to the contract addresses you just deployed, you'll need to update contract addresses various libraries in later steps.

##### Deploy Multicall, wETH + test token contracts:
```
$ node tools/deployment/external/deploy.js --network NETWORK --extra
```
After running the deployment tool you'd for example see:
```
$ node tools/deployment/external/deploy.js --network testnet --extra

Deployed contract Multicall: 0xd11760dc29e81cA88c66f43619897443AAEA397a (one16ytkphpfaqw23rrx7smpnzt5gw4w5wt6pf83nh)
Deployed contract WONE: 0xa772D488bc4F66d84bC675B168528673896eAA85 (one15aedfz9ufandsj7xwkcks55xwwyka259nz598s)
Deployed contract OneBUSD: 0x548AA826026Fbebc614ed44d4Bb201C98a730ecE (one12j92sfszd7ltcc2w63x5hvspex98xrkwlnefzp)
Deployed contract OneBTC: 0x8500Dd7296E08acAA4A4E1b3798F4edf2f8C4989 (one1s5qd6u5kuz9v4f9yuxehnr6wmuhccjvfhx67vm)
Deployed contract OneETH: 0xC7842BF5692cE2d3e2BCb5D37Fda1B7C427459F8 (one1c7zzhatf9n3d8c4ukhfhlksm03p8gk0c793kvy)
Deployed contract OneChainlink: 0x30fF1eAAD316413DC74ADB3a6c3963bB239F140a (one1xrl3a2knzeqnm362mvaxcwtrhv3e79q2kealfe)
Deployed contract OneSeed: 0x89175f245b87Ba646B1CEEB1e51BdFec3d0f193D (one13yt47fzms7axg6cua6c72x7las7s7xfawgzjjy)

export NETWORK=testnet; export MULTICALL=0xd11760dc29e81cA88c66f43619897443AAEA397a; export WONE=0xa772D488bc4F66d84bC675B168528673896eAA85; export ONEBUSD=0x548AA826026Fbebc614ed44d4Bb201C98a730ecE; export ONEBTC=0x8500Dd7296E08acAA4A4E1b3798F4edf2f8C4989; export ONEETH=0xC7842BF5692cE2d3e2BCb5D37Fda1B7C427459F8; export ONECHAINLINK=0x30fF1eAAD316413DC74ADB3a6c3963bB239F140a; export ONESEED=0x89175f245b87Ba646B1CEEB1e51BdFec3d0f193D;
```

### Periphery

The periphery step of the deployment process will deploy the `UniswapV2Router02` contract which is the main contract used by the Uniswap/Swoop UI.

The Router will route trades as well as interfacing with the `UniswapV2Factory` contract to create new trading pairs.

Before deploying the `UniswapV2Router02` contract you have to make sure that [the init code hash in the `UniswapV2Library.sol` contract in swoop-periphery](https://github.com/harmony-one/swoop-periphery/blob/master/contracts/libraries/UniswapV2Library.sol) matches the code hash outputted by the core deployment step.

The output from that command includes a line similar to the following:
```
Init code hash for UniswapV2Pair is: 0x87356c32b1d11f0ecc268fbd499639821bf3bcbd0547a703a3437ff4673abb84
```

Take that code hash and compare with the code hash in the [`UniswapV2Library.sol` contract](https://github.com/harmony-one/swoop-periphery/blob/master/contracts/libraries/UniswapV2Library.sol) (removing the leading `0x` prefix). The hash is typically defined on line 25, but this might obviously change if the contract is modified.

If those hashes do not match - update the [`UniswapV2Library.sol` contract](https://github.com/harmony-one/swoop-periphery/blob/master/contracts/libraries/UniswapV2Library.sol) to use the proper hash, publish a new version to NPM and update the package.json file for this repo to use the new package. You can then proceed with the rest of the periphery deployment procedure.

In order to deploy the `UniswapV2Router02` you need to have already deployed the `UniswapV2Factory` contract from the previous core step of this deployment process. You also need to have deployed (or have access to) a wONE (wETH) contract.

#### Usage
```
$ node tools/deployment/periphery/deploy.js --network NETWORK --factory UNISWAPV2FACTORY_ADDRESS --wone WONE_ADDRESS
```
After running the deployment tool you'd for example see:
```
$ node tools/deployment/periphery/deploy.js --network testnet --factory 0xfD01DA6dFFD444c16157716939c789a5f70c19b2 --wone 0xa772D488bc4F66d84bC675B168528673896eAA85

Deployed contract UniswapV2Router02: 0x8E2B97a4E4AA8E862cD50A1b4CBFDCae596BeBE7 (one13c4e0f8y428gvtx4pgd5e07u4evkh6l8j2lmau)

export NETWORK=testnet; export UNISWAPV2ROUTER02=0x8E2B97a4E4AA8E862cD50A1b4CBFDCae596BeBE7;
```

You have now deployed the relevant smart contracts required to run Uniswap/Swoop on Harmony. See below for additional changes that need to be made to the client side libraries.

## Libraries / SDK / Interface

After the smart contracts have been deployed various contract addresses for Multicall, wONE, UniswapV2Factory and UniswapV2Router02 have to be updated in [swoop-sdk](https://github.com/harmony-one/swoop-sdk) and [swoop-interface](https://github.com/harmony-one/swoop-interface).

If you've changed the wONE (wETH) contract deployment or if you've re-deployed testing token contracts, you also have to change [swoop-default-token-list](https://github.com/harmony-one/swoop-default-token-list).

### Swoop SDK

Repository: [https://github.com/harmony-one/swoop-sdk](https://github.com/harmony-one/swoop-sdk)

[Swoop SDK](https://github.com/harmony-one/swoop-sdk) is simply a fork of the original [Uniswap V2 SDK](https://github.com/Uniswap/uniswap-sdk).

The important parts that need to be changed in the SDK are the `FACTORY_ADDRESS` and `INIT_CODE_HASH` in [`src/constants.ts`](https://github.com/harmony-one/swoop-sdk/blob/master/src/constants.ts) and WONE contract addresses at the bottom of [`src/entities/token.ts`](https://github.com/harmony-one/swoop-sdk/blob/master/src/entities/token.ts).

- `src/constants.ts`: `FACTORY_ADDRESS` needs to be changed to the address of the `UniswapV2Factory` contract you previously deployed.
- `src/constants.ts`: `INIT_CODE_HASH` needs to be changed to the init code hash that was outputted during the core/factory deployment step. This time the value is entered with the leading `0x` prefix.
- `src/entities/token.ts`: Update the WONE constant (at the bottom of the file) with the proper wONE addresses if you've re-deployed a new set of wONE contracts.

Please note that `FACTORY_ADDRESS` and `INIT_CODE_HASH` can't be set for multiple platforms. This is how it was originally implemented in original Uniswap - but we could look into improving this and follow a model similar to how it's dealt with regarding the wONE contracts (which can be defined for multiple network environments).

If you had to make any changes to the above mentioned files - commit the changes, push/merge with [Swoop SDK](https://github.com/harmony-one/swoop-sdk) and then publish a new package on NPM using `yarn publish`.

### Swoop Interface

Repository: [https://github.com/harmony-one/swoop-interface](https://github.com/harmony-one/swoop-interface)

If you had to make any changes in the previous step, first make sure to use the latest `@swoop-exchange/sdk` version in `package.json`. Then update your packages using e.g. `yarn install`.

If you've deployed a new router contract, update `ROUTER_ADDRESS` in [`src/constants/index.ts`](https://github.com/harmony-one/swoop-interface/blob/master/src/constants/index.ts) to the address of the contract you deployed. This setting is not network specific

If you've deployed a new Multicall contract (shouldn't happen all too often), you need to also change `MULTICALL_NETWORKS` in [`src/constants/multicall/index.ts`](https://github.com/harmony-one/swoop-interface/blob/master/src/constants/multicall/index.ts) to use the new set of addresses.

If you've followed all the previous steps you should now have a correctly updated interface, go ahead and start it using `yarn start` and ensure that everything works as expected.
