$.get("http://localhost:3000/featuredList", function (featured) {
  var i;
  for (i = 0; i < featured.length; i++) {
    if (i === 0) {
      $(".carousel-inner").append(`
              <div class="carousel-item active">
                  <img class="d-block w-100" src="${featured[i].banner}" alt="First slide">
              </div>`
      );
      $(".carousel-indicators").append("<li data-target='#carouselExampleIndicators' data-slide-to='0' class='active'></li>");
    } else {
      $(".carousel-inner").append(`
              <div class="carousel-item">
                  <img class="d-block w-100" src="${featured[i].banner}" alt="First slide">
              </div>`
      );
      $(".carousel-indicators").append("<li data-target='#carouselExampleIndicators' data-slide-to='0'></li>");
    }
  }
});