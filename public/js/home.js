$.get("http://localhost:3000/featuredList", function (featured) {
  for (let i = 0; i < featured.length; i++) {
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

$.get("http://localhost:3000/books", function (books) {
  const currentDate = Date.parse(new Date().toDateString());
  for (let i = 0; i < books.length; i++) {
    let date = Date.parse(books[i].productDetails.publicationDate.replaceAll('/', '-'));
    if (date > currentDate) {
      $(".preorderList").append(`<img src="${books[i].image}" onclick="location.href='/book/${books[i].title}/${books[i].author}'" alt="preorder book">`
      );
    }
  }
});