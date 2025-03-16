let heatTime = 2000; // 2 seconds
let heatAmount = 0;
let maxHeat = 10;
let firstTen = false; // Declare the new flag
let upSpeedreq = 10; // New variable for Job Speed requirement
let capacityreq = 10; // New variable for Capacity requirement
const collapsibleContainer = document.querySelector('.collapsible-container');
const collapsibleButton = document.querySelector('.collapsible');
const collapsibleContent = document.querySelector('.collapsible-content');

let tankTime = 3000; // 3 seconds
let tankAmount = 9;
let maxTanks = 10;

document.querySelector('.heat-button').addEventListener('click', heatGenerate);
document.querySelector('.tank-button').addEventListener('click', tankGenerate);

// Activate heat button when Spacebar key is pressed
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !document.querySelector('.heat-button').disabled) {
        heatGenerate();
    }
});
// Activate tank button when "T" key is pressed
document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyT' && !document.querySelector('.tank-button').disabled) {
        tankGenerate();
    }
});

// Toggle collapsible content visibility
collapsibleButton.addEventListener('click', () => {
    collapsibleContainer.classList.toggle('hidden');
    collapsibleContent.classList.toggle('hidden');
});


document.querySelector('.collapsible-content button:nth-child(1)').addEventListener('click', jobSpeedUP);
document.querySelector('.collapsible-content button:nth-child(3)').addEventListener('click', increaseHeatcap);

document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));

        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.remove('hidden');
    });
});

// Show Armory tab when firstTen is true
function showArmoryTab() {
    const armoryTabButton = document.querySelector('.tab-button[data-tab="armory-tab"]');
    armoryTabButton.classList.remove('hidden');
}

function updateHeatAmount(newHeatAmount) {
    heatAmount = newHeatAmount;
    document.querySelector('.item-count').textContent = heatAmount;

    // Update heat item-bar
    const itemBar = document.querySelector('.item-bar');
    const heatRatio = heatAmount / maxHeat;
    const colorValue = Math.floor(255 * (1 - heatRatio));
    itemBar.style.setProperty('--item-bar-color', `rgb(255, ${colorValue}, ${colorValue})`);
    itemBar.style.width = `${heatRatio * 100}%`;

    // Dispatch custom event
    const event = new Event('heatAmountUpdated');
    document.dispatchEvent(event);
}

function heatGenerate() {
    const heatButton = document.querySelector('.heat-button');
    const loadingBar = document.querySelector('.loading-bar');
    const itemCount = document.querySelector('.item-count');
    const itemBar = document.querySelector('.item-bar');
   
    heatButton.disabled = true;
    document.documentElement.style.setProperty('--heat-time', `${heatTime}ms`);
    loadingBar.style.transition = `width ${heatTime}ms linear`; // Enable transition
    loadingBar.style.width = '100%';
    loadingBar.classList.remove('hidden');

    setTimeout(() => {
        updateHeatAmount(heatAmount + 1);
        loadingBar.style.width = '0%';
        loadingBar.style.transition = 'none'; // Disable transition after completion

        // Update item bar color based on heat generated
        const heatRatio = heatAmount / maxHeat;
        const colorValue = Math.floor(255 * (1 - heatRatio));
        itemBar.style.setProperty('--item-bar-color', `rgb(255, ${colorValue}, ${colorValue})`);
        
        // Update item bar width based on heat generated
        itemBar.style.width = `${heatRatio * 100}%`;

        // Disable heat button if maxHeat is reached
        if (heatAmount >= maxHeat) {
            heatButton.disabled = true;          
        } else {
            heatButton.disabled = false;
        }

        // Enable Job Speed button if heatAmount >= upSpeedreq
        if (heatAmount >= upSpeedreq) {
            document.querySelector('.collapsible-content button:nth-child(1)').disabled = false;
        }

         // Set firstTen flag to true when heatAmount reaches or exceeds 10 for the first time
         if (!firstTen && heatAmount >= 10) {
            console.log("Heat amount reached 10 for the first time, showing collapsible button.");
            firstTen = true;
            collapsibleButton.classList.remove('hidden');
            collapsibleContainer.classList.remove('hidden');
            document.querySelector('.tanks-group').classList.remove('hidden');
            showArmoryTab(); // Show the Armory tab
         }

        // Show Tanks group when firstTen is true
        if (firstTen) {
            document.querySelector('.tanks-group').classList.remove('hidden');
        }

        // Enable or grey out tank button based on heatAmount
        const tankButton = document.querySelector('.tank-button');
        if (heatAmount >= 10) {
            tankButton.disabled = false;
            tankButton.classList.remove('heat-disabled');
        } else {
            tankButton.disabled = true;
            tankButton.classList.add('heat-disabled');
        }
    }, heatTime);
}

// Tank group logic
function tankGenerate() {
    const heatButton = document.querySelector('.heat-button');
    const jobSpeedButton = document.querySelector('.collapsible-content button:nth-child(1)');
    if (heatAmount < 10) {
        console.log("Not enough heat to generate a tank.");
        return;
    }

    updateHeatAmount(heatAmount - 10); // Deduct 10 heat for tank generation
    // Enable heat button if heatAmount < maxHeat
    if (heatAmount < maxHeat) {
        heatButton.disabled = false;
        if (heatAmount < upSpeedreq) {
            jobSpeedButton.disabled = true;
        }
    }

    // Update heat group item bar
    const itemBar = document.querySelector('.item-bar');
    const heatRatio = heatAmount / maxHeat;
    const colorValue = Math.floor(255 * (1 - heatRatio));
    itemBar.style.setProperty('--item-bar-color', `rgb(255, ${colorValue}, ${colorValue})`);
    itemBar.style.width = `${heatRatio * 100}%`;

    const tankButton = document.querySelector('.tank-button');
    const tankLoadingBar = document.querySelector('.tank-loading-bar');
    const tankCount = document.querySelector('.tank-count');
    const tankBar = document.querySelector('.tank-bar');       
    
    // Disable tank button during tank generation
    tankButton.disabled = true;
    tankButton.classList.add('heat-disabled');

    document.documentElement.style.setProperty('--tank-time', `${tankTime}ms`);
    tankLoadingBar.style.transition = `width ${tankTime}ms linear`; // Enable transition
    tankLoadingBar.style.width = '100%';
    tankLoadingBar.classList.remove('hidden');

    setTimeout(() => {
        const capacityButton = document.querySelector('.collapsible-content button:nth-child(3)');
        tankAmount++;
        tankCount.textContent = tankAmount;
        tankLoadingBar.style.width = '0%';
        tankLoadingBar.style.transition = 'none'; // Disable transition after completion
                
        // Update tank bar and other UI elements
        const tankRatio = tankAmount / maxTanks;
        const colorValue = Math.floor(255 * (1 - tankRatio));
        tankBar.style.setProperty('--tank-bar-color', `rgb(${colorValue}, 255, ${colorValue})`);
        tankBar.style.width = `${tankRatio * 100}%`;

        // Enable or disable buttons based on updated values
        if (heatAmount >= 10) {
            tankButton.disabled = false;
            tankButton.classList.remove('heat-disabled');
        } else {
            tankButton.disabled = true;
            tankButton.classList.add('heat-disabled');
        }
        console.log(`Tank Amount: ${tankAmount}, Capacity Requirement: ${capacityreq}`);
        
        if (tankAmount >= capacityreq) {
           capacityButton.disabled = false;
        }
               
    }, tankTime);
}

// Job Speed button logic
function jobSpeedUP() {
    const jobSpeedButton = document.querySelector('.collapsible-content button:nth-child(1)');
    const tankButton = document.querySelector('.tank-button');
    // Check if heatAmount is sufficient for Job Speed upgrade
    if (heatAmount < upSpeedreq) {
        console.log("Not enough heat to upgrade job speed.");
        return;
    }

    updateHeatAmount(heatAmount - upSpeedreq); // Deduct heat required for the upgrade
    upSpeedreq += 1; // Increment the requirement for the next upgrade
    if (heatTime >= 50) { heatTime -= 250; } // Reduce heatTime, but ensure it doesn't go below 500ms
    console.log(`Job speed upgraded! New heat time: ${heatTime}ms`);

    // Update heat group item bar
    const itemCount = document.querySelector('.item-count');
    const itemBar = document.querySelector('.item-bar');
    itemCount.textContent = heatAmount;
    const heatRatio = heatAmount / maxHeat;
    const colorValue = Math.floor(255 * (1 - heatRatio));
    itemBar.style.setProperty('--item-bar-color', `rgb(255, ${colorValue}, ${colorValue})`);
    itemBar.style.width = `${heatRatio * 100}%`;

    // Update Job Speed button label
    const jobSpeedLabel = document.querySelector('.job-speed-label');
    jobSpeedLabel.innerHTML = `Heat Generation: ${(heatTime / 1000).toFixed(2)}s<br>Upgrade Needs: ${upSpeedreq}`;

    // Disable Job Speed button if heatAmount < upSpeedreq
    if (heatAmount < upSpeedreq) {
        jobSpeedButton.disabled = true;
    }

    // Enable heat button if heatAmount < maxHeat
    const heatButton = document.querySelector('.heat-button');
    if (heatAmount < maxHeat) {
        heatButton.disabled = false;
    }

    // Disable Tank button if heatAmount < 10
    if (heatAmount < 10) {
        tankButton.disabled = true;
        tankButton.classList.add('heat-disabled');}

    }

// Capacity button logic
function increaseHeatcap() {   
    const tankCount = document.querySelector('.tank-count');
    const capacityButton = document.querySelector('.collapsible-content button:nth-child(3)');
    const heatCapacityLabel = document.querySelector('.heat-capacity-label');
    tankAmount -= capacityreq; // Deduct tanks required for capacity increase
    capacityreq += 1; // Increment capacity requirement
    maxHeat += 1; // Increase max heat capacity
    console.log("New max heat capacity =", maxHeat);

    // Disable Capacity button if tankAmount < capacityreq
    if (tankAmount < capacityreq) {
        capacityButton.disabled = true;
    }

    // Update heat capacity label
    heatCapacityLabel.innerHTML = `Maximum Heat Capacity: ${maxHeat}<br>Upgrade needs: ${capacityreq} Tank`;

    // Update tank bar
    tankCount.textContent = tankAmount;
    const tankBar = document.querySelector('.tank-bar');
    const tankRatio = tankAmount / maxTanks;
    const colorValue = Math.floor(255 * (1 - tankRatio));
    tankBar.style.setProperty('--tank-bar-color', `rgb(${colorValue}, 255, ${colorValue})`);
    tankBar.style.width = `${tankRatio * 100}%`;
}