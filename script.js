const URL = "./"; // Path to the model files

let model, webcam, labelContainer, maxPredictions;

// Initialize the model and webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true; // Flip webcam for selfie mode
    webcam = new tmImage.Webcam(300, 300, flip);
    await webcam.setup();
    await webcam.play();
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
