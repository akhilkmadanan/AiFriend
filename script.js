const URL = "./"; // Path to the model files

let model, webcam, labelContainer, maxPredictions;

// Show loading spinner while setting up
function showLoading() {
    document.getElementById("loading-container").style.display = "block";
}

// Hide loading spinner once setup is complete
function hideLoading() {
    document.getElementById("loading-container").style.display = "none";
}

// Initialize the model and webcam
async function init() {
    // Show loading spinner when start is clicked
    showLoading();

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true; // Flip webcam for selfie mode
    webcam = new tmImage.Webcam(300, 300, flip);

    // Set up webcam with permission
    await webcam.setup();
    await webcam.play();

    // Hide the loading spinner once the webcam starts
    hideLoading();

    window.requestAnimationFrame(loop);
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
}

// Webcam loop
async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

// Run predictions
async function predict() {
    const predictions = await model.predict(webcam.canvas);

    // Find the prediction with the highest probability
    const bestPrediction = predictions.reduce((prev, curr) =>
        curr.probability > prev.probability ? curr : prev
    );

    // Show the name if the confidence is high
    if (bestPrediction.probability > 0.0) {
        labelContainer.textContent = bestPrediction.className;
    } else {
        labelContainer.textContent = "Searching...";
    }
}

// Start identifying on button click
document.getElementById("start-button").addEventListener("click", init);
