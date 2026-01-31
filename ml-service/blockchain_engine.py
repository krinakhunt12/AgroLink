import hashlib
import json
from time import time
import os

class AgricultureBlockchain:
    """
    A lightweight, private permissioned blockchain ledger for AgroLink.
    Ensures immutability of trade records for transparency and trust.
    """
    def __init__(self, storage_path='models/trade_ledger.json'):
        self.storage_path = storage_path
        self.contract_storage = storage_path.replace('.json', '_contracts.json')
        self.chain = []
        self.pending_transactions = []
        self.contracts = {} # Smart Contract Escrow state
        
        # Load existing chain or create Genesis Block
        if os.path.exists(self.storage_path):
            self._load_chain()
        else:
            self.create_block(previous_hash='0', proof=100)
            
        # Load existing contracts
        if os.path.exists(self.contract_storage):
            with open(self.contract_storage, 'r') as f:
                self.contracts = json.load(f)

    def _load_chain(self):
        try:
            with open(self.storage_path, 'r') as f:
                self.chain = json.load(f)
        except:
            self.create_block(previous_hash='0', proof=100)

    def _save_chain(self):
        with open(self.storage_path, 'w') as f:
            json.dump(self.chain, f, indent=4)
        with open(self.contract_storage, 'w') as f:
            json.dump(self.contracts, f, indent=4)

    # --- SMART CONTRACT (ESCROW) LOGIC ---
    
    def initiate_smart_contract(self, farmer_id, buyer_id, crop, quantity, price):
        """
        Creates a new Smart Contract in LOCK state (Payment simulation).
        """
        contract_id = f"SC-{int(time())}-{farmer_id[:4]}"
        self.contracts[contract_id] = {
            'id': contract_id,
            'farmer_id': farmer_id,
            'buyer_id': buyer_id,
            'crop': crop,
            'quantity': f"{quantity} Quintals",
            'price': float(price),
            'status': 'PAYMENT_LOCKED',
            'created_at': time(),
            'delivered_at': None,
            'released_at': None
        }
        self._save_chain()
        # Log to blockchain as an event
        self.add_transaction(farmer_id, buyer_id, crop, quantity, price)
        return self.contracts[contract_id]

    def mark_as_dispatched(self, contract_id):
        """
        Farmer marks as dispatched -> Transitions from LOCKED to DISPATCHED.
        """
        if contract_id not in self.contracts:
            return None, "Contract Not Found"
            
        contract = self.contracts[contract_id]
        if contract['status'] != 'PAYMENT_LOCKED':
            return None, f"Cannot dispatch. Current Status: {contract['status']}"

        contract['status'] = 'DISPATCHED'
        self._save_chain()
        
        # Log event
        self.add_transaction(contract['farmer_id'], contract['buyer_id'], f"DISPATCHED: {contract['crop']}", 0, 0)
        return contract, None

    def confirm_delivery(self, contract_id):
        """
        Buyer confirms delivery -> Reverses Escrow LOCK and RELEASES payment.
        Must be in DISPATCHED state.
        """
        if contract_id not in self.contracts:
            return None, "Contract Not Found"
            
        contract = self.contracts[contract_id]
        if contract['status'] != 'DISPATCHED':
            return None, f"Cannot release payment. Delivery must be DISPATCHED first. Current Status: {contract['status']}"

        # Automate Release Logic
        contract['status'] = 'PAYMENT_RELEASED'
        contract['delivered_at'] = time()
        contract['released_at'] = time()
        
        self._save_chain()
        
        # Log the release event as a new transaction on the chain
        self.add_transaction(
            contract['farmer_id'], 
            contract['buyer_id'], 
            f"RELEASED: {contract['crop']}", 
            0, 
            contract['price']
        )
        return contract, None

    def get_contract(self, contract_id):
        return self.contracts.get(contract_id)

    # --- BLOCKCHAIN CORE ---

    def create_block(self, proof, previous_hash):
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'transactions': self.pending_transactions,
            'proof': proof,
            'previous_hash': previous_hash or self.hash(self.chain[-1]),
        }
        self.pending_transactions = []
        self.chain.append(block)
        self._save_chain()
        return block

    def add_transaction(self, farmer_id, buyer_id, crop, quantity, price, order_id=None):
        """
        Creates a new trade record to go into the next mined Block.
        """
        transaction = {
            'farmer_id': farmer_id,
            'buyer_id': buyer_id,
            'crop': crop,
            'quantity': f"{quantity} Quintals",
            'price': f"Rs.{price}",
            'order_id': order_id,
            'timestamp': time()
        }
        self.pending_transactions.append(transaction)
        return self.last_block['index'] + 1

    def seal_transaction_integrity(self, farmer_id, buyer_id, crop, quantity, price, order_id):
        """
        Core Security Module: Generates an immutable integrity hash for a trade.
        """
        # 1. Create the canonical data string for hashing
        transaction_payload = {
            'farmer_id': str(farmer_id),
            'buyer_id': str(buyer_id),
            'crop': str(crop),
            'quantity': float(quantity),
            'price': float(price),
            'order_id': str(order_id)
        }
        
        # Sort keys for consistency
        data_string = json.dumps(transaction_payload, sort_keys=True)
        integrity_hash = hashlib.sha256(data_string.encode()).hexdigest()
        
        # 2. Add as a blockchain event
        self.add_transaction(farmer_id, buyer_id, f"INTEGRITY_SEAL: {crop}", quantity, price, order_id)
        
        # 3. Trigger mining for immediate immutability (in this simplified local chain)
        last_block = self.last_block
        proof = self.proof_of_work(last_block['proof'])
        prev_hash = self.hash(last_block)
        self.create_block(proof, prev_hash)
        
        return integrity_hash

    def verify_transaction_integrity(self, farmer_id, buyer_id, crop, quantity, price, order_id, stored_hash):
        """
        Tamper Detection Logic: Recomputes the hash and verifies against the ledger.
        """
        # 1. Recompute the hash from current database values
        payload = {
            'farmer_id': str(farmer_id),
            'buyer_id': str(buyer_id),
            'crop': str(crop),
            'quantity': float(quantity),
            'price': float(price),
            'order_id': str(order_id)
        }
        current_hash = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()
        
        # 2. Check match
        is_authentic = (current_hash == stored_hash)
        
        return {
            'is_authentic': is_authentic,
            'recomputed_hash': current_hash,
            'stored_hash': stored_hash,
            'tampered_detected': not is_authentic
        }

    @property
    def last_block(self):
        return self.chain[-1]

    def hash(self, block):
        """
        Creates a SHA-256 hash of a Block.
        """
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def proof_of_work(self, last_proof):
        """
        Simple Proof of Work Algorithm:
         - Find a number p' such that hash(pp') contains leading 4 zeroes
        """
        proof = 0
        while self.valid_proof(last_proof, proof) is False:
            proof += 1
        return proof

    @staticmethod
    def valid_proof(last_proof, proof):
        guess = f'{last_proof}{proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"

    def verify_chain(self):
        """
        Check if the blockchain is valid.
        """
        last_block = self.chain[0]
        current_index = 1

        while current_index < len(self.chain):
            block = self.chain[current_index]
            # Check hash of the block
            if block['previous_hash'] != self.hash(last_block):
                return False

            # Check Proof of Work
            if not self.valid_proof(last_block['proof'], block['proof']):
                return False

            last_block = block
            current_index += 1

        return True

    def get_transaction_by_hash(self, tx_hash):
        """
        In this lightweight version, we verify blocks by their hash index.
        """
        for block in self.chain:
            if self.hash(block) == tx_hash:
                return block
        return None

# Simple Test
if __name__ == '__main__':
    blockchain = AgricultureBlockchain()
    print("Blockchain initialized.")
    
    # 1. Add a transaction
    blockchain.add_transaction("FARMER_001", "BUYER_999", "Onion", 50, 2400)
    
    # 2. Mine the block
    last_block = blockchain.last_block
    last_proof = last_block['proof']
    proof = blockchain.proof_of_work(last_proof)
    previous_hash = blockchain.hash(last_block)
    block = blockchain.create_block(proof, previous_hash)
    
    print(f"Block Mined! Hash: {blockchain.hash(block)}")
    print(f"Chain Validity: {blockchain.verify_chain()}")
