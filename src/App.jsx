import { ethers } from "ethers";
import React, { useEffect } from 'react'
import Header from './Components/Header'
import { useState } from "react"
import Form from './Components/Form'
import Cards from './Components/Cards'
import Footer from './Components/Footer'


function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [SendTo, setSendTo] = useState("");
  const [Arbiter, setArbiter] = useState("");
  const [Condition, setCondition] = useState("");
  const [Amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [escrowAddress, setEscrowAddress] = useState("");
  const [error, setError] = useState("");

  const [escrowCreated, setEscrowCreated] = useState(false);

  const contractAddress = "0x0182777B7f77cB92e47a8eb59B1E283D3b8A9F01";
  const contractABI = [
    {
      "inputs": [],
      "name": "ReturnPayment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_beneficiary",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_arbiter",
          "type": "address"
        }
      ],
      "name": "createNewEscrowContract",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "escrow",
      "outputs": [
        {
          "internalType": "contract Escrow",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getEscrowContracts",
      "outputs": [
        {
          "internalType": "contract Escrow",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const EscrowABI = [
    {
      "inputs": [
        { "internalType": "address", "name": "_depositor", "type": "address" },
        { "internalType": "address", "name": "_beneficiary", "type": "address" },
        { "internalType": "address", "name": "_arbiter", "type": "address" }
      ],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ReturnPayment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAmount",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "arbiter",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "beneficiary",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "depositor",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isApproved",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isReturned",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    }

  ];

  useEffect(() => {
    const checkConnection = async () => {
      const { isConnected, account, balance } = await checkIfWalletIsConnected();
      if (isConnected) {
        setAccount(account);
        setIsConnected(true);
        setBalance(balance);
      }
    };
    checkConnection();
    // If the account is switched change the state
    window.ethereum.on("accountsChanged", async (accounts) => {
      const { isConnected, account, balance } = await checkIfWalletIsConnected();
      if (isConnected) {
        setAccount(account);
        setIsConnected(true);
        setBalance(balance);
      }
    });

    const saved = localStorage.getItem("escrowInfo");
    if (saved) {
      const data = JSON.parse(saved);
      setEscrowAddress(data.address);
      setSendTo(data.beneficiary);
      setArbiter(data.arbiter);
      setAmount(data.amount);
      setCondition(data.condition);
      setEscrowCreated(true);
    }
  }, []);

  const handleApprove = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const userAddress = accounts[0];
      const contract = await initializeContract(userAddress);

      const escrowContract = new ethers.Contract(escrowAddress, EscrowABI, provider.getSigner());

      const depositor = await escrowContract.depositor();
      const arbiter = await escrowContract.arbiter();
      const isApproved = await escrowContract.isApproved();


      // Sabko ek format mai lake comparison karengae
      const normalizedUser = ethers.utils.getAddress(userAddress);
      const normalizedDepositor = ethers.utils.getAddress(depositor);
      const normalizedArbiter = ethers.utils.getAddress(arbiter);

      if (normalizedUser !== normalizedDepositor && normalizedUser !== normalizedArbiter) {
        setError("You must be the depositor or arbiter to approve the escrow.");
        return;
      }

      if (isApproved) {
        setError("Escrow has already been approved.");
        return;
      }

      const tx = await escrowContract.approve();
      setStatus('Transaction sent, waiting for confirmation...');
      await tx.wait();
      setStatus('Transaction confirmed! ✅');
      setTimeout(() => {
        
      }, 2000);
      localStorage.removeItem("escrowInfo");
      setSendTo("");
      setArbiter("");
      setAmount("");
      setCondition("");
      setEscrowCreated(false);
      setStatus("");
    }
    catch (error) {
      console.error("Error approving:", error);
      setStatus("Error approving");
    }
  };


  const handleRefund = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const userAddress = accounts[0];
      const contract = await initializeContract(userAddress);

      const escrowAddress = await contract.escrow();
      const escrowContract = new ethers.Contract(escrowAddress, EscrowABI, provider.getSigner());

      const beneficiary = await escrowContract.beneficiary();
      const arbiter = await escrowContract.arbiter();
      const isReturned = await escrowContract.isReturned();

      const normalizedUser = ethers.utils.getAddress(userAddress);
      const normalizedBeneficiary = ethers.utils.getAddress(beneficiary);
      const normalizedArbiter = ethers.utils.getAddress(arbiter);

      if (normalizedUser !== normalizedBeneficiary && normalizedUser !== normalizedArbiter) {
        setError("You must be the Beneficiary or arbiter to refund the escrow.");
        return;
      }

      if (isReturned) {
        setError("Escrow has already been refunded.");
        return;
      }

      const tx = await escrowContract.ReturnPayment();
      setStatus('Transaction sent, waiting for confirmation...');
      await tx.wait();
      setStatus('Transaction confirmed! ✅');
      setTimeout(() => {
        
      }, 2000);
      localStorage.removeItem("escrowInfo");
      setSendTo("");
      setArbiter("");
      setAmount("");
      setCondition("");
      setEscrowCreated(false);
      setStatus("");
    }
    catch (error) {
      console.error("Error refunding:", error);
      setStatus("Error refunding");
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();

        if (network.chainId !== 11155111) {
          alert("Please connect to the Sepolia testnet.");
          return;
        }
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          const userAddress = accounts[0];
          const balanceWei = await provider.getBalance(userAddress);
          const balanceEth = ethers.utils.formatEther(balanceWei);

          setAccount(userAddress);
          setIsConnected(true);
          setBalance(balanceEth);

          initializeContract(userAddress);
        }
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        console.log("MetaMask not detected");
        return { isConnected: false, account: null };
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      initializeContract(accounts[0]);

      if (accounts.length > 0) {
        const userAddress = accounts[0];
        const balanceWei = await provider.getBalance(userAddress);
        const balanceEth = ethers.utils.formatEther(balanceWei);
        return { isConnected: true, account: userAddress, balance: balanceEth };
      } else {
        console.log("Wallet is NOT connected");
        return { isConnected: false, account: null };
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      return { isConnected: false, account: null };
    }
  };

  const initializeContract = async (userAddress) => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      return contract;
    } else {
      console.error("Ethereum object not found");
    }
  };

  const validateAddress = (address) => {
    return ethers.utils.isAddress(address);
  };

  const handleEscrow = async (e) => {
    e.preventDefault();
    console.log(Amount);

    if (escrowCreated) {
      setError("You already have an active escrow. Please approve or refund it before creating a new one.");
      setStatus("You already have an active escrow. Please approve or refund it before creating a new one.");
      return;
    }

    setStatus("Creating escrow...");
    const amountInWei = ethers.utils.parseEther(Amount.toString());


    if (!validateAddress(SendTo)) {
      setError("Invalid beneficiary address.");
      setStatus("Invalid beneficiary address.");
      return;
    }

    if (!validateAddress(Arbiter)) {
      setError("Invalid arbiter address.");
      setStatus("Invalid arbiter address.");
      return;
    }


    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const accounts = await provider.send("eth_requestAccounts", []);
      const userAddress = accounts[0];
      const contract = await initializeContract(userAddress);

      const Balance = await signer.getBalance();
      if (Balance.lt(amountInWei)) {
        alert("Insufficient balance for the transaction.");
        return;
      }

      if(SendTo === Arbiter){
        setError("Beneficiary and Arbiter addresses cannot be the same.");
        setStatus("Beneficiary and Arbiter addresses cannot be the same.");
        return;
      }
      if (SendTo.toLowerCase() === userAddress.toLowerCase()) {
        setError("You cannot be the beneficiary.");
        setStatus("You cannot be the beneficiary.");
        return;
      }
      if (Arbiter.toLowerCase() === userAddress.toLowerCase()) {
        setError("You cannot be the arbiter.");
        setStatus("You cannot be the arbiter.");
        return;
      }

      const tx = await contract.createNewEscrowContract(SendTo, Arbiter, {
        value: amountInWei,
        gasLimit: 500000,
      });

      setStatus('Transaction sent, waiting for confirmation...');
      const check = await tx.wait();
      console.log(check);
      setStatus('Transaction confirmed! ✅');
      setTimeout(() => {}, 2000);

      const escrowAddress = await contract.escrow();
      setEscrowAddress(escrowAddress);

      const escrowData = {
        address: escrowAddress,
        amount: Amount,
        beneficiary: SendTo,
        arbiter: Arbiter,
        depositor: userAddress,
        condition: Condition,
        escrowCreated: true,
      };

      localStorage.setItem("escrowInfo", JSON.stringify(escrowData));
      setStatus("");
      setError("");
      setBalance(Balance);

      setEscrowCreated(true);
    }
    catch (error) {
      console.error("Error creating escrow:", error);
      setStatus("Error creating escrow");
    }
  };

  return (
    <div className='bg-[#f6f7eb]'>
      <Header
        isConnected={isConnected}
        account={account}
        balance={balance}
        connectWallet={connectWallet}
      />

      {
        !isConnected ? (
          <div className='flex flex-col items-center justify-center h-156 '>
            <h1 className='text-4xl font-bold text-[#815854]'>Please connect your wallet </h1>
          </div>
        ) : (
          <>
            <div className='flex justify-center items-center p-10'>
              <Form
                handleEscrow={handleEscrow}
                SendTo={SendTo}
                setSendTo={setSendTo}
                Arbiter={Arbiter}
                setArbiter={setArbiter}
                Amount={Amount}
                setAmount={setAmount}
                Condition={Condition}
                setCondition={setCondition}
                status={status}
                disabled={escrowCreated}
                escrowCreated={escrowCreated}
              />
            </div>

            <div className='flex justify-center items-center p-10'>
              <h1 className='text-4xl font-bold text-[#393e41]'>Escrow Details</h1>
            </div>

            <div className='flex  justify-center items-center p-10'>
              <Cards
                account={account}
                SendTo={SendTo}
                Arbiter={Arbiter}
                Amount={Amount}
                Condition={Condition}
                escrowCreated={escrowCreated}
                handleApprove={handleApprove}
                handleRefund={handleRefund}
                escrowAddress={escrowAddress}
                error={error}
                status={status}
              />
            </div>
          </>
        )
      }
      <Footer />
    </div>
  )
}

export default App
