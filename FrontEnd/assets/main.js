const gallery = document.querySelector(".gallery");
const menu = document.getElementById("menu");
const galleryCategories = menu.querySelectorAll("li[id]");

let worksData = [];
let categoriesId = [];
let selectedCategoryId = "all";

// Get categories data
function fetchCategories() {
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
      categoriesId = categories;
      categoriesEventListeners();
    });
}

// Get works data
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((works) => {
  worksData = works;

  // Display all images
  selectedCategoryId = "all" ;
  displayImagesByCategory();
});

// Display images for selected category
function displayImagesByCategory() {
  gallery.innerHTML = "";

  worksData.forEach((work) => {
    if (selectedCategoryId === "all" || work.categoryId === selectedCategoryId) {
      const figure = document.createElement("figure");

      const galleryImage = document.createElement("img");
      galleryImage.src = work.imageUrl;

      const galleryLegend = document.createElement("figcaption");
      galleryLegend.innerText = work.title;

      gallery.appendChild(figure);
      figure.appendChild(galleryImage);
      figure.appendChild(galleryLegend);
    }
  });
}

// Categories event listener function
function categoriesEventListeners() {
  galleryCategories.forEach((li) => {
    li.addEventListener("click", function () {
      const clickedCategoryId = li.id;
  
      if (clickedCategoryId === "all") {
        selectedCategoryId = "all";
      } else {
        const matchedCategory = categoriesId.find((category) => category.id.toString() === clickedCategoryId);
        if (matchedCategory) {
          selectedCategoryId = matchedCategory.id;
        }
      }
  
      displayImagesByCategory();
    });
  });
}

fetchCategories();
