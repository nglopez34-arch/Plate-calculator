const barWeightInput = document.getElementById('bar-weight');
const targetWeightInput = document.getElementById('target-weight');
const calculateBtn = document.getElementById('calculate-btn');
const resultSection = document.getElementById('result-section');
const platesContainer = document.getElementById('plates-container');
const errorMessage = document.getElementById('error-message');

const PLATE_SIZES = [45, 35, 25, 10, 5, 2.5];

function calculatePlates() {
    const barWeight = parseFloat(barWeightInput.value) || 0;
    const targetWeight = parseFloat(targetWeightInput.value) || 0;
    
    errorMessage.classList.remove('visible');
    errorMessage.textContent = '';
    
    if (targetWeight < barWeight) {
        showError('Target weight must be greater than bar weight');
        return;
    }
    
    const weightToLoad = targetWeight - barWeight;
    const weightPerSide = weightToLoad / 2;
    
    if (weightPerSide < 0) {
        showError('Invalid weight configuration');
        return;
    }
    
    const plates = getPlateConfiguration(weightPerSide);
    
    if (plates === null) {
        showError('Cannot make exact weight with available plates');
        return;
    }
    
    displayPlates(plates);
    resultSection.classList.add('visible');
}

function getPlateConfiguration(weightPerSide) {
    const plates = [];
    let remaining = weightPerSide;
    
    for (const plateWeight of PLATE_SIZES) {
        while (remaining >= plateWeight - 0.01) {
            plates.push(plateWeight);
            remaining -= plateWeight;
        }
    }
    
    if (remaining > 0.01) {
        return null;
    }
    
    return plates;
}

function displayPlates(plates) {
    platesContainer.innerHTML = '';
    
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

calculateBtn.addEventListener('click', calculatePlates);

targetWeightInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculatePlates();
    }
});

barWeightInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculatePlates();
    }
});

// Calculate on load
calculatePlates();

