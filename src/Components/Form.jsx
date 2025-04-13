import React from 'react'

export default function Form({ handleEscrow, SendTo, setSendTo, Arbiter, setArbiter, Amount, setAmount , Condition, setCondition , status , disabled , escrowCreated}) {
    return (
        <div className='flex flex-col items-center justify-center  bg-white rounded-2xl shadow-xl w-200 m-2 p-6'>
            <h1 className='text-3xl font-bold text-[#e94f37] ml-5'>Create New Escrow Contract</h1>

            <form className='flex flex-col m-5 p-8 gap-7 w-150' onSubmit={handleEscrow}>

                <input
                    className='outline text-2xl text-[#e94f37] rounded w-full p-3'
                    type="text"
                    value={SendTo}
                    onChange={(e) =>
                        {
                            if (!escrowCreated) setSendTo(e.target.value);
                        }}
                    required
                    placeholder='Beneficiary Address' />

                <input
                    className='outline text-2xl text-[#e94f37] rounded w-full p-3'
                    required
                    value={Arbiter}
                    onChange={(e) => {
                          if (!escrowCreated) setArbiter(e.target.value);
                    } }
                    type="text"
                    placeholder='Arbiter Address' />

                <input
                    className='outline text-2xl text-[#e94f37] rounded w-full p-3'
                    required
                    value={Amount}
                    onChange={(e) => {
                       if (!escrowCreated) setAmount(e.target.value);
                    }} 
                    type="text"
                    placeholder='Amount (ETH)' />

                <input
                    className='outline text-2xl text-[#e94f37] rounded w-full p-3'
                    required
                    value={Condition}
                    onChange={(e) => {
                       if (!escrowCreated) setCondition(e.target.value);
                    }}
                    type="text"
                    placeholder='Condition' />

                <button
                    type='submit'
                    disabled={disabled}
                    className='bg-[#e94f37] text-[#393e41] w-40 m-auto p-3 text-2xl rounded cursor-pointer disabled:cursor-not-allowed'>
                    Create
                </button>
                {status && <p className="text-sm mt-2">{status}</p>}
            </form>

        </div>
    )
}
