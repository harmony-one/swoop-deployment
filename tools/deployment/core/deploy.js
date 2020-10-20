require('dotenv').config();
const yargs = require('yargs');

const UniswapV2Factory = require('@swoop-exchange/core/build/contracts/UniswapV2Factory.json');
const { bytecode } = require('@swoop-exchange/core/build/contracts/UniswapV2Pair.json');

const { HmyEnv } = require('@swoop-exchange/utils');

const { keccak256 } = require('@ethersproject/solidity');

const { deployContract } = require("../shared/contracts");

// Args
const argv = yargs
  .option('network', {
    alias: 'n',
    description: 'Which network to use',
    type: 'string',
    default: 'testnet'
  })
  .help()
  .alias('help', 'h')
  .argv;

// Vars
const network = new HmyEnv(argv.network)
network.client.wallet.addByPrivateKey(network.accounts.deployer.privateKey)

const computedInitCodeHash = keccak256(['bytes'], [`0x${bytecode}`]);

async function deploy() {
  const { base16Address, bech32Address } = await deployContract(network, UniswapV2Factory, [network.client.wallet.signer.address]);

  console.log(`    Deployed contract UniswapV2Factory: ${base16Address} (${bech32Address})`);
  console.log(`    Init code hash for UniswapV2Pair is: ${computedInitCodeHash}`);
  console.log(`\n    export NETWORK=${argv.network}; export UNISWAPV2FACTORY=${base16Address}; export INIT_CODE_HASH=${computedInitCodeHash};`);
}

deploy()
  .then(() => {
    process.exit(0);
  })
  .catch(function(err){
    console.log(err);
    process.exit(0);
  });
