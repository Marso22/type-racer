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
        highlightUserInput();
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

    // Highlight sample text in real time
    function highlightUserInput() {
        const sampleText = sampleTextDiv.textContent;
        const userText = userInput.value;
        const sampleWords = sampleText.split(/\s+/);
        const userWords = userText.split(/\s+/);

        let highlighted = '';
        for (let i = 0; i < sampleWords.length; i++) {
            if (userWords[i] === undefined || userWords[i] === "") {
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

    // Start test: don't clear input, just start timer
    function startTest() {
        userInput.disabled = false;
        userInput.focus();
        startTime = performance.now();
        timerRunning = true;
        timeSpan.textContent = '0.00';
        wpmSpan.textContent = '0';
        retryBtn.disabled = true;
    }

    // Stop test
    function stopTest() {
        if (!timerRunning) return;
        endTime = performance.now();
        timerRunning = false;
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

        // Enable retry button
        retryBtn.disabled = false;
    }

    // Retry functionality: new sample, clear input, reset results, disable retry
    function handleRetry() {
        // Load new sample text of the same difficulty
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

        // Clear and enable user input
        userInput.value = '';
        userInput.disabled = false;
        userInput.focus();

        // Reset Results area
        timeSpan.textContent = '0.00';
        wpmSpan.textContent = '0';
        levelSpan.textContent = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);

        // Reset timer state
        timerRunning = false;
        startTime = null;
        endTime = null;

        // Highlight reset
        highlightUserInput();

        // Disable retry button
        retryBtn.disabled = true;

        // Re-attach first input listener
        userInput.removeEventListener('input', handleFirstInput);
        userInput.addEventListener('input', handleFirstInput, { once: true });
    }

    // Reset test (used for difficulty change and initial load)
    function resetTest() {
        userInput.value = '';
        userInput.disabled = false;
        timeSpan.textContent = '0.00';
        wpmSpan.textContent = '0';
        timerRunning = false;
        startTime = null;
        endTime = null;
        highlightUserInput();
        retryBtn.disabled = true;

        // Remove previous input event (if any) and add a new one for first input
        userInput.removeEventListener('input', handleFirstInput);
        userInput.addEventListener('input', handleFirstInput, { once: true });
    }

    // Start test on first input
    function handleFirstInput() {
        if (!timerRunning) {
            startTest();
        }
    }

    // Stop test on Enter key
    function handleEnterKey(e) {
        if (timerRunning && e.key === 'Enter') {
            e.preventDefault(); // Prevent newline in textarea
            stopTest();
        }
    }

    // Event listeners
    difficultySelect.addEventListener('change', function () {
        updateSampleText();
        resetTest();
    });
    userInput.addEventListener('keydown', handleEnterKey);
    retryBtn.addEventListener('click', handleRetry);
    userInput.addEventListener('input', highlightUserInput);

    // Hide start and stop buttons
    startBtn.style.display = 'none';
    stopBtn.style.display = 'none';

    // Initialize with a random text from the default difficulty level
    updateSampleText();
    highlightUserInput();
    resetTest();
    highlightUserInput();
});