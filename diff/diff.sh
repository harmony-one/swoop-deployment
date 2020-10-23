#!/usr/bin/env bash

usage() {
   cat << EOT
Usage: $0 [option] command
Options:
   --path               path            base directory to look for contract repos
   --repo               name            name of repo to diff
   --help                               print this help section
EOT
}

while [ $# -gt 0 ]
do
  case $1 in
  --path) path="${2%/}" ; shift;;
  --repo) repo="${2%/}" ; shift;;
  -h|--help) usage; exit 1;;
  (--) shift; break;;
  (-*) usage; exit 1;;
  (*) break;;
  esac
  shift
done

if [ -z "$path" ]; then
  echo "You need to enter a base path"
  exit 1
fi

if [ -z "$repo" ]; then
  repo="core"
fi
output=$repo
rm -rf $output
mkdir -p $output
output="${output}/"

declare -A contracts

if [ "$repo" == "core" ]; then
  # Core contracts
  contracts[uniswap/uniswap-v2-core/contracts/UniswapV2ERC20.sol]=swoop/swoop-core/contracts/UniswapV2ERC20.sol
  contracts[uniswap/uniswap-v2-core/contracts/UniswapV2Pair.sol]=swoop/swoop-core/contracts/UniswapV2Pair.sol
  contracts[uniswap/uniswap-v2-core/contracts/UniswapV2Factory.sol]=swoop/swoop-core/contracts/UniswapV2Factory.sol

  contracts[uniswap/uniswap-v2-core/contracts/interfaces/IERC20.sol]=swoop/swoop-core/contracts/interfaces/IERC20.sol
  contracts[uniswap/uniswap-v2-core/contracts/interfaces/IUniswapV2Callee.sol]=swoop/swoop-core/contracts/interfaces/IUniswapV2Callee.sol
  contracts[uniswap/uniswap-v2-core/contracts/interfaces/IUniswapV2ERC20.sol]=swoop/swoop-core/contracts/interfaces/IUniswapV2ERC20.sol
  contracts[uniswap/uniswap-v2-core/contracts/interfaces/IUniswapV2Factory.sol]=swoop/swoop-core/contracts/interfaces/IUniswapV2Factory.sol
  contracts[uniswap/uniswap-v2-core/contracts/interfaces/IUniswapV2Pair.sol]=swoop/swoop-core/contracts/interfaces/IUniswapV2Pair.sol

  contracts[uniswap/uniswap-v2-core/contracts/libraries/Math.sol]=swoop/swoop-core/contracts/libraries/Math.sol
  contracts[uniswap/uniswap-v2-core/contracts/libraries/SafeMath.sol]=swoop/swoop-core/contracts/libraries/SafeMath.sol
  contracts[uniswap/uniswap-v2-core/contracts/libraries/UQ112x112.sol]=swoop/swoop-core/contracts/libraries/UQ112x112.sol

  contracts[uniswap/uniswap-v2-core/contracts/test/ERC20.sol]=swoop/swoop-core/contracts/test/ERC20.sol

elif [ "$repo" == "periphery" ]; then
  # Periphery contracts
  contracts[uniswap/uniswap-v2-periphery/contracts/UniswapV2Router02.sol]=swoop/swoop-periphery/contracts/UniswapV2Router02.sol

  contracts[uniswap/uniswap-v2-periphery/contracts/libraries/SafeMath.sol]=swoop/swoop-periphery/contracts/libraries/SafeMath.sol
  contracts[uniswap/uniswap-v2-periphery/contracts/libraries/UniswapV2Library.sol]=swoop/swoop-periphery/contracts/libraries/UniswapV2Library.sol

  contracts[uniswap/uniswap-v2-periphery/contracts/interfaces/IERC20.sol]=swoop/swoop-periphery/contracts/interfaces/IERC20.sol
  contracts[uniswap/uniswap-v2-periphery/contracts/interfaces/IUniswapV2Router01.sol]=swoop/swoop-periphery/contracts/interfaces/IUniswapV2Router01.sol
  contracts[uniswap/uniswap-v2-periphery/contracts/interfaces/IUniswapV2Router02.sol]=swoop/swoop-periphery/contracts/interfaces/IUniswapV2Router02.sol
  contracts[uniswap/uniswap-v2-periphery/contracts/interfaces/IUniswapV2Migrator.sol]=swoop/swoop-periphery/contracts/interfaces/IUniswapV2Migrator.sol
  contracts[uniswap/uniswap-v2-periphery/contracts/interfaces/IWETH.sol]=swoop/swoop-periphery/contracts/interfaces/IWETH.sol
elif [ "$repo" == "lib" ]; then
  # Periphery contracts

  contracts[uniswap/uniswap-lib/contracts/libraries/AddressStringUtil.sol]=swoop/swoop-lib/contracts/libraries/AddressStringUtil.sol
  contracts[uniswap/uniswap-lib/contracts/libraries/Babylonian.sol]=swoop/swoop-lib/contracts/libraries/Babylonian.sol
  contracts[uniswap/uniswap-lib/contracts/libraries/FixedPoint.sol]=swoop/swoop-lib/contracts/libraries/FixedPoint.sol
  contracts[uniswap/uniswap-lib/contracts/libraries/PairNamer.sol]=swoop/swoop-lib/contracts/libraries/PairNamer.sol
  contracts[uniswap/uniswap-lib/contracts/libraries/SafeERC20Namer.sol]=swoop/swoop-lib/contracts/libraries/SafeERC20Namer.sol
  contracts[uniswap/uniswap-lib/contracts/libraries/TransferHelper.sol]=swoop/swoop-lib/contracts/libraries/TransferHelper.sol
fi

for uniswap_path in "${!contracts[@]}"; do
  swoop_path=${contracts[$uniswap_path]}
  full_uniswap_path="${path}/${uniswap_path}"
  full_swoop_path="${path}/${swoop_path}"
  contract_name=$(ls ${full_swoop_path} | xargs -n 1 basename)

  echo "Diffing ${full_uniswap_path} with ${full_swoop_path} to ${contract_name}"
  diff -u ${full_uniswap_path} ${full_swoop_path} > ${output}${contract_name}.patch
done
