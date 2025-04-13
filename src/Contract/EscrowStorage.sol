// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

//import "contracts/Escrow.sol";

error EscrowFactory__AlreadyApproved(address escrow);
error EscrowFactory__AlreadyReturned(address escrow);
error EscrowFactory__NotArbiterOrBeneficiaryOfContract(address caller);
error EscrowFactory_NotArbiterOrDepositorOfContract(address caller);

contract Escrow {

    address public arbiter;
    address public beneficiary;
    address public depositor;
    uint private amount;
    bool public isApproved;
    bool public isReturned;

    event Approved(uint);
    event Returned(uint);

    constructor(address _depositor, address _beneficiary, address _arbiter)payable{
        depositor=_depositor;
        beneficiary=_beneficiary;
        arbiter=_arbiter;
        amount=msg.value;                             
                                                       
    }

    function approve () external{
        uint _amount = address(this).balance;
        (bool sent, )= payable(beneficiary).call{value: _amount}("");
        require(sent, "Failed to send Ether");
        emit Approved(amount);
        isApproved=true;
    }

    function getAmount() external view returns(uint){
        return amount;
    }

    function ReturnPayment () external {
         uint _amount = address(this).balance;
         (bool sent, )= payable(depositor).call{value: _amount}("");
         require(sent, "Failed to send Ether");
         emit Returned(amount);
         isReturned=true;
    }
} 

contract EscrowStorage {

    Escrow public escrow;

    fallback() external payable {}
    receive() external payable {}

    function createNewEscrowContract(
        address _beneficiary,
        address _arbiter
    ) external payable {
        // if (address(escrow) != address(0)) { 
        //     require( escrow.isApproved() || escrow.isReturned(), "EscrowStorage: Previous escrow must be completed" ); 
        //     }
        
         escrow = (new Escrow){value: msg.value}(            
            msg.sender,                                            
            _beneficiary,                                          
            _arbiter                                               
        );
        
    }


    function approve () external {

        

        if(msg.sender!=escrow.depositor()&&msg.sender!=escrow.arbiter()){
            revert EscrowFactory_NotArbiterOrDepositorOfContract(msg.sender);
        }
         if (escrow.isApproved()) {
            revert EscrowFactory__AlreadyApproved(address(escrow));
        }
        if(escrow.isReturned()){
            revert EscrowFactory__AlreadyReturned(address(escrow));
        }
        escrow.approve();
    }

    function ReturnPayment () external {
        
        if(msg.sender!=escrow.beneficiary()&&msg.sender!=escrow.arbiter()){
            revert EscrowFactory__NotArbiterOrBeneficiaryOfContract(msg.sender);
        }
        if (escrow.isApproved()) {
            revert EscrowFactory__AlreadyApproved(address(escrow));
        }
        if(escrow.isReturned()){
            revert EscrowFactory__AlreadyReturned(address(escrow));
        }
        escrow.ReturnPayment();
    }

    function getEscrowContracts() external view returns (Escrow) {
        return escrow;
    }

    
    
}