"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ethers } from 'ethers';
import  { Suspense } from 'react';
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { AutoConnect } from "thirdweb/react";

import { useActiveAccount } from "thirdweb/react";

import { shortenAddress } from "thirdweb/utils";
import { Button } from "@headlessui/react";
import { client, wallet } from "@/app/constant";

import Link from "next/link";
import { BarChart3, Home, Menu } from 'lucide-react'
interface GameSelectionUIProps {
  isLoading: boolean;
  selectedGame: string;
  onGameSelect: (game: string) => void;


}

declare global {
  interface Window {
    ethereum?: any;  // Or use the more specific type from the artifact
  }
}
const gamePreviewData = [
  { id: 1, src: "/images/image DISPALY.png", alt: "Game Preview 1" },
  { id: 2, src: "/images/TrailblazerIMG.png", alt: "Game Preview 2" },
  { id: 3, src: "/images/image DISPALY.png", alt: "Game Preview 3" },
]


const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "startTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxClaimableSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "supplyClaimed",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "quantityLimitPerWallet",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "merkleRoot",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "pricePerToken",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
          {
            internalType: "string",
            name: "metadata",
            type: "string",
          },
        ],
        indexed: false,
        internalType:
          "struct IClaimCondition.ClaimCondition[]",
        name: "claimConditions",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "resetEligibility",
        type: "bool",
      },
    ],
    name: "ClaimConditionsUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "prevURI",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "newURI",
        type: "string",
      },
    ],
    name: "ContractURIUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "delegator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "fromDelegate",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "toDelegate",
        type: "address",
      },
    ],
    name: "DelegateChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "delegate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "previousBalance",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newBalance",
        type: "uint256",
      },
    ],
    name: "DelegateVotesChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "platformFeeRecipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "flatFee",
        type: "uint256",
      },
    ],
    name: "FlatPlatformFeeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "maxTotalSupply",
        type: "uint256",
      },
    ],
    name: "MaxTotalSupplyUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "platformFeeRecipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "platformFeeBps",
        type: "uint256",
      },
    ],
    name: "PlatformFeeInfoUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum IPlatformFee.PlatformFeeType",
        name: "feeType",
        type: "uint8",
      },
    ],
    name: "PlatformFeeTypeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "PrimarySaleRecipientUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "claimConditionIndex",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "claimer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "quantityClaimed",
        type: "uint256",
      },
    ],
    name: "TokensClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "pos",
        type: "uint32",
      },
    ],
    name: "checkpoints",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "fromBlock",
            type: "uint32",
          },
          {
            internalType: "uint224",
            name: "votes",
            type: "uint224",
          },
        ],
        internalType:
          "struct ERC20VotesUpgradeable.Checkpoint",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_currency",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_pricePerToken",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes32[]",
            name: "proof",
            type: "bytes32[]",
          },
          {
            internalType: "uint256",
            name: "quantityLimitPerWallet",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pricePerToken",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
        ],
        internalType: "struct IDrop.AllowlistProof",
        name: "_allowlistProof",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimCondition",
    outputs: [
      {
        internalType: "uint256",
        name: "currentStartId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "clock",
    outputs: [
      {
        internalType: "uint48",
        name: "",
        type: "uint48",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractType",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "contractURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractVersion",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "delegatee",
        type: "address",
      },
    ],
    name: "delegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "delegatee",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expiry",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "delegateBySig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "delegates",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "version",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getActiveClaimConditionId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_conditionId",
        type: "uint256",
      },
    ],
    name: "getClaimConditionById",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "startTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxClaimableSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "supplyClaimed",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "quantityLimitPerWallet",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "merkleRoot",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "pricePerToken",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
          {
            internalType: "string",
            name: "metadata",
            type: "string",
          },
        ],
        internalType:
          "struct IClaimCondition.ClaimCondition",
        name: "condition",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getFlatPlatformFeeInfo",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "timepoint",
        type: "uint256",
      },
    ],
    name: "getPastTotalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "timepoint",
        type: "uint256",
      },
    ],
    name: "getPastVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPlatformFeeInfo",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPlatformFeeType",
    outputs: [
      {
        internalType: "enum IPlatformFee.PlatformFeeType",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRoleMember",
    outputs: [
      {
        internalType: "address",
        name: "member",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleMemberCount",
    outputs: [
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_conditionId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_claimer",
        type: "address",
      },
    ],
    name: "getSupplyClaimedByWallet",
    outputs: [
      {
        internalType: "uint256",
        name: "supplyClaimedByWallet",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "getVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRoleWithSwitch",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_defaultAdmin",
        type: "address",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "string",
        name: "_contractURI",
        type: "string",
      },
      {
        internalType: "address[]",
        name: "_trustedForwarders",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_saleRecipient",
        type: "address",
      },
      {
        internalType: "address",
        name: "_platformFeeRecipient",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "_platformFeeBps",
        type: "uint128",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
    ],
    name: "isTrustedForwarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxTotalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]",
      },
    ],
    name: "multicall",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "numCheckpoints",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "primarySaleRecipient",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "startTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxClaimableSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "supplyClaimed",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "quantityLimitPerWallet",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "merkleRoot",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "pricePerToken",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
          {
            internalType: "string",
            name: "metadata",
            type: "string",
          },
        ],
        internalType:
          "struct IClaimCondition.ClaimCondition[]",
        name: "_conditions",
        type: "tuple[]",
      },
      {
        internalType: "bool",
        name: "_resetClaimEligibility",
        type: "bool",
      },
    ],
    name: "setClaimConditions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_uri",
        type: "string",
      },
    ],
    name: "setContractURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_platformFeeRecipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_flatFee",
        type: "uint256",
      },
    ],
    name: "setFlatPlatformFeeInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxTotalSupply",
        type: "uint256",
      },
    ],
    name: "setMaxTotalSupply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_platformFeeRecipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_platformFeeBps",
        type: "uint256",
      },
    ],
    name: "setPlatformFeeInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum IPlatformFee.PlatformFeeType",
        name: "_feeType",
        type: "uint8",
      },
    ],
    name: "setPlatformFeeType",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_saleRecipient",
        type: "address",
      },
    ],
    name: "setPrimarySaleRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_conditionId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_claimer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_currency",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_pricePerToken",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes32[]",
            name: "proof",
            type: "bytes32[]",
          },
          {
            internalType: "uint256",
            name: "quantityLimitPerWallet",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pricePerToken",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
        ],
        internalType: "struct IDrop.AllowlistProof",
        name: "_allowlistProof",
        type: "tuple",
      },
    ],
    name: "verifyClaim",
    outputs: [
      {
        internalType: "bool",
        name: "isOverride",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const contractAddress = '0x16C5ff9C18314dC977ABc8E12f7915Be541ca6F3';


const GameSelectionUI : React.FC<GameSelectionUIProps> = ({ isLoading, selectedGame, onGameSelect }) => {
  const account:any = useActiveAccount();
  const [activeButton, setActiveButton] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0)
  const [balance, setBalance] = useState<string>('0');

  const getBalance = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await provider.getSigner();
        const taikoContract = new ethers.Contract(contractAddress, contractABI, newSigner);
        const balance = await taikoContract.getBalance(account.address);
        setBalance(balance);
      } catch (error) {
        console.error("Error initializing ethers:", error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  // Get balance when account changes
  useEffect(() => {
    if (account) {
      getBalance();
    }
  }, [account]);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % gamePreviewData.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [])
  return (
    <div className="h-screen bg-black text-white bg-[url('/bg/BG.png')] bg-cover bg-center">
    <div className="mx-auto max-w-md bg-transparent p-6 pb-20">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mb-1 flex justify-center">
        </div>
        <div className="flex items-center justify-center gap-1">
          <div className="h-[1px] w-12 bg-pink-500/50" />
          <Image
            src="/logo/taiko-v-blk 1.png"
            alt="Taiko Logo"
            width={80}
            height={80}
            className="mb-1"
          />
          <div className="h-[1px] w-12 bg-pink-500/50" />
          <AutoConnect client={client} wallets={[wallet]}/>
 <div className="flex justify-center items-center h-full pr-2">
 {/* <Button className="inline-flex items-center gap-2 rounded-[4px] font-raj underline underline-offset-4 decoration-[#19AE00] decoration-4 decoration-solid bg-transparent border-2 border-white py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">0x181871415415418148</Button>   */}

          {account ? 
            (
            <> 
            <Button onClick={() => (window as any).Telegram.WebApp.openLink(`https://etherscan.io/address/${account.address}`)} className="inline-flex items-center gap-2 rounded-[4px] font-raj underline underline-offset-4 decoration-[#19AE00] decoration-4 decoration-solid bg-transparent border-2 border-white py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">{shortenAddress(account.address)}</Button>  
            </>
            ) 
          : (
              <p className="text-sm text-zinc-400">fetching smart account</p>
            )}      
<span>{balance} TKIO</span>
        </div>
    
        </div>
        <div className="text-sm font-semibold tracking-widest text-pink-500 mt-3">GAMES</div>
      </div>

      {/* Game Preview Card */}
      <div className="relative mb-4 overflow-hidden rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-transparent">
          <div className="aspect-[4/3] w-full bg-black">
            {gamePreviewData.map((preview, index) => (
              <Image
                key={preview.id}
                src={preview.src}
                alt={preview.alt}
                width={400}
                height={300}
                className={`absolute h-full w-full object-cover transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Dot Navigation */}
        <div className="mb-6 flex justify-center gap-1">
          {gamePreviewData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 w-1 rounded-full ${
                index === currentSlide ? 'bg-pink-500' : 'bg-pink-500/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      {/* Game List */}
      <div className="mb-6 space-y-3">
        <div className="text-sm font-light tracking-[0.5em]">LIST</div>
        
        {/* Atlas Game */}
        <div className="flex items-center justify-between rounded-xl border border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-transparent p-3">
          <div className="flex items-center gap-3">
            <Image
              src="/gameimg/atlas.png"
              alt="Atlas"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-medium  tracking-wide font-pop text-[14px]">ATLAS</span>
          </div>
          <button className="h-8 border-l border-pink-500/20 px-4 text-xs font-medium tracking-wider text-pink-500"
          onClick={() => onGameSelect("unity2")}
          disabled={isLoading}>
            PLAY
          </button>
        </div>

        {/* Trailblazer Game */}
        <div className="flex items-center justify-between rounded-xl border border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-transparent p-3">
          <div className="flex items-center gap-3">
            <Image
              src="/gameimg/trailblazer.png"
              alt="Trailblazer"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-medium tracking-wide font-pop text-[14px]">TRAILBLAZER</span>
          </div>
          <button className="h-8 border-l border-pink-500/20 px-4 text-xs font-medium tracking-wider text-pink-500"
          onClick={() => onGameSelect("unity3")}
          disabled={isLoading}>
            PLAY
          </button>
        </div>

 {/* Taiko Block Puzzle */}
 <div className="flex items-center justify-between rounded-xl border border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-transparent p-3">
          <div className="flex items-center gap-3">
            <Image
              src="/gameimg/TaikoBlockPuzzle.png"
              alt="TaikoBlockPuzzle"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-medium tracking-wide font-pop text-[14px]">Taiko Block Puzzle</span>
          </div>
          <button className="h-8 border-l border-pink-500/20 px-4 text-xs font-medium tracking-wider text-pink-500"
          onClick={() => onGameSelect("unity4")}
          disabled={isLoading}>
            PLAY
          </button>
        </div>
       
      </div>

      

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-around border-t-3 border-pink-500/20 bg-[#0C101B] px-6 py-5 backdrop-blur">
        <BarChart3 className="h-6 w-6 text-pink-500/50" />
        <Home className="h-6 w-6 text-pink-500" />
        <Menu className="h-6 w-6 text-pink-500/50" />
      </div>
    </div>
  </div>
  );
};

export default GameSelectionUI;




{/* <button onClick={() => onGameSelect("unity3")}
              disabled={isLoading}
               className='bg-[#FF0420] mt-2 w-[305px] text-center font-zk text-[30px] flex items-center justify-center font-bold rounded-[10px] text-white'>PLAY</button> */}

 {/* <div className="flex flex-col items-center justify-center h-full ">
      <div className="p-8 bg-transparent rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-center">Telegram Login Successful</h1>
        <p className="mb-6 text-center">Choose a game to continue:</p>
        <div className="space-y-4">
          <button 
            onClick={() => onGameSelect("unity")}
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading && selectedGame === "unity" ? "Redirecting..." : "Base Game"}
          </button>
          <button 
            onClick={() => onGameSelect("unity2")}
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading && selectedGame === "unity2" ? "Redirecting..." : "Continue to Unity Game 2"}
          </button>
        </div>
      </div>
    </div> */}
