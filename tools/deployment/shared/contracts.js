const { getAddress: hmyGetAddress } = require("@harmony-js/crypto");
const { getAddress: ethGetAddress } = require("@ethersproject/address");

exports.deployContract = async (network, contractJson, args) => {
  let contract = network.client.contracts.createContract(contractJson.abi)
  contract.wallet.addByPrivateKey(network.accounts.deployer.privateKey)
  // contract.wallet.setSigner(network.privateKeys.deployer);
  
  let options = {
    data: '0x' + contractJson.bytecode
  };

  if (args != null) {
    options['arguments'] = args
  }

  let response = await contract.methods.contractConstructor(options).send(network.gasOptions())
  const contractAddressReceived = (response && response.transaction && response.transaction.receipt && response.transaction.receipt.contractAddress.length > 0);
  // Make sure to checksum the addresses - some Uniswap tests depend on addresses being checksummed!
  var contractAddress =  contractAddressReceived ? ethGetAddress(response.transaction.receipt.contractAddress) : '';
  var oneContractAddress = (contractAddress.length > 0) ? hmyGetAddress(contractAddress).bech32 : '';

  return { base16Address: contractAddress, bech32Address: oneContractAddress };
}

exports.outputEnvStatus = (networkName, deployed) => {
  var env = '';
  for (const contract in deployed) {
    const addr = deployed[contract];
    env += `export ${contract.toUpperCase()}=${addr}; `
  }
  console.log(`\n    export NETWORK=${networkName}; ${env}`);
}
