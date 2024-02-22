import React, { useEffect, useState } from "react";
import ContractService from "./contractService";
const ethers = require("ethers");

function App() {
  const [rootTokenAddress, setRootTokenAddress] = useState("");
  const [childTokenAddress, setChildTokenAddress] = useState("");
  const [rootAmount, setRootAmount] = useState("");
  const [childAmount, setChildAmount] = useState("");
  const [L2Data, setL2Data] = useState("");
  const [L1Data, setL1Data] = useState("");
  const [L2Signature, setL2Signature] = useState("");
  const [L1Signature, setL1Signature] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* MetaMask is installed */
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  const handleDeposit = async () => {
    try {
      const { data, signature } = await ContractService.depositOnL1(
        rootTokenAddress,
        rootAmount
      );
      console.log("data: ", data);
      console.log("signature: ", signature);
      setL2Data(data);
      setL2Signature(signature);
      console.log("Deposit on L1 successful!");
    } catch (error) {
      console.error("Error depositing on L1:", error.message);
    }
  };
  const handleMint = async () => {
    // Assuming the user copies data and signature from the Deposit on L1 section
    try {
      await ContractService.mintOnL2(L2Data, L2Signature);
      console.log("Mint on L2 successful!");
    } catch (error) {
      console.error("Error minting on L2:", error.message);
    }
  };

  const handleBurn = async () => {
    try {
      const { data, signature } = await ContractService.burnOnL2(
        childTokenAddress,
        childAmount
      );
      console.log("data: ", data);
      console.log("signature: ", signature);
      setL1Data(data);
      setL1Signature(signature);
      console.log("Deposit on L1 successful!");
    } catch (error) {
      console.error("Error burning on L2:", error.message);
    }
  };
  const handleWithdraw = async () => {
    // Assuming the user copies data and signature from the Deposit on L1 section
    try {
      await ContractService.withdrawOnL1(L1Data, L1Signature);
      console.log("Mint on L2 successful!");
    } catch (error) {
      console.error("Error withdrawing on L1:", error.message);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">Cross-Chain Bridge</h1>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center">
              <button
                className="button is-white connect-wallet"
                onClick={connectWallet}
              >
                <span className="is-link has-text-weight-bold">
                  {walletAddress && walletAddress.length > 0
                    ? `Connected: ${walletAddress.substring(
                        0,
                        6
                      )}...${walletAddress.substring(38)}`
                    : "Connect Wallet"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Deposit on L1 Section */}
      <div>
        <h2>Deposit on L1</h2>
        <label>
          Root Token Address:
          <input
            type="text"
            value={rootTokenAddress}
            onChange={(e) => setRootTokenAddress(e.target.value)}
          />
        </label>
        <br />
        <label>
          Root Token Amount:
          <input
            type="text"
            value={rootAmount}
            onChange={(e) => setRootAmount(e.target.value)}
          />
        </label>
        <br />
        <button onClick={handleDeposit}>Deposit</button>
      </div>

      {/* Display Data and Signature */}
      <div>
        <p>Data: {L2Data}</p>
        <p>Signature: {L2Signature}</p>
      </div>

      {/* Mint on L2 Section */}
      <div>
        <h2>Mint on L2</h2>
        <label>
          Data:
          <input
            type="text"
            value={L2Data}
            onChange={(e) => setL2Data(e.target.value)}
          />
        </label>
        <br />
        <label>
          Signature:
          <input
            type="text"
            value={L2Signature}
            onChange={(e) => setL2Signature(e.target.value)}
          />
        </label>
        <br />
        <button onClick={handleMint}>Mint</button>
      </div>

      {/* Burn on L2 Section */}
      <div>
        <h2>Burn on L2</h2>
        <label>
          Child Token Address:
          <input
            type="text"
            value={childTokenAddress}
            onChange={(e) => setChildTokenAddress(e.target.value)}
          />
        </label>
        <br />
        <label>
          Child Token Amount:
          <input
            type="text"
            value={childAmount}
            onChange={(e) => setChildAmount(e.target.value)}
          />
        </label>
        <br />
        <button onClick={handleBurn}>Burn</button>
      </div>

      {/* Display Data and Signature */}
      <div>
        <p>Data: {L1Data}</p>
        <p>Signature: {L1Signature}</p>
      </div>

      {/* Withdraw on L1 Section */}
      <div>
        <h2>Withdraw on L1</h2>
        <label>
          Data:
          <input
            type="text"
            value={L1Data}
            onChange={(e) => setL1Data(e.target.value)}
          />
        </label>
        <br />
        <label>
          Signature:
          <input
            type="text"
            value={L1Signature}
            onChange={(e) => setL1Signature(e.target.value)}
          />
        </label>
        <br />
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>
    </div>
  );
}

export default App;
