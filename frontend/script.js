// ==================== CONTRACT CONFIGURATION ====================
const CONTRACT_ADDRESS = "0x95A3486f959D8CCa962B9eDD89df2D0c3D363232"; // Deployed address

const CONTRACT_ABI = [
    // ERC-20 Functions
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    // Custom dApp Functions
    "function submitMoodAssessment(uint256 moodScore, uint256 stressLevel, uint256 energyLevel) returns (uint256)",
    "function getUserStats(address user) view returns (uint256 balance, uint256 currentMood, uint256 streak, uint256 checkIns, uint256 lifetimeEarned)"
];

// ==================== GLOBAL VARIABLES ====================
let provider, signer, contract, userAddress;
let selectedMood = null;
let currentGender = 'male';
let currentQuiz = null;

// ==================== MOOD EXPRESSIONS ====================
// Note: You will need corresponding images in your 'pictures/' folder for these scores.
const MOOD_EXPRESSIONS = {
    male: {
        10: 'male-sad.png',        // Sad
        25: 'male-worried.png',    // Worried
        40: 'male-disgust.png',    // Disgust
        55: 'male-angry.png',      // Angry
        70: 'male-neutral.png',    // Neutral
        85: 'male-happy.png',      // Happy
        95: 'male-excited.png'     // Excited
    },
    female: {
        10: 'female-sad.png',
        25: 'female-worried.png',
        40: 'female-disgust.png',
        55: 'female-angry.png',
        70: 'female-neutral.png',
        85: 'female-happy.png',
        95: 'female-excited.png'
    }
};

const MOOD_OPTIONS = [
    { score: 10, label: 'Very Sad' }, // Using Very Sad for the lowest score
    { score: 25, label: 'Worried' },
    { score: 40, label: 'Disgust' },
    { score: 55, label: 'Angry' },
    { score: 70, label: 'Neutral' },
    { score: 85, label: 'Happy' },
    { score: 95, label: 'Joyful' } // Using Joyful for the highest score
];

// ==================== QUIZ DATABASE ====================
const quizDatabase = [
    { question: "Which neurotransmitter is primarily associated with pleasure and reward?", options: ["Dopamine", "Cortisol", "Melatonin", "Insulin"], correct: 0 },
    { question: "How many hours of sleep do adults typically need per night?", options: ["4-5 hours", "6-7 hours", "7-9 hours", "10-12 hours"], correct: 2 },
    { question: "What is the body's primary stress hormone?", options: ["Insulin", "Cortisol", "Dopamine", "Serotonin"], correct: 1 },
    { question: "Which part of the brain is responsible for emotional regulation?", options: ["Cerebellum", "Amygdala", "Medulla", "Corpus Callosum"], correct: 1 },
    { question: "What percentage of the human brain is water?", options: ["50%", "60%", "73%", "90%"], correct: 2 },
    { question: "Which activity has been scientifically proven to reduce anxiety?", options: ["Deep breathing", "Excessive caffeine", "Sleep deprivation", "Prolonged stress"], correct: 0 },
    { question: "What is neuroplasticity?", options: ["Brain's ability to form new neural connections", "A type of brain surgery", "A mental disorder", "A medication type"], correct: 0 },
    { question: "How long does it typically take to form a new habit?", options: ["7 days", "21 days", "66 days", "365 days"], correct: 2 }
];

// ==================== INITIALIZATION ====================
window.addEventListener('load', () => {
    initParticles();
    setupEventListeners();
    renderMoodFaces();
    updateAvatar();
});

// ==================== PARTICLES.JS ====================
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: ["#00FFA3", "#00F0FF", "#B744FF"] },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
            size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1 } },
            line_linked: { enable: true, distance: 150, color: "#00FFA3", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
            modes: { grab: { distance: 140, line_linked: { opacity: 0.8 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    document.getElementById('connectBtn').addEventListener('click', connectWallet);

    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            setActiveGender(e.target.closest('.gender-btn').dataset.gender);
        });
    });

    document.getElementById('stressLevel').addEventListener('input', e => {
        document.getElementById('stressValue').textContent = e.target.value;
    });

    document.getElementById('energyLevel').addEventListener('input', e => {
        document.getElementById('energyValue').textContent = e.target.value;
    });

    document.getElementById('submitAssessment').addEventListener('click', submitAssessment);
    document.getElementById('startQuiz').addEventListener('click', startQuiz);
    document.getElementById('transferBtn').addEventListener('click', transferTokens);
}

function setActiveGender(gender) {
    currentGender = gender;
    document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.gender-btn[data-gender="${gender}"]`).classList.add('active');
    renderMoodFaces();
    updateAvatar();
}

// ==================== MOOD FACES ====================
function renderMoodFaces() {
    const container = document.getElementById('moodFacesGrid');
    container.innerHTML = '';

    MOOD_OPTIONS.forEach(mood => {
        const btn = document.createElement('button');
        btn.className = 'mood-face-btn';
        btn.dataset.score = mood.score;

        const img = document.createElement('img');
        img.src = `pictures/${MOOD_EXPRESSIONS[currentGender][mood.score]}`;
        img.alt = mood.label;
        img.onerror = function() {
            this.style.display = 'none';
            btn.innerHTML = `<div style="font-size: 2em;">${getMoodEmoji(mood.score)}</div>`;
        };

        btn.appendChild(img);
        btn.addEventListener('click', () => selectMood(mood.score, btn));
        container.appendChild(btn);
    });
}

function getMoodEmoji(score) {
    if (score >= 90) return '🤩'; // Joyful / Very Happy
    if (score >= 75) return '😄'; // Happy
    if (score >= 60) return '🙂'; // Neutral
    if (score >= 45) return '😡'; // Angry
    if (score >= 30) return '🤢'; // Disgust
    if (score >= 15) return '😟'; // Worried
    return '😢'; // Very Sad
}

function selectMood(score, btn) {
    document.querySelectorAll('.mood-face-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedMood = score;
    updateAvatar(score);
}

// ==================== AVATAR ====================
function updateAvatar(wellnessScore = 70) { // Neutral is now 70
    const avatarImg = document.getElementById('avatarImage');

    let closestScore = 70; // Default to neutral
    let minDiff = 100; // Initialize high difference

    // Iterate over the keys (scores) in the MOOD_EXPRESSIONS for the current gender
    Object.keys(MOOD_EXPRESSIONS[currentGender]).forEach(scoreStr => {
        const score = parseInt(scoreStr);
        const diff = Math.abs(wellnessScore - score);
        
        // If the current score is closer, update closestScore
        if (diff < minDiff) {
            minDiff = diff;
            closestScore = score;
        }
    });

    avatarImg.src = `pictures/${MOOD_EXPRESSIONS[currentGender][closestScore]}`;
    avatarImg.onerror = () => avatarImg.src = `pictures/${currentGender}-neutral.png`; // Fallback to neutral image (70)

    updateMoodDisplay(wellnessScore);
}

function updateMoodDisplay(score) {
    const status = document.getElementById('moodStatus');
    const barFill = document.getElementById('moodBarFill');
    const percentage = document.getElementById('moodPercentage');

    barFill.style.width = score + '%';
    percentage.textContent = score + '%';

    if (score >= 90) { status.textContent = 'PEAK PERFORMANCE'; status.style.color = '#00FFA3'; }
    else if (score >= 75) { status.textContent = 'OPTIMAL STATE'; status.style.color = '#00F0FF'; }
    else if (score >= 60) { status.textContent = 'GOOD STATE'; status.style.color = '#00F0FF'; }
    else if (score >= 45) { status.textContent = 'NEUTRAL STATE'; status.style.color = '#FFD700'; }
    else { status.textContent = 'NEEDS INTERVENTION'; status.style.color = '#FF44EC'; }
}

// ==================== WALLET CONNECTION ====================
async function connectWallet() {
    try {
        if (!window.ethereum) { alert('⚠️ Install MetaMask!'); window.open('https://metamask.io/download/', '_blank'); return; }

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        displayWalletInfo();
        await loadUserData();

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', () => window.location.reload());

    } catch (error) { console.error('Connection error:', error); alert('❌ ' + error.message); }
}

function displayWalletInfo() {
    document.getElementById('walletAddress').textContent = `${userAddress.slice(0,6)}...${userAddress.slice(-4)}`;
    document.getElementById('walletStatus').classList.remove('hidden');
    document.getElementById('mainDashboard').classList.remove('hidden');
    const btn = document.getElementById('connectBtn');
    btn.textContent = 'CONNECTED'; btn.disabled = true;
}

async function handleAccountsChanged(accounts) {
    if (!accounts.length) window.location.reload();
    else { userAddress = accounts[0]; await loadUserData(); }
}

// ==================== USER DATA ====================
async function loadUserData() {
    try {
        // The contract returns: balance, currentMood, streak, checkIns, lifetimeEarned
        const stats = await contract.getUserStats(userAddress);

        // Convert balance and lifetimeEarned (which are in Wei/smallest unit) to Ether/Token unit
        const tokenBalance = parseFloat(ethers.utils.formatEther(stats.balance)).toFixed(2);
        const lifetimeEarned = parseFloat(ethers.utils.formatEther(stats.lifetimeEarned)).toFixed(0);

        // Display data
        document.getElementById('tokenBalance').textContent = tokenBalance;
        document.getElementById('wellnessScore').textContent = stats.currentMood.toString();
        document.getElementById('streakDays').textContent = stats.streak.toString();
        document.getElementById('totalCheckins').textContent = stats.checkIns.toString();
        document.getElementById('lifetimeEarned').textContent = lifetimeEarned;

        // Update the avatar display with the latest wellness score
        updateAvatar(stats.currentMood.toNumber());
    } catch (error) { console.error('Error loading user data:', error); }
}

// ==================== ASSESSMENT ====================
async function submitAssessment() {
    if (selectedMood === null) return alert('💭 Select your mood first!');
    if (!contract) return alert('❌ Connect your wallet first.');

    const stressLevel = parseInt(document.getElementById('stressLevel').value);
    const energyLevel = parseInt(document.getElementById('energyLevel').value);
    const resultDiv = document.getElementById('assessmentResult');
    showStatus(resultDiv, '🔄 Processing...', '#00FFA3');

    try {
        // Send the transaction to the smart contract
        const tx = await contract.submitMoodAssessment(selectedMood, stressLevel, energyLevel);
        resultDiv.textContent = '⏳ Awaiting blockchain confirmation...';
        
        const receipt = await tx.wait();

        // Calculate the wellness score locally for instant feedback (though the contract does this)
        const wellnessScore = Math.round((selectedMood + energyLevel + (100 - stressLevel)) / 3);
        
        // Find the emitted tokensEarned from the MoodAssessment event for a more accurate message
        let tokensEarned = 0;
        
        // Check if the transaction receipt contains the 'MoodAssessment' event
        for (const log of receipt.logs) {
            try {
                // Parse log to get the event data
                const parsedLog = contract.interface.parseLog(log);
                if (parsedLog && parsedLog.name === 'MoodAssessment') {
                    // tokensEarned is the fifth argument (index 4) in the event definition
                    tokensEarned = parseFloat(ethers.utils.formatEther(parsedLog.args.tokensEarned)).toFixed(2);
                    break;
                }
            } catch (e) {
                // Ignore logs that don't match the contract's ABI
            }
        }
        
        showStatus(resultDiv, `✨ Assessment Complete! Wellness Score: ${wellnessScore}/100. Earned ${tokensEarned} NEURO.`, '#00FFA3', true);

        await loadUserData();
        setTimeout(resetAssessmentForm, 6000); // Increased delay for better readability

    } catch (error) {
        // Handle common contract errors for a better user experience
        let errorMessage = error.reason || error.message;
        if (errorMessage.includes("Already checked in today")) {
            errorMessage = "Daily check-in already done. Try again tomorrow!";
        }
        
        showStatus(resultDiv, '❌ ' + errorMessage, '#FF44EC', true);
        console.error('Assessment error:', error);
    }
}

function resetAssessmentForm() {
    selectedMood = null;
    document.querySelectorAll('.mood-face-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('stressLevel').value = 50;
    document.getElementById('energyLevel').value = 50;
    document.getElementById('stressValue').textContent = '50';
    document.getElementById('energyValue').textContent = '50';
    document.getElementById('assessmentResult').textContent = '';
    updateAvatar(70); // Reset to neutral 70
}

// ==================== QUIZ ====================
function startQuiz() {
    currentQuiz = quizDatabase[Math.floor(Math.random() * quizDatabase.length)];
    document.getElementById('quizQuestion').textContent = currentQuiz.question;

    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    currentQuiz.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => checkAnswer(i));
        optionsContainer.appendChild(btn);
    });

    document.getElementById('startQuiz').style.display = 'none';
    document.getElementById('quizResult').textContent = '';
}

function checkAnswer(selectedIndex) {
    const resultDiv = document.getElementById('quizResult');
    if (selectedIndex === currentQuiz.correct) showStatus(resultDiv, '✨ Correct! Excellent performance!', '#00FFA3', true);
    else showStatus(resultDiv, `💭 Incorrect. Answer: ${currentQuiz.options[currentQuiz.correct]}`, '#00F0FF', true);

    setTimeout(() => {
        document.getElementById('startQuiz').style.display = 'block';
        document.getElementById('quizOptions').innerHTML = '';
        document.getElementById('quizQuestion').textContent = 'Ready to test your cognitive abilities? Engage neural interface...';
        resultDiv.textContent = '';
    }, 4000);
}

// ==================== TOKEN TRANSFER ====================
async function transferTokens() {
    const recipient = document.getElementById('transferAddress').value.trim();
    const amount = document.getElementById('transferAmount').value;

    if (!recipient || !amount) return alert('💭 Enter both address and amount!');
    if (!ethers.utils.isAddress(recipient)) return alert('❌ Invalid Ethereum address!');
    if (parseFloat(amount) <= 0) return alert('❌ Amount must be greater than 0!');
    if (!contract) return alert('❌ Connect your wallet first.');


    // Convert human-readable amount to Wei (or smallest unit, 18 decimals)
    const amountInWei = ethers.utils.parseEther(amount);
    const resultDiv = document.getElementById('transferResult');
    showStatus(resultDiv, '🔄 Initiating transfer...', '#00FFA3');

    try {
        // Call the ERC-20 transfer function on the smart contract
        const tx = await contract.transfer(recipient, amountInWei);
        resultDiv.textContent = '⏳ Transaction submitted! Confirming...';
        await tx.wait();

        showStatus(resultDiv, `✨ Transfer Complete! Sent ${amount} NEURO tokens`, '#00FFA3', true);
        document.getElementById('transferAddress').value = '';
        document.getElementById('transferAmount').value = '';
        await loadUserData();

        setTimeout(() => resultDiv.textContent = '', 5000);

    } catch (error) {
        // Handle transfer errors like 'Insufficient balance'
        let errorMessage = error.reason || error.message;
        if (errorMessage.includes("Insufficient balance")) {
            errorMessage = "Insufficient NEURO balance to complete transfer.";
        }
        
        showStatus(resultDiv, '❌ ' + errorMessage, '#FF44EC', true);
        console.error('Transfer error:', error);
    }
}

// ==================== HELPERS ====================
function showStatus(element, text, color, highlight = false) {
    element.textContent = text;
    element.style.color = color;
    element.style.borderColor = color;
    element.style.background = highlight ? color + '33' : color + '11';
}