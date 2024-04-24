$(document).ready(function() {
  let purchaseOptions = document.getElementsByClassName("purchaseButtons");
  purchaseOptions[0].classList.add("active");
  changePurchaseTitleAndPrice(purchaseOptions[0]);

  document.getElementById("overviewTextCard").innerHTML = `<p>${document.getElementById("overviewText").innerText}</p>`;
});

function changePurchaseTitleAndPrice(option) {
  document.getElementById("purchaseOptionTitle").innerText = option.getElementsByClassName("option")[0].innerText;
  document.getElementById("purchaseOptionPrice").innerText = option.getElementsByClassName("price")[0].innerText;
}

function changePurchaseOption(option) {
  let purchaseOptions = document.getElementsByClassName("purchaseButtons");
  Array.prototype.forEach.call(purchaseOptions, (element) => {
    element.classList.remove("active");
  });
  option.classList.add("active");
  changePurchaseTitleAndPrice(option);
}