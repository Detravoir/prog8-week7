let nn;

// Getting DOM elements
const storageInput = document.getElementById("storage");
const resoloutionInput = document.getElementById(
  "resoloution"
);
const ppiInput = document.getElementById("ppi");
const coresInput = document.getElementById("cores");
const predictButton = document.getElementById("prediction-btn");
const saveButton = document.getElementById("save-btn");
const resultDiv = document.getElementById("result");

// Hide the elements on the first boot
predictButton.style.display = "none";

predictButton.addEventListener("click", (e) => {
  e.preventDefault();
  let storageInputValue =
    document.getElementById("storage").value;
  let resoloutionInputValue = document.getElementById(
    "resoloution"
  ).value;
  let ppiInputValue = document.getElementById("ppi").value;
  let coresInputValue = document.getElementById("cores").value;
  makePrediction(
    +storageInputValue,
    +resoloutionInputValue,
    +ppiInputValue,
    +coresInputValue
  );
});

function loadData() {
  nn = ml5.neuralNetwork({ task: 'regression', debug: true })

// Load model
  const modelInfo = {
    model: "./model/model.json",
    metadata: "./model/model_meta.json",
    weights: "./model/model.weights.bin",
  };

  nn.load(modelInfo, () => console.log("Model loaded!"));

  // Show elements after loading
  predictButton.style.display = "inline-block";
}

// Creates prediction
async function makePrediction(storage, resoloution, ppi, cores) {
  if (storage && resoloution && ppi && cores) {
    const results = await nn.predict(
      {
        storage: storage,
        resoloution: resoloution,
        ppi: ppi,
        cores: cores,
      },
      () => console.log("Prediction successful!")
    );
    const priceTwoDecimals = results[0].price.toFixed(2);
    resultDiv.innerText = `The price of the phone is: €${priceTwoDecimals}`;
  } else {
    resultDiv.innerText = `Please fill in all the fields`;
  }
}

loadData();
