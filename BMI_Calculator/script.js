const BMI_HEADS = document.querySelectorAll(".bmi-head");
const BMI_USC = document.getElementById("bmi-usc");
const BMI_SI = document.getElementById("bmi-si");
const CALC_BTN = document.getElementById("calc-btn");
const CLR_BTN = document.getElementById("clr-btn");
let activeForm;

// event listeners
window.addEventListener("DOMContentLoaded", () => {
  BMI_USC.classList.add("show-bmi");
  activeForm = "bmi-usc";
  renderGaugeBase();
});

CALC_BTN.addEventListener("click", performBMICalc);
CLR_BTN.addEventListener("click", () => {
  let forms = [...document.forms];
  forms.forEach((form) => form.reset());
  clearBMIInfo();
});

function clearBMIInfo() {
  document.getElementById("bmi-value").innerHTML = "";
  document.getElementById("bmi-category").innerHTML = "";
  document.getElementById("bmi-gender").innerHTML = "";
  updateGaugePointer(null);
}

BMI_HEADS.forEach((bmiHead) => {
  bmiHead.addEventListener("click", () => {
    removeActiveClass();
    clearBMIInfo();
    bmiHead.classList.add("active-head");

    if (bmiHead.id === "bmi-usc-head") {
      BMI_SI.classList.remove("show-bmi");
      BMI_USC.classList.add("show-bmi");
      activeForm = "bmi-usc";
    } else {
      BMI_USC.classList.remove("show-bmi");
      BMI_SI.classList.add("show-bmi");
      activeForm = "bmi-si";
    }
  });
});

function removeActiveClass() {
  BMI_HEADS.forEach((bmiHead) => {
    bmiHead.classList.remove("active-head");
  });
}

function performBMICalc() {
  let BMIInfo = getUserInput();
  if (BMIInfo) printBMIResult(BMIInfo);
}

function getUserInput() {
  let status;

  if (activeForm === "bmi-usc") {
    let age = document.getElementById("age1").value.trim(),
      gender = document.querySelector(
        '#bmi-usc input[name="gender"]:checked'
      )?.value,
      heightFeet = document.getElementById("feet").value.trim(),
      heightInches = document.getElementById("inches").value.trim(),
      weightPounds = document.getElementById("pounds").value.trim();

    status = checkInputStatus([
      age,
      heightFeet,
      heightInches,
      weightPounds,
      gender,
    ]);

    if (status) {
      return calculateBMI({
        gender,
        age: parseInt(age),
        height: parseFloat(heightFeet) * 12 + parseFloat(heightInches || 0),
        weight: parseFloat(weightPounds),
      });
    }
  }

  if (activeForm === "bmi-si") {
    let age = document.getElementById("age2").value.trim(),
      gender = document.querySelector(
        '#bmi-si input[name="gender"]:checked'
      )?.value,
      heightCm = document.getElementById("cm").value.trim(),
      weightKg = document.getElementById("kg").value.trim();

    status = checkInputStatus([age, heightCm, weightKg, gender]);

    if (status) {
      return calculateBMI({
        gender,
        age: parseInt(age),
        height: parseFloat(heightCm) / 100,
        weight: parseFloat(weightKg),
      });
    }
  }

  // Show validation message
  document.querySelector(".alert-error").style.display = "block";
  setTimeout(() => {
    document.querySelector(".alert-error").style.display = "none";
  }, 2000);
  return false;
}

function checkInputStatus(inputs) {
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if (
      input === undefined ||
      input === null ||
      input.toString().trim() === ""
    ) {
      return false;
    }
    if (i !== inputs.length - 1 && isNaN(input)) {
      // only check isNaN for numbers, not gender
      return false;
    }
  }
  return true;
}

function calculateBMI(values) {
  let BMI;
  if (activeForm === "bmi-usc") {
    BMI = (703 * (values.weight / Math.pow(values.height, 2))).toFixed(2);
  } else {
    BMI = (values.weight / Math.pow(values.height, 2)).toFixed(2);
  }
  return { gender: values.gender, BMI: parseFloat(BMI) };
}

function printBMIResult(BMIInfo) {
  document.getElementById(
    "bmi-value"
  ).innerHTML = `${BMIInfo.BMI} kg/m<sup>2</sup>`;

  let bmiCategory;
  if (BMIInfo.BMI < 18.5) {
    bmiCategory = "Underweight";
  } else if (BMIInfo.BMI >= 18.5 && BMIInfo.BMI <= 24.9) {
    bmiCategory = "Normal Weight";
  } else if (BMIInfo.BMI >= 25 && BMIInfo.BMI <= 29.9) {
    bmiCategory = "Overweight";
  } else {
    bmiCategory = "Obesity";
  }

  document.getElementById("bmi-category").innerHTML = `${bmiCategory}`;
  document.getElementById("bmi-gender").innerHTML = BMIInfo.gender;
  updateGaugePointer(BMIInfo.BMI);
}

// Render the gauge bar
function renderGaugeBase() {
  const gaugeContainer = document.createElement("div");
  gaugeContainer.className = "gauge-container";

  const gauge = document.createElement("div");
  gauge.id = "gauge";

  const gaugeBar = document.createElement("div");
  gaugeBar.className = "gauge-bar";

  const segments = [
    { className: "underweight", width: 18.5 },
    { className: "normal", width: 6.4 },
    { className: "overweight", width: 5 },
    { className: "obese", width: 10 },
  ];

  segments.forEach((s) => {
    const div = document.createElement("div");
    div.className = `segment ${s.className}`;
    div.style.flexGrow = s.width;
    gaugeBar.appendChild(div);
  });

  const pointer = document.createElement("div");
  pointer.className = "gauge-pointer";
  pointer.id = "gauge-pointer";
  gauge.appendChild(gaugeBar);
  gauge.appendChild(pointer);
  gaugeContainer.appendChild(gauge);

  document.querySelector(".bmi-output").appendChild(gaugeContainer);
}

// Move the pointer based on BMI
function updateGaugePointer(bmi) {
  const pointer = document.getElementById("gauge-pointer");
  if (!pointer) return;

  if (bmi === null) {
    pointer.style.left = "-9999px";
    return;
  }

  const minBMI = 10;
  const maxBMI = 40;
  let clampedBMI = Math.min(Math.max(bmi, minBMI), maxBMI);
  let percentage = ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100;
  pointer.style.left = `${percentage}%`;
}
