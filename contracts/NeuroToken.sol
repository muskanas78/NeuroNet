// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title NeuroToken - ERC-20 with Neural Wellness Protocol Logic
 * @dev A custom ERC-20 token integrated with a mood assessment system.
 * The token's functionality includes standard ERC-20 transfers and a
 * custom function for submitting mood data, which rewards tokens.
 */
contract NeuroToken {
    // -------------------------------
    // 🔹 Token Basic Info & State Variables
    // -------------------------------
    string public constant name = "NeuroToken";
    string public constant symbol = "NEURO";
    uint8 public constant decimals = 18;
    uint public totalSupply;
    uint public constant DAILY_REWARD = 5 * 10**uint(decimals); // 5 NEURO tokens per check-in

    // Contract deployer is the owner (admin)
    address public immutable owner;

    // -------------------------------
    // 🧠 User Stats & Mood Assessment
    // -------------------------------

    // Struct to store a user's on-chain profile data
    struct UserStats {
        uint balance;         // Current token balance (used for ERC-20 balanceOf)
        uint currentMood;     // Last reported wellness score (0-100)
        uint streak;          // Consecutive daily check-ins
        uint lastCheckInDay;  // Timestamp for last check-in (used for streak/daily logic)
        uint checkIns;        // Total lifetime check-ins
        uint lifetimeEarned;  // Total tokens earned from check-ins
    }

    // Mapping: Address => User Stats
    mapping(address => UserStats) private userProfiles;

    // -------------------------------
    // 🔹 Mappings (Standard ERC-20)
    // -------------------------------

    // Track approvals (who can spend on behalf of whom) - ERC-20 required but not used in frontend
    mapping(address => mapping(address => uint)) public allowance;

    // -------------------------------
    // 🔹 Events (Standard ERC-20 & Custom)
    // -------------------------------
    event Transfer(address indexed from, address indexed to, uint value);
    event MoodAssessment(address indexed user, uint moodScore, uint stressLevel, uint energyLevel, uint tokensEarned);

    // -------------------------------
    // 🔹 Constructor & Initialization
    // -------------------------------

    constructor(uint _initialSupply) {
        owner = msg.sender;
        // Initial supply will be 0, as tokens are primarily earned via check-ins.
        // But we'll mint a small initial supply to the owner for testing/distribution.
        uint initialSupplyWei = _initialSupply * (10**uint(decimals));
        totalSupply = initialSupplyWei;
        userProfiles[msg.sender].balance = initialSupplyWei;
        emit Transfer(address(0), msg.sender, initialSupplyWei);
    }
    
    // -------------------------------
    // 🔹 ERC-20 Required View Functions
    // -------------------------------

    // Implements ERC-20 balanceOf
    function balanceOf(address account) public view returns (uint) {
        return userProfiles[account].balance;
    }

    // Implements ERC-20 transfer (used by frontend)
    function transfer(address _to, uint _value) public returns (bool success) {
        require(userProfiles[msg.sender].balance >= _value, "NEURO: Insufficient balance");

        // Deduct from sender's balance and add to receiver's balance
        userProfiles[msg.sender].balance -= _value;
        userProfiles[_to].balance += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    // -------------------------------
    // 🧠 Core dApp Functionality
    // -------------------------------

    // Custom function to submit mood assessment and earn tokens
    function submitMoodAssessment(uint moodScore, uint stressLevel, uint energyLevel)
        public
        returns (uint tokensEarned)
    {
        UserStats storage stats = userProfiles[msg.sender];
        uint day = block.timestamp / 1 days;

        // 1. Check if user already checked in today
        require(stats.lastCheckInDay != day, "NEURO: Already checked in today");
        
        // 2. Calculate Token Reward (Efficiently using ternary operator for gas)
        tokensEarned = (stats.streak > 0) ? (DAILY_REWARD + (stats.streak * (10**uint(decimals)) / 10)) : DAILY_REWARD;
        
        // 3. Update State
        stats.balance += tokensEarned;
        stats.lifetimeEarned += tokensEarned;
        stats.lastCheckInDay = day;
        stats.currentMood = (moodScore + energyLevel + (100 - stressLevel)) / 3; // Calculate wellness score
        
        // 4. Update Streak (Efficiently using block.timestamp logic)
        uint yesterday = day - 1;
        stats.streak = (stats.lastCheckInDay == yesterday) ? (stats.streak + 1) : 1;
        
        // 5. Update Total Check-ins
        stats.checkIns += 1;
        
        // 6. Update Total Supply
        totalSupply += tokensEarned; // Tokens are minted upon successful check-in

        emit MoodAssessment(msg.sender, moodScore, stressLevel, energyLevel, tokensEarned);
        emit Transfer(address(0), msg.sender, tokensEarned);
        
        return tokensEarned;
    }

    // Custom function to get all user stats (used by frontend)
    function getUserStats(address user)
        public
        view
        returns (
            uint balance,
            uint currentMood,
            uint streak,
            uint checkIns,
            uint lifetimeEarned
        )
    {
        UserStats memory stats = userProfiles[user];

        // Recalculate streak here to reflect real-time status without transaction
        uint currentDay = block.timestamp / 1 days;
        uint displayStreak = stats.streak;
        
        if (stats.lastCheckInDay != currentDay && stats.lastCheckInDay != currentDay - 1) {
            // If not checked in today OR yesterday, streak is broken
            displayStreak = 0;
        }

        return (
            stats.balance,
            stats.currentMood,
            displayStreak,
            stats.checkIns,
            stats.lifetimeEarned
        );
    }
    
    // -------------------------------
    // ⚠️ ERC-20 Standard Functions
    // -------------------------------
    function allowance(address _owner, address spender) public view returns (uint) {
        return allowance[_owner][spender];
    }
    function approve(address spender, uint amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }
    function transferFrom(address _from, address _to, uint _value) public returns (bool success) {
        revert("Transfers via approval are not supported in this version.");
    }
}