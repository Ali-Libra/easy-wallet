import { ethers } from 'ethers';

const address = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
// const normalized = address.normalize('NFKC').trim();

console.log("result:", ethers.getAddress(address)); // For ethers v6
// or
// console.log("result:", ethers.utils.getAddress(address)); // For ethers v5
