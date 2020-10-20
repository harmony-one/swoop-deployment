require('dotenv').config();
const yargs = require('yargs');

const { HmyEnv } = require("@swoop-exchange/utils");
const { deployContract, outputEnvStatus } = require("../shared/contracts");

// Args
const argv = yargs
  .option('network', {
    alias: 'n',
    description: 'Which network to use',
    type: 'string',
    default: 'testnet'
  })
  .option('extra', {
    alias: 'e',
    description: 'Deploy extra token contracts',
    type: 'boolean'
  })
  .help()
  .alias('help', 'h')
  .argv;

// Vars
const network = new HmyEnv(argv.network);
network.client.wallet.addByPrivateKey(network.accounts.deployer.privateKey);

const deployed = {};

async function deploy() {  
  const contracts = {
    Multicall: [],
    WONE: []
  }

  if (argv.extra) {
    contracts['OneBUSD'] = [];
    contracts['OneBTC'] = [];
    contracts['OneETH'] = [];
    contracts['OneChainlink'] = [];
    contracts['OneSeed'] = [];
  }

  for (const contract in contracts) {
    const args = contracts[contract];
    const contractJson = require(`@swoop-exchange/misc/build/contracts/${contract}`);
    const { base16Address, bech32Address } = await deployContract(network, contractJson, args);
    deployed[contract] = base16Address;

    console.log(`    Deployed contract ${contract}: ${base16Address} (${bech32Address})`);
  }

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
