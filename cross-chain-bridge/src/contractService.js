const ethers = require("ethers");

const {
  generateSignatureL1,
  generateDataL1,
  generateSignatureL2,
  generateDataL2,
} = require("./scripts/generateSignature");

const config = require("./config/config.json");
const bridgeFactoryV3Abi = require("./ABI/BridgeFactoryV3.json");
const bridgeDeployerV3Abi = require("./ABI/BridgeDeployerV3.json");
const tokenL1Abi = require("./ABI/TokenL1.json");
const tokenL2Abi = require("./ABI/TokenL2.json");

const bridgeFactoryV3Address = config.BridgeFactoryLast.goerli;
const bridgeDeployerV3Address = config.BridgeDeployerLast.mumbai;

let signer = null;
let provider;
if (window.ethereum == null) {
  console.log("MetaMask not installed; using read-only defaults");
  provider = ethers.getDefaultProvider();
} else {
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
}

const depositOnL1 = async function (tokenAddress, amount) {
  const bridgeFactoryV3 = new ethers.Contract(
    bridgeFactoryV3Address,
    bridgeFactoryV3Abi,
    signer
  );

  const transaction = await bridgeFactoryV3.depositOnL1(tokenAddress, amount);
  const receipt = await transaction.wait();
  console.log(receipt);
  console.log(receipt.blockHash);
  console.log(signer.address);

  let data;
  let signature;
  //   bridgeFactoryV3.on(
  //     bridgeFactoryV3.filters.DepositLog,
  //     async (rootTokenAddress, fromAddress, amount, nonce, event) => {
  //       const transactionAmountL1 = ethers.toNumber(amount);
  //       const transactionNonceL1 = ethers.toNumber(nonce);

  //       if (fromAddress === signer.address) {
  //         data = await generateDataL2(
  //             rootTokenAddress,
  //             fromAddress,
  //             transactionAmountL1,
  //             transactionNonceL1
  //           );
  //           signature = await generateSignatureL2(
  //             rootTokenAddress,
  //             fromAddress,
  //             transactionAmountL1,
  //             transactionNonceL1
  //           );
  //           return {data, signature};
  //       }
  //     }
  //   );
  return new Promise(async (resolve, reject) => {
    const listener = async (
      rootTokenAddress,
      fromAddress,
      amount,
      nonce,
      event
    ) => {
      try {
        const transactionAmountL1 = ethers.toNumber(amount);
        const transactionNonceL1 = ethers.toNumber(nonce);

        const data = await generateDataL2(
          rootTokenAddress,
          fromAddress,
          transactionAmountL1,
          transactionNonceL1
        );
        const signature = await generateSignatureL2(
          rootTokenAddress,
          fromAddress,
          transactionAmountL1,
          transactionNonceL1
        );

        // Remove the listener after resolving the Promise
        bridgeFactoryV3.off(bridgeFactoryV3.filters.DepositLog, listener);

        resolve({ data, signature });
      } catch (error) {
        reject(error);
      }
    };

    // Set up the event listener
    bridgeFactoryV3.on(bridgeFactoryV3.filters.DepositLog, listener);
  });
};

const mintOnL2 = async (data, signature) => {
//   await provider.request({
//     method: "wallet_switchEthereumChain",
//     params: [{ chainId: ethers.utils.hexValue(80001) }],
//   });
  const bridgeDeployerV3 = new ethers.Contract(
    bridgeDeployerV3Address,
    bridgeDeployerV3Abi,
    signer
  );

  await bridgeDeployerV3.mintOnL2(data, signature);
};

const burnOnL2 = async function (childTokenAddress, childAmount) {
  const bridgeDeployerV3 = new ethers.Contract(
    bridgeDeployerV3Address,
    bridgeDeployerV3Abi,
    signer
  );

  const transaction = await bridgeDeployerV3.burnOnL2(
    childTokenAddress,
    childAmount
  );
  const receipt = await transaction.wait();
  console.log(receipt);
  console.log(receipt.blockHash);
  console.log(signer.address);

  let data;
  let signature;
  //   bridgeFactoryV3.on(
  //     bridgeFactoryV3.filters.DepositLog,
  //     async (rootTokenAddress, fromAddress, amount, nonce, event) => {
  //       const transactionAmountL1 = ethers.toNumber(amount);
  //       const transactionNonceL1 = ethers.toNumber(nonce);

  //       if (fromAddress === signer.address) {
  //         data = await generateDataL2(
  //             rootTokenAddress,
  //             fromAddress,
  //             transactionAmountL1,
  //             transactionNonceL1
  //           );
  //           signature = await generateSignatureL2(
  //             rootTokenAddress,
  //             fromAddress,
  //             transactionAmountL1,
  //             transactionNonceL1
  //           );
  //           return {data, signature};
  //       }
  //     }
  //   );
  return new Promise(async (resolve, reject) => {
    const listener = async (
      childTokenAddress,
      fromAddress,
      amount,
      nonce,
      event
    ) => {
      try {
        const transactionAmountL2 = ethers.toNumber(amount);
        const transactionNonceL2 = ethers.toNumber(nonce);

        const data = await generateDataL1(
          childTokenAddress,
          fromAddress,
          transactionAmountL2,
          transactionNonceL2
        );
        const signature = await generateSignatureL1(
          childTokenAddress,
          fromAddress,
          transactionAmountL2,
          transactionNonceL2
        );

        // Remove the listener after resolving the Promise
        bridgeDeployerV3.off(bridgeDeployerV3.filters.BurnLog, listener);

        resolve({ data, signature });
      } catch (error) {
        reject(error);
      }
    };

    // Set up the event listener
    bridgeDeployerV3.on(bridgeDeployerV3.filters.DepositLog, listener);
  });
};

const withdrawOnL1 = async (data, signature) => {
//   await provider.request({
//     method: "wallet_switchEthereumChain",
//     params: [{ chainId: ethers.utils.hexValue(5) }],
//   });
  const bridgeFactoryV3 = new ethers.Contract(
    bridgeFactoryV3Address,
    bridgeFactoryV3Abi,
    signer
  );

  await bridgeFactoryV3.withdrawOnL1(data, signature);
};

export default {
  depositOnL1,
  mintOnL2,
  burnOnL2,
  withdrawOnL1,
};
