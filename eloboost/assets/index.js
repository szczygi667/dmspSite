const ranks = [
  "Iron IV", "Iron III", "Iron II", "Iron I",
  "Bronze IV", "Bronze III", "Bronze II", "Bronze I",
  "Silver IV", "Silver III", "Silver II", "Silver I",
  "Gold IV", "Gold III", "Gold II", "Gold I",
  "Platinum IV", "Platinum III", "Platinum II", "Platinum I",
  "Emerald IV", "Emerald III", "Emerald II", "Emerald I",
  "Diamond IV", "Diamond III", "Diamond II", "Diamond I",
  "Master I"
];

function getRankGroup(rank) {
  return rank.split(" ")[0].toLowerCase();
}

function updateRankImage(selectId, imageId) {
  const select = document.getElementById(selectId);
  const image = document.getElementById(imageId);
  const value = select.value;
  if (!value || !image) return;

  const group = getRankGroup(value);
  image.src = `../images/ranks/${group}.png`;
}

function populateDesiredRank(currentValue) {
  const desiredSelect = document.getElementById("desired-rank");
  desiredSelect.innerHTML = "<option disabled selected>Select desired rank</option>";
  const currentIndex = ranks.indexOf(currentValue);
  if (currentIndex === -1) return;
  for (let i = currentIndex + 1; i < ranks.length; i++) {
    const option = document.createElement("option");
    option.value = ranks[i];
    option.textContent = ranks[i];
    desiredSelect.appendChild(option);
  }
}

function calculateBoost(returnOnly = false) {
  const current = document.getElementById("current-rank")?.value;
  const desired = document.getElementById("desired-rank")?.value;
  const offline = document.getElementById("offline-status")?.checked;
  const customChamp = document.getElementById("custom-champ")?.checked;
  const priority = document.getElementById("priority-boost")?.checked;
  const spells = document.getElementById("summoner-spells")?.checked;
  const role = document.getElementById("role")?.value;
  const lpGain = document.getElementById("lp-gain")?.value;
  const server = document.getElementById("server")?.value;

  const priceTable = {};
  ranks.forEach((rank, index) => priceTable[rank] = index);

  const result = document.getElementById("price-result");
  if (result) {
    result.classList.remove("visible");
    void result.offsetWidth;
  }

  if (priceTable[current] === undefined || priceTable[desired] === undefined) {
    if (result) result.innerText = "Select desired rank!";
    return;
  }

  const tierDiff = priceTable[desired] - priceTable[current];
  if (tierDiff <= 0) {
    if (result) result.innerText = "Docelowa ranga musi być wyższa!";
    return;
  }

  let price = tierDiff * 35;

  if (window.location.href.includes("duo-boost")) price *= 1.5;
  if (offline) price *= 1.05;
  if (customChamp) price *= 1.10;
  if (priority) price *= 1.25;
  if (role && role !== "") price *= 1.15;

  const finalPrice = Math.round(price);

  if (result) {
    result.innerText = `Cena: ${finalPrice} zł`;
    result.classList.add("visible");
  }

  if (returnOnly) {
    return {
      currentRank: current,
      desiredRank: desired,
      lpGain,
      server,
      offline,
      customChamp,
      priority,
      spells,
      role,
      price: finalPrice
    };
  }
}

function handlePurchase() {
  const orderData = calculateBoost(true);
  if (!orderData) return;

  localStorage.setItem("orderData", JSON.stringify(orderData));
  window.location.href = "payment.html";
}

document.addEventListener("DOMContentLoaded", () => {
  // Dodajemy animację dla obrazków dywizji
  const rankImages = document.querySelectorAll('.rank-box img');
  rankImages.forEach(img => img.classList.add('floating-rank'));

  const contentWrapper = document.querySelector('.content-wrapper');
  if (contentWrapper) contentWrapper.classList.add('fade-in');

  const isDuoPage = window.location.href.includes("duo-boost");

  const title = isDuoPage ? "Duo Boost - DMSPboosting" : "Solo Boost - DMSPboosting";
  document.title = title;

  const boostSwitch = document.getElementById("boost-switch-link");
  if (boostSwitch) {
    boostSwitch.textContent = isDuoPage ? "SoloQ Boosting" : "DuoQ Boosting";
    boostSwitch.href = isDuoPage ? "soloq.html" : "duo-boost.html";
  }

  const currentSelect = document.getElementById("current-rank");
  const desiredSelect = document.getElementById("desired-rank");

  if (currentSelect) {
    currentSelect.innerHTML = "";
    ranks.forEach(rank => {
      const option = document.createElement("option");
      option.value = rank;
      option.textContent = rank;
      currentSelect.appendChild(option);
    });

    currentSelect.value = "Silver IV";
    populateDesiredRank("Silver IV");
    updateRankImage("current-rank", "current-rank-image");

    currentSelect.addEventListener("change", () => {
      const currentValue = currentSelect.value;
      populateDesiredRank(currentValue);
      updateRankImage("current-rank", "current-rank-image");
      calculateBoost();
    });
  }

  if (desiredSelect) {
    desiredSelect.addEventListener("change", () => {
      updateRankImage("desired-rank", "desired-rank-image");
      calculateBoost();
    });

    setTimeout(() => {
      desiredSelect.value = "Gold IV";
      updateRankImage("desired-rank", "desired-rank-image");
      calculateBoost();
    }, 50);
  }

  ['#offline-status', '#custom-champ', '#priority-boost', '#summoner-spells'].forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      element.addEventListener('change', calculateBoost);
    }
  });

  const roleSelect = document.getElementById("role");
  if (roleSelect) {
    roleSelect.addEventListener("change", calculateBoost);
  }

  const themeToggle = document.getElementById("theme-switch");
  const themeLabel = document.getElementById("theme-label");

  const applyTheme = () => {
    const isLight = localStorage.getItem("theme") === "light";
    document.body.classList.toggle("light-mode", isLight);
    if (themeToggle) themeToggle.checked = isLight;
    if (themeLabel) themeLabel.textContent = isLight ? "Light" : "Dark";
  };

  if (themeToggle) {
    themeToggle.addEventListener("change", () => {
      const newTheme = themeToggle.checked ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      applyTheme();
    });
  }

  applyTheme();
});