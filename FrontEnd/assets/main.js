const menu = document.getElementById("menu");

// #menu categories list
const categoriesIds = [
  { id: "all", name: "Tous" },
  { id: "1", name: "Objets" },
  { id: "2", name: "Appartements" },
  { id: "3", name: "Hôtels & restaurants" }
];

// Create #menu categories buttons
function createCategories () {
categoriesIds.forEach((category) => {
  const li = document.createElement("li");
  li.id = category.id;
  li.textContent = category.name;
  menu.appendChild(li);
});
}
createCategories ();

const gallery = document.querySelector(".gallery");
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
  // selectedCategoryId = "all" ;
  displayImagesByCategory();
  displayImagesInModal();
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


function logoutButton() {
  const login = document.querySelector(".login");
  login.textContent ="logout";
  login.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.clear();
    window.location.reload();
  })
}

function loggedIn() {
  const token = sessionStorage.getItem("token");
  return token !== null;
}


const modalCards = document.getElementById("modalCards");

function displayImagesInModal() {
  modalCards.innerHTML = "";

  worksData.forEach((work) => {
      const setModalCard = document.createElement("div");
      setModalCard.classList.add("modalCard");

      const galleryImage = document.createElement("img");
      galleryImage.src = work.imageUrl;

      const galleryLegend = document.createElement("p");
      galleryLegend.innerText = "éditer";

      const galleryTrash = document.createElement("i");
      galleryTrash.classList.add("fas", "fa-trash-alt");

      modalCards.appendChild(setModalCard);
      setModalCard.appendChild(galleryTrash);
      setModalCard.appendChild(galleryImage);
      setModalCard.appendChild(galleryLegend);
    })
  };



const editBar = document.querySelector(".editBar");
const buttonModifier = document.querySelectorAll(".ButtonModifier");

// Display elements if logged or not
if (loggedIn()) {
  editBar.style.display = "flex";
  logoutButton();
  buttonModifier.forEach(button => {
    button.style.display = "flex";})
  menu.style.display = "none";
  displayImagesInModal();
} 
else {
  editBar.style.display = "none";
  buttonModifier.forEach(button => {
    button.style.display = "none";})
  menu.style.display = "flex";
};


