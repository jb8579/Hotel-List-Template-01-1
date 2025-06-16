// SCROLL TO LIST START
const scrollSection =
  window.innerWidth <= 1000 && document.getElementById("scrollOnMb");
scrollSection &&
  scrollSection.scrollIntoView({ behavior: "smooth", block: "start" });
// SCROLL TO LIST END

// NAVBAR START
const navBtn = document.getElementById("nav_btn");
const navCloseBtn = document.getElementById("nav_close_btn");
const overlay = document.getElementById("overlay");
const navLinks = document.getElementById("nav_links");
const nav = document.querySelector("nav");
const main = document.querySelector("main");
const copied = document.querySelector('.copied');
const copyPromos = document.querySelectorAll(".copyPromo");

function toggleNav(show) {
  overlay.style.left = show ? "0" : "-100%";
  navLinks.style.left = show ? "0" : "-100%";
  document.body.classList.toggle("remove_scrolling", show);
}

navBtn.addEventListener("click", () => toggleNav(true));
navCloseBtn.addEventListener("click", () => toggleNav(false));
// NAVBAR END

copyPromos?.forEach((item) => {
  item.addEventListener("click", (e) => {
    let promo =item.closest('.promo').querySelector('p > span').innerHTML;
    navigator.clipboard.writeText(promo).then(()=>{
      copied.style.opacity = '1';
      setTimeout(()=> copied.style.opacity = '0', 500)
    })
  });
});

// TOGGLE MOBILE FILTER START
const openFilter = document.getElementById("openFilter");
const closeFilter = document.getElementById("closeFilter");
const filterOverlay = document.getElementById("filterOverlay");
const filter = document.querySelector(".filter");
const applyContainer = document.querySelector(".apply_filter_container");
const listing = document.getElementById("listing");
const DefaultCards = Array.from(listing.getElementsByClassName("card"));
const applyFilter = document.getElementById("applyFilter");

function toggleFilter(show) {
  const position = show ? "0" : "-100%";
  filterOverlay.style.right = position;
  filter.style.right = position;
  overlay.style.left = position;
  overlay.style.background = show ? "#000000C4" : "#000";
  applyContainer.style.right = show ? "32px" : "-100%";
  document.body.classList.toggle("remove_scrolling", show);
}

openFilter?.addEventListener("click", () => toggleFilter(true));
closeFilter?.addEventListener("click", () => toggleFilter(false));
overlay.addEventListener("click", () => toggleFilter(false));
applyFilter.addEventListener("click", () => toggleFilter(false));
// TOGGLE MOBILE FILTER END

// CHECKBOX CLICKING & RESULT VALUE START
document.querySelectorAll(".checkbox").forEach((checkbox) => {
  checkbox.addEventListener("click", (e) => {
    let closestParent = e.target.closest(".checkbox");
    let input = closestParent.querySelector('input[type="checkbox"]');
    let filterName = closestParent.parentNode.getAttribute("data-filter");
    e.target.checked = true;
    
    // Check if 'All' is selected and reset all filters
    if (input && input.id === "deal_all") {
      document.querySelectorAll(".checkbox input").forEach((checkboxInput) => {
        checkboxInput.checked = checkboxInput.id === "deal_all";
      });
      changeListOrder("unselected", "All", DefaultCards);
      return; // Exit the function to prevent further filtering
    }

    const isPaymentCheckboxes =
      closestParent.parentNode.getAttribute("data-filter") === "payment";
    
    closestParent.parentNode.querySelectorAll("input").forEach((item) => {
      if (isPaymentCheckboxes) {
        e.target.checked = false;
        item.checked = false;
      }
      if (item !== input) {
        e.target.checked = false;
        item.checked = false;
      }
    });

    if (input) {
      if (!input.checked) {
        input.checked = true;
        changeListOrder(filterName, input.value, DefaultCards);
      } else if (input.checked) {
        input.checked = false;
        changeListOrder(filterName, "unselected", DefaultCards);
      }
    }
  });
});
// CHECKBOX CLICKING & RESULT VALUE END




// FILTER RANGE START
const range = document.getElementById("range");
const rangeValue = document.getElementById("value");
const base = getComputedStyle(document.body).getPropertyValue("--score_base");
const second = getComputedStyle(document.body).getPropertyValue("--score_second");

function initialRange(value) {
  rangeValue.innerHTML = value;
  updateScoreValue(value);
}

function updateScoreValue(value) {
  const deg = value * 36;
  const rangePercentage = (value / 10) * 90 + "%";
  const trackBallColor = value >= 10 ? second : base;
  document.documentElement.style.setProperty("--score_deg", deg + "deg");
  document.documentElement.style.setProperty("--score_range", rangePercentage);
  document.documentElement.style.setProperty("--score_trackball", trackBallColor);
}

initialRange(range?.value);

range?.addEventListener("input", () => {
  const value = range.value;
  updateScoreValue(value);
  rangeValue.innerHTML = Math.floor(value);
  changeListOrder("score", rangeValue.innerHTML, DefaultCards);
});
// FILTER RANGE END

const defaults = [
  { star: null },
  { score: 10 },
  { alphabetical: null },
  { payment: "All" },
  { title: null },
];

let starValue;
let scoreValue;
let sortValue;
let paymentValue;
let titleValue;


function changeListOrder(filterName, value, DefaultCards) {
  const main = document.querySelector('main');
  main.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (filterName === "unselected") {
    defaults[0].star = null;
    defaults[2].alphabetical = null;
    defaults[4].title = null;
  }

  filterName === "star" && Object.assign(defaults[0], { star: parseInt(value) });
  filterName === "score" && Object.assign(defaults[1], { score: parseInt(value) });
  filterName === "alphabetical" && Object.assign(defaults[2], { alphabetical: value });
  filterName === "payment" && Object.assign(defaults[3], { payment: value });
  filterName === "title" && Object.assign(defaults[4], { title: value });

  starValue = defaults[0].star;
  scoreValue = defaults[1].score;
  sortValue = defaults[2].alphabetical;
  paymentValue = defaults[3].payment;
  titleValue = defaults[4].title;

  let latestCards = DefaultCards;

  const paymentKeywords = {
    "All": "All",
    "Credit card": "credit card",
    "Debit card": "debit card",
    "QR code": "qr code",
    "Pay later": "pay later",
  };

  const titleKeywords = {
    "All": "All",
    "10%": "10%",
    "15%": "15%",
    "20%": "20%",
    "25%": "25%",
  };

  const paymentKeyword = paymentKeywords[paymentValue];
  const titleKeyword = titleKeywords[titleValue];

  if (filterName === "score" || !!scoreValue) {
    latestCards = latestCards.filter(
      (c) => parseFloat(c.querySelector(".score_num").innerHTML) < scoreValue + 0.1
    );
  }

  if (filterName === "star" || !!starValue) {
    latestCards = latestCards.filter((c) => {
      const starRating = parseFloat(c.querySelector(".star").getAttribute("data-rating"));
      return !isNaN(starValue)
        ? starRating <= starValue + 0.1 && starRating > starValue - 1
        : true;
    });
  }

  if (filterName === "payment" || !!paymentKeyword) {
    latestCards = latestCards.filter((c) => {
      const card_titles = [...c.querySelectorAll(".pros p")]
        .map((p) => p.innerHTML.toLowerCase())
        .join(" ");
      return paymentKeyword !== "All" ? card_titles.includes(paymentKeyword.toLowerCase()) : true;
    });
  }

  if (filterName === "title" || !!titleKeyword) {
    latestCards = latestCards.filter((c) => {
      const card_title = c.querySelector(".card_title").innerHTML.toLowerCase();
      return titleKeyword !== "All" ? card_title.includes(titleKeyword.toLowerCase()) : true;
    });
  }

  if (filterName === "sort" || !!sortValue) {
    latestCards = latestCards.sort((cardA, cardB) => {
      const getBrandName = (card, className) =>
        card.querySelector(className).innerHTML.toLowerCase();
      const brandNameA = getBrandName(
        cardA,
        cardA.querySelector(".brand_name_mb").style.display === "block"
          ? ".brand_name_mb"
          : ".brand_name"
      );
      const brandNameB = getBrandName(
        cardB,
        cardB.querySelector(".brand_name_mb").style.display === "block"
          ? ".brand_name_mb"
          : ".brand_name"
      );
      const scoreA = parseFloat(cardA.querySelector(".score_num").innerHTML);
      const scoreB = parseFloat(cardB.querySelector(".score_num").innerHTML);

      if (sortValue === "Alphabetisch von A bis Z") {
        return brandNameA.localeCompare(brandNameB);
      } else if (sortValue === "Alphabetisch von Z bis A") {
        return brandNameB.localeCompare(brandNameA);
      } else if (sortValue === "Am meisten bewertet") {
        return scoreB - scoreA;
      }

      return 0;
    });
  }

  listing.innerHTML = "";
  latestCards.forEach((card) => listing.appendChild(card));

  if (listing.innerHTML === "") {
    const noResultElement = document.createElement("h4");
    noResultElement.classList = "filter_no_result";
    noResultElement.innerHTML = "No results found";
    listing.style.position = "relative";
    listing.appendChild(noResultElement);
  }
}

// Default action to show all cards on page refresh
window.onload = function () {
  changeListOrder("unselected", "All", DefaultCards);
};
