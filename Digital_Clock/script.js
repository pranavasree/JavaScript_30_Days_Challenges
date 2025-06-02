const toggle = document.getElementById("formatToggle");

let is24Hour = false;
toggle.addEventListener("change", () => {
  is24Hour = toggle.checked;
});

setInterval(() => {
  const hours = document.querySelector(".hours");
  const minutes = document.querySelector(".minutes");
  const seconds = document.querySelector(".seconds");
  const ampm = document.querySelector(".ampm");

  const hr = document.querySelector(".hr");
  const min = document.querySelector(".min");
  const sec = document.querySelector(".sec");

  const hr_dot = document.querySelector(".hr-dots");
  const min_dot = document.querySelector(".min-dots");
  const sec_dot = document.querySelector(".sec-dots");

  let h = new Date().getHours();
  let m = new Date().getMinutes();
  let s = new Date().getSeconds();
  let displayHour = h;

  let am = h >= 12 ? "PM" : "AM";

  if (!is24Hour) {
    displayHour = h % 12 || 12; // convert to 12hr format
  }

  displayHour = displayHour < 10 ? "0" + displayHour : displayHour;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  hours.innerHTML = displayHour + "<br><span>Hrs</span>";
  minutes.innerHTML = m + "<br><span>Min</span>";
  seconds.innerHTML = s + "<br><span>Sec</span>";
  ampm.innerHTML = is24Hour ? "" : am;

  hr.style.strokeDashoffset = 440 - (440 * h) / 24;
  min.style.strokeDashoffset = 440 - (440 * m) / 60;
  sec.style.strokeDashoffset = 440 - (440 * s) / 60;

  hr_dot.style.transform = `rotate(${h * 15}deg)`; // 360 / 24 = 15
  min_dot.style.transform = `rotate(${m * 6}deg)`;
  sec_dot.style.transform = `rotate(${s * 6}deg)`;
});
