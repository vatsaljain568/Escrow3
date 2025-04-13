import React from 'react'

function Header({ isConnected, account, balance , connectWallet}) {

    return (
        <div className='flex justify-around items-center p-5 z-10'>
            {/* <h1 className='text-4xl font-bold text-[#393e41]'>Escrow3</h1> */}
            <h1 className='text-4xl font-bold text-[#815854]'>Escrow3</h1>
            {
                !isConnected ? (
                    <button className='bg-[#815854] text-[#f6f7eb] font-bold py-2 px-4 rounded cursor-pointer' onClick={connectWallet}>
                        Connect Wallet
                    </button>
                ) : (
                    <div>
                        <p className='text-xl text-[#393e41]'> Account = {account}</p>
                        <p className='text-xl text-[#393e41]'> Balance = {balance} SepoliaETH</p>
                    </div>
                )
            }
        </div>

    )
}

export default Header