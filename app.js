const barWeightInput = document.getElementById('bar-weight');
const targetWeightInput = document.getElementById('target-weight');
const calculateBtn = document.getElementById('calculate-btn');
const resultSection = document.getElementById('result-section');
const platesContainer = document.getElementById('plates-container');
const errorMessage = document.getElementById('error-message');
const perSideWeight = document.getElementById('per-side-weight');
const barLabel = document.getElementById('bar-label');

const PLATE_SIZES = [45, 35, 25, 10, 5, 2.5];

function calculatePlates() {
    const barWeight = parseFloat(barWeightInput.value) || 0;
    const targetWeight = parseFloat(targetWeightInput.value) || 0;
    
    // Clear previous errors
    errorMessage.classList.remove('visible');
    errorMessage.textContent = '';
    
    // Validation
    if (targetWeight <= 0 || barWeight < 0) {
        showError('Please enter valid weights');
        return;
    }
    
    if (targetWeight < barWeight) {
        showError('Target weight must be greater than or equal to bar weight');
        return;
    }
    
    // Calculate weight per side
    const weightToLoad = targetWeight - barWeight;
    const weightPerSide = weightToLoad / 2;
    
    // Get plate configuration
    const plates = getPlateConfiguration(weightPerSide);
    
    if (plates === null) {
        showError(`Cannot make exact weight with available plates. Try ${Math.round(targetWeight / 5) * 5} lbs instead.`);
        return;
    }
    
    // Update display
    perSideWeight.textContent = `${weightPerSide.toFixed(1)} lbs`;
    barLabel.textContent = barWeight;
    displayPlates(plates);
    
    // Show result
    resultSection.classList.add('visible');
}

function getPlateConfiguration(weightPerSide) {
    const plates = [];
    let remaining = weightPerSide;
    
    // Greedy algorithm to find plates
    for (const plateWeight of PLATE_SIZES) {
        while (remaining >= plateWeight - 0.01) { // Small tolerance for floating point
            plates.push(plateWeight);
            remaining -= plateWeight;
        }
    }
    
    // Check if we got exact weight
    if (remaining > 0.01) {
        return null; // Cannot make exact weight
    }
    
    return plates;
}

function displayPlates(plates) {
    platesContainer.innerHTML = '';
    
    if (plates.length === 0) {
        const noPlatesMsg = document.createElement('div');
        noPlatesMsg.style.padding = '20px';
        noPlatesMsg.style.color = '#666';
        noPlatesMsg.style.fontSize = '18px';
        noPlatesMsg.style.fontWeight = '700';
        noPlatesMsg.textContent = 'No plates needed';
        platesContainer.appendChild(noPlatesMsg);
        return;
    }
    
    plates.forEach(weight => {
        const plateDiv = document.createElement('div');
        plateDiv.className = `plate plate-${weight.toString().replace('.', '-')}`;
        plateDiv.textContent = weight;
        platesContainer.appendChild(plateDiv);
    });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('visible');
    resultSection.classList.remove('visible');
}

// Event listeners
calculateBtn.addEventListener('click', calculatePlates);

targetWeightInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculatePlates();
        e.target.blur();
    }
});

barWeightInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculatePlates();
        e.target.blur();
    }
});

// Calculate on page load
window.addEventListener('load', () => {
    calculatePlates();
});
