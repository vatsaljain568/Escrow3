import React from 'react'
import { ethers } from 'ethers';

function formatValue(value) {
    if (!value) return 'Not available';
    if (ethers.BigNumber.isBigNumber(value)) return ethers.utils.formatEther(value);
    if (typeof value === 'object' && value.toString) return value.toString();
    return value;
}

function Cards({ account, SendTo, Arbiter, Amount, escrowCreated, handleApprove, handleRefund, Condition, error, escrowAddress, status }) {

    return (
        <>
            {
                escrowCreated ? (
                    <div className='flex flex-col gap-10 items-start justify-center  bg-white rounded-2xl shadow-xl w-200 m-4 p-6' >
                        <p className='text-[#e94f37] text-bold'>Contract Address : {escrowAddress}</p>
                        <p className='text-[#e94f37] text-bold'>Depositer Address = {account}</p>
                        <p className='text-[#e94f37] text-bold'>Beneficiary Address = {SendTo}</p>
                        <p className='text-[#e94f37] text-bold'>Arbiter Address = {Arbiter}</p>
                        <p className='text-[#e94f37] text-bold'>Condition = {Condition}</p>
                        {/* <p className='text-[#e94f37] text-bold'>
                            Amount = {ethers.BigNumber.isBigNumber(Amount)
                                ? ethers.utils.formatEther(Amount)
                                : Amount?.toString?.()}{" "}
                            SepoliaETH
                        </p> */}

                        <p className='text-[#e94f37] font-bold'>
                            Amount: {formatValue(Amount)} SepoliaETH
                        </p>


                        <div className='m-auto flex gap-4 justify-around items-center'>
                            <button onClick={handleApprove} className='bg-[#393e41] text-[#e94f37] m-auto p-3 rounded cursor-pointer'>Approve</button>
                            <button onClick={handleRefund} className='bg-[#393e41] text-[#e94f37] m-auto p-3 rounded cursor-pointer'>Refund</button>
                        </div>
                        {status && <p className="text-sm mt-2">{status}</p>}
                        {error && <div style={{ color: 'red' }}>{error}</div>}

                    </div>
                ) : (
                    <div className='flex flex-col gap-10 items-start justify-center  bg-white rounded-2xl shadow-xl w-200 m-4 p-6' >
                        <p className='text-[#393e41] text-bold'>No Escrow Created</p>
                    </div>
                )
            }
        </>
    )
}

export default Cards;