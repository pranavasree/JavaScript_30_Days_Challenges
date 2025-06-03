const billInput = document.getElementById("billTotalInput");
const tipInput = document.getElementById("tipInput");
const numberOfPeopleDiv = document.getElementById("numberOfPeople");
const perPersonTotalDiv = document.getElementById("perPersonTotal");
const totalBillDisplay = document.getElementById("totalBillDisplay");

let numberOfPeople = 1;

const calculateBill = () => {
  const bill = parseFloat(billInput.value);
  const tipPercent = parseFloat(tipInput.value) / 100;

  if (isNaN(bill) || isNaN(tipPercent) || bill < 0 || tipPercent < 0) {
    perPersonTotalDiv.innerText = "$0.00";
    totalBillDisplay.innerText = "$0.00";
    return;
  }

  const tipAmount = bill * tipPercent;
  const total = bill + tipAmount;
  const perPersonTotal = total / numberOfPeople;

  perPersonTotalDiv.innerText = `$${perPersonTotal.toFixed(2)}`;
  totalBillDisplay.innerText = `$${total.toFixed(2)}`;
};

const increasePeople = () => {
  numberOfPeople++;
  numberOfPeopleDiv.innerText = numberOfPeople;
  calculateBill();
};

const decreasePeople = () => {
  if (numberOfPeople <= 1) return;
  numberOfPeople--;
  numberOfPeopleDiv.innerText = numberOfPeople;
  calculateBill();
};

const resetCalculator = () => {
  billInput.value = "";
  tipInput.value = "";
  numberOfPeople = 1;
  numberOfPeopleDiv.innerText = numberOfPeople;
  perPersonTotalDiv.innerText = "$0.00";
  totalBillDisplay.innerText = "$0.00";
};
