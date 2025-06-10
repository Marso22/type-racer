document.addEventListener('DOMContentLoaded', function () {
    // Sample texts for each difficulty
    const easyTexts = [
        "The cat sat on the mat.",
        "A quick brown fox jumps over the lazy dog.",
        "She sells seashells by the seashore."
    ];

    const mediumTexts = [
        "To be or not to be, that is the question.",
        "All that glitters is not gold.",
        "A journey of a thousand miles begins with a single step."
    ];

    const hardTexts = [
        "It was the best of times, it was the worst of times.",
        "In the beginning God created the heavens and the earth.",
        "The only thing we have to fear is fear itself."
    ];

    // DOM elements
    const difficultySelect = document.getElementById('difficulty');
    const sampleTextDiv = document.getElementById('sample-text');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const retryBtn = document.getElementById('retry-btn');
    const timeSpan = document.getElementById('time');
    const userInput = document.getElementById('user-input');
    const wpmSpan = document.getElementById('wpm');
    const levelSpan = document.getElementById('level');

    
    // Highlight overlay div for real-time feedback
let highlightDiv = document.getElementById('highlighted-text');
if (!highlightDiv) {
    highlightDiv = document.createElement('div');
    highlightDiv.id = 'highlighted-text';
    highlightDiv.className = 'mb-3 p-3 border';
    highlightDiv.style.position = 'absolute';
    highlightDiv.style.pointerEvents = 'none';
    highlightDiv.style.width = '100%';
    highlightDiv.style.height = '100%';
    highlightDiv.style.top = '0';
    highlightDiv.style.left = '0';
    highlightDiv.style.whiteSpace = 'pre-wrap';
    highlightDiv.style.zIndex = '2';
    sampleTextDiv.style.position = 'relative';
    sampleTextDiv.parentNode.insertBefore(highlightDiv, sampleTextDiv.nextSibling);
}

    // Timer variables
    let startTime = null;
    let endTime = null;
    let timerRunning = false;

    // Helper: Get random text for difficulty
    function getRandomText(textArray) {
        const randomIndex = Math.floor(Math.random() * textArray.length);
        return textArray[randomIndex];
    }

    // Update sample text based on selected difficulty
    function updateSampleText() {
        let selectedDifficulty = difficultySelect.value;
        let selectedText;
        if (selectedDifficulty === 'easy') {
            selectedText = getRandomText(easyTexts);
        } else if (selectedDifficulty === 'medium') {
            selectedText = getRandomText(mediumTexts);
        } else if (selectedDifficulty === 'hard') {
            selectedText = getRandomText(hardTexts);
        }
        sampleTextDiv.textContent = selectedText;
        // Reset test when changing difficulty
        resetTest();
        levelSpan.textContent = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
    }

    // Count correct words
    function getCorrectWordCount(userInputText, sampleText) {
        const userWords = userInputText.trim().split(/\s+/);
        const sampleWords = sampleText.trim().split(/\s+/);
        let correctCount = 0;
        for (let i = 0; i < Math.min(userWords.length, sampleWords.length); i++) {
            if (userWords[i] === sampleWords[i]) {
                correctCount++;
            }
        }
        return correctCount;
    }

function highlightUserInput() {
    const sampleText = sampleTextDiv.textContent;
    const userText = userInput.value;
    const sampleWords = sampleText.split(/\s+/);
    const userWords = userText.split(/\s+/);

    let highlighted = '';
    for (let i = 0; i < sampleWords.length; i++) {
        if (userWords[i] === undefined) {
            highlighted += `<span>${sampleWords[i]}</span>`;
        } else if (userWords[i] === sampleWords[i]) {
            highlighted += `<span style="color: #0d6efd; font-weight: bold;">${sampleWords[i]}</span>`;
        } else {
            highlighted += `<span style="color: #dc3545; font-weight: bold;">${sampleWords[i]}</span>`;
        }
        if (i < sampleWords.length - 1) highlighted += ' ';
    }
    highlightDiv.innerHTML = highlighted;
}
    // Calculate WPM
    function calculateWPM(correctWords, elapsedSeconds) {
        if (elapsedSeconds === 0) return 0;
        return Math.round((correctWords / elapsedSeconds) * 60);
    }

    // Update results area
    function updateResultsArea(wpm, difficulty) {
        wpmSpan.textContent = wpm;
        levelSpan.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }

    // Start test
    function startTest() {
        startBtn.disabled = true;
        stopBtn.disabled = false;
        userInput.value = '';
        userInput.disabled = false;
        userInput.focus();
        startTime = performance.now();
        timerRunning = true;
        timeSpan.textContent = '0.00';
        wpmSpan.textContent = '0';
    }

    // Stop test
    function stopTest() {
        if (!timerRunning) return;
        endTime = performance.now();
        timerRunning = false;
        stopBtn.disabled = true;
        startBtn.disabled = false;
        userInput.disabled = true;
        const elapsedSeconds = ((endTime - startTime) / 1000);
        timeSpan.textContent = elapsedSeconds.toFixed(2);

        // Calculate WPM
        const sampleText = sampleTextDiv.textContent;
        const userText = userInput.value;
        const correctWords = getCorrectWordCount(userText, sampleText);
        const wpm = calculateWPM(correctWords, elapsedSeconds);

        // Update results
        updateResultsArea(wpm, difficultySelect.value);
    }

    // Reset test
    function resetTest() {
        startBtn.disabled = false;
        stopBtn.disabled = true;
        userInput.value = '';
        userInput.disabled = true;
        timeSpan.textContent = '0.00';
        wpmSpan.textContent = '0';
        timerRunning = false;
    }

    // Event listeners
    difficultySelect.addEventListener('change', updateSampleText);
    startBtn.addEventListener('click', startTest);
    stopBtn.addEventListener('click', stopTest);
    retryBtn.addEventListener('click', resetTest);
    userInput.addEventListener('input', highlightUserInput);

    // Initialize with a random text from the default difficulty level
    updateSampleText();
    highlightUserInput();
    resetTest();
    highlightUserInput();
});