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

const bridgeFactoryV3Address = config.BridgeFactoryV3.goerli;
const bridgeDeployerV3Address = config.BridgeDeployerV3.mumbai;

const depositOnL1 = async function (tokenAddress, amount) {
  let signer = null;

  let provider;
  if (window.ethereum == null) {
    // If MetaMask is not installed, we use the default provider,
    // which is backed by a variety of third-party services (such
    // as INFURA). They do not have private keys installed,
    // so they only have read-only access
    console.log("MetaMask not installed; using read-only defaults");
    provider = ethers.getDefaultProvider();
  } else {
    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
    provider = new ethers.BrowserProvider(window.ethereum);

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    signer = await provider.getSigner();
  }
  const bridgeFactoryV3 = new ethers.Contract(
    bridgeFactoryV3Address,
    bridgeFactoryV3Abi,
    signer
  );

  const transaction = await bridgeFactoryV3.depositOnL1(tokenAddress, amount);
  const receipt = await transaction.wait();
  console.log(receipt);

  let data;
  let signature;
  bridgeFactoryV3.on(
    bridgeFactoryV3.filters.DepositLog,
    async (rootTokenAddress, fromAddress, amount, nonce, event) => {
      const transactionAmountL1 = ethers.toNumber(amount);
      const transactionNonceL1 = ethers.toNumber(nonce);

      data = await generateDataL2(
        rootTokenAddress,
        fromAddress,
        transactionAmountL1,
        transactionNonceL1
      );
      signature = await generateSignatureL2(
        rootTokenAddress,
        fromAddress,
        transactionAmountL1,
        transactionNonceL1
      );
    }
  );
  return { data, signature };
};

const mintOnL2 = async (data, signature) => {
  let signer = null;

  let provider;
  if (window.ethereum == null) {
    // If MetaMask is not installed, we use the default provider,
    // which is backed by a variety of third-party services (such
    // as INFURA). They do not have private keys installed,
    // so they only have read-only access
    console.log("MetaMask not installed; using read-only defaults");
    provider = ethers.getDefaultProvider();
  } else {
    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
    provider = new ethers.BrowserProvider(window.ethereum);

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    signer = await provider.getSigner();
  }
  const bridgeDeployerV3 = new ethers.Contract(
    bridgeDeployerV3Address,
    bridgeDeployerV3Abi,
    signer
  );

  await bridgeDeployerV3.mintOnL2(data, signature);
};

export default {
  depositOnL1,
  mintOnL2,
};
