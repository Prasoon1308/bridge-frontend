import React, { useState } from 'react';
import ContractService from './contractService';

function App() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [data, setData] = useState('');
  const [signature, setSignature] = useState('');

  const handleDeposit = async () => {
    try {
      await ContractService.depositOnL1(tokenAddress, amount);
      console.log('Deposit on L1 successful!');
    } catch (error) {
      console.error('Error depositing on L1:', error.message);
    }
  };

  const handleMint = async () => {
    // Assuming the user copies data and signature from the Deposit on L1 section
    try {
      await ContractService.mintOnL2(data, signature);
      console.log('Mint on L2 successful!');
    } catch (error) {
      console.error('Error minting on L2:', error.message);
    }
  };

  return (
    <div>
      <h1>Cross-Chain Bridge</h1>

      {/* Deposit on L1 Section */}
      <div>
        <h2>Deposit on L1</h2>
        <label>
          Token Address:
          <input type="text" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} />
        </label>
        <br />
        <label>
          Amount:
          <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <br />
        <button onClick={handleDeposit}>Deposit</button>
      </div>

      {/* Mint on L2 Section */}
      <div>
        <h2>Mint on L2</h2>
        <label>
          Data:
          <input type="text" value={data} onChange={(e) => setData(e.target.value)} />
        </label>
        <br />
        <label>
          Signature:
          <input type="text" value={signature} onChange={(e) => setSignature(e.target.value)} />
        </label>
        <br />
        <button onClick={handleMint}>Mint</button>
      </div>
    </div>
  );
}

export default App;
