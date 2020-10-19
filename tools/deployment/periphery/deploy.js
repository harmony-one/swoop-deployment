require('dotenv').config();
const yargs = require('yargs');

const UniswapV2Router02 = require('@harmony-swoop/periphery/build/contracts/UniswapV2Router02.json');
const { HmyEnv } = require("@harmony-swoop/utils");
const { deployContract, outputEnvStatus } = require("../shared/contracts");

// Args
const argv = yargs
  .option('network', {
    alias: 'n',
    description: 'Which network to use',
    type: 'string',
    default: 'testnet'
  })
  .option('factory', {
    alias: 'f',
    description: 'The address of the UniswapV2Factory',
    type: 'string'
  })
  .option('wone', {
    alias: 'w',
    description: 'The address of the WONE token contract',
    type: 'string',
    default: process.env.WONE
  })
  .help()
  .alias('help', 'h')
  .argv;

var factoryAddress = argv.factory;
var woneAddress = argv.wone;

if (factoryAddress == null || factoryAddress == '') {
  console.log('You must supply a factory address using --factory CONTRACT_ADDRESS or -f CONTRACT_ADDRESS!');
  process.exit(0);
}

if (woneAddress == null || woneAddress == '') {
  console.log('You must supply an address to the wETH/wONE contract using --wone CONTRACT_ADDRESS or -w CONTRACT_ADDRESS!');
  process.exit(0);
}

// Vars
const network = new HmyEnv(argv.network);
network.client.wallet.addByPrivateKey(network.accounts.deployer.privateKey);

const deployed = {};

async function deploy() {
  const { base16Address, bech32Address } = await deployContract(network, UniswapV2Router02, [factoryAddress, woneAddress]);
  deployed['UniswapV2Router02'] = base16Address;
  console.log(`    Deployed contract UniswapV2Router02: ${base16Address} (${bech32Address})`)

  outputEnvStatus(argv.network, deployed);
}

deploy()
  .then(() => {
    process.exit(0);
  })
  .catch(function(err){
    console.log(err);
    process.exit(0);
  });
