# Swoop vs Uniswap V2

## Smart Contracts

The Swoop smart contract code is a very similar to the original code for the Uniswap V2 contracts.

Solidity versions used to compile the contracts are `=0.5.16` and `>=0.6.0` (same as original Uniswap V2).

Diff files between the original Uniswap V2 and Swoop contracts are available in the sub folders [core](core/), [periphery](periphery/) and [lib](lib/).

Empty diff/patch files signify that there are no changes between the original Uniswap V2 code and the code used in Swoop.

### Core (uniswap/uniswap-v2-core -> harmony-one/swoop-core)

#### UniswapV2ERC20.sol

Name and symbol have been changed from Uniswap V2 and UNI-V2 to Swoop and SWP respectively.
```patch
-    string public constant name = 'Uniswap V2';
-    string public constant symbol = 'UNI-V2';
+    string public constant name = 'Swoop';
+    string public constant symbol = 'SWP';
```

Diff: [UniswapV2ERC20.sol.patch](core/UniswapV2ERC20.sol.patch)

### Periphery (uniswap/uniswap-v2-periphery -> harmony-one/swoop-periphery)

#### UniswapV2Library.sol

Package reference has been updated:
```patch
-import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
+import '@swoop-exchange/core/contracts/interfaces/IUniswapV2Pair.sol';
```

Init code hash has been updated:
```patch
@@ -21,7 +22,7 @@
                 hex'ff',
                 factory,
                 keccak256(abi.encodePacked(token0, token1)),
-                hex'96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f' // init code hash
+                hex'e3c4d7c2f0f0eb6af0a666a9b54ea1196dd3676e4e4b696af853d8951f807cc5' // init code hash
             ))));
     }
```

Diff: [UniswapV2Library.sol.patch](periphery/UniswapV2Library.sol.patch)

#### UniswapV2Router02.sol

Package references have been updated:
```patch
-import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
-import '@uniswap/lib/contracts/libraries/TransferHelper.sol';
+import '@swoop-exchange/core/contracts/interfaces/IUniswapV2Factory.sol';
+import '@swoop-exchange/lib/contracts/libraries/TransferHelper.sol';
```

Diff: [UniswapV2Router02.sol.patch](periphery/UniswapV2Router02.sol.patch)
