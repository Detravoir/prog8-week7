import { createChart, updateChart } from "../libraries/scatterplot.js";

let nn;

// Getting DOM elements
const storageInput = document.getElementById("storage");
const resoloutionInput = document.getElementById(
  "resoloution"
);
const ppiInput = document.getElementById("ppi");
const coresInput = document.getElementById("cores");
const predictButton = document.getElementById("prediction-btn");
// const saveButton = document.getElementById("save-btn");
const resultDiv = document.getElementById("result");

// Hide the elements on the first boot
predictButton.style.display = "none";
// saveButton.style.display = "none";

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

// Save model
// saveButton.addEventListener("click", (e) => {
//   e.preventDefault();
//   nn.save();
// });

function loadData() {
  Papa.parse("./data/mobilephone.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => createNeuralNetwork(results.data),
  });
}

// Create Neural Network
function createNeuralNetwork(data) {
  data.sort(() => Math.random() - 0.5);

  // Slice data into test and training data
  let trainData = data.slice(0, Math.floor(data.length * 0.8));
  let testData = data.slice(Math.floor(data.length * 0.8) + 1);
  console.table(testData);

  // Create Neural Network
  nn = ml5.neuralNetwork({ task: 'regression', debug: true })

  // Adding data to the Neural Network
  for (let mobilePhone of trainData) {
    let inputs = {
      storage: mobilePhone.storage,
      resoloution: mobilePhone.resoloution,
      ppi: mobilePhone.ppi,
      cores: mobilePhone.cores,
    };

    nn.addData(inputs, { price: mobilePhone.price });
  }
  nn.normalizeData();
  checkData(trainData, testData);
}

function checkData(trainData, testData) {
  console.table(testData);

  const chartdata = trainData.map((mobilePhone) => ({
    x: mobilePhone.price,
    y: mobilePhone.storage,
  }));

  createChart(chartdata, "storage", "Price");
  startTraining(trainData, testData);
}

function startTraining(trainData, testData) {
  nn.train({ epochs: 20 }, () => finishedTraining(trainData, testData));
}

async function finishedTraining(trainData = false, testData) {
  let predictions = [];
  for (let pr = 1200; pr < 4000; pr += 100) {
    const testPhone = {
      storage: testData[0].storage,
      resoloution: testData[0].resoloution,
      ppi: testData[0].ppi,
      cores: testData[0].cores,
    };
    const pred = await nn.predict(testPhone);
    predictions.push({ x: pr, y: pred[0].price });
  }

  // Adds the neural network data to the chart
  updateChart("Predictions", predictions);
  console.log("Finished training!");

  storageInput.style.display = "inline";
  resoloutionInput.style.display = "inline";
  ppiInput.style.display = "inline";
  coresInput.style.display = "inline";
  predictButton.style.display = "inline";
  // saveButton.style.display = "inline";
}

// Create prediction
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
    resultDiv.innerText = `The price of this phone is: €${priceTwoDecimals}`;
  } else {
    resultDiv.innerText = `Please fill in all the fields`;
  }
}

loadData();
