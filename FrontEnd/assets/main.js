const menu = document.getElementById("menu");
const token = sessionStorage.getItem("token");

// #menu categories list
const categoriesIds = [{
        id: "all",
        name: "Tous"
    },
    {
        id: "1",
        name: "Objets"
    },
    {
        id: "2",
        name: "Appartements"
    },
    {
        id: "3",
        name: "Hôtels & restaurants"
    }
];

// Create #menu categories buttons
function createCategories() {
    categoriesIds.forEach((category) => {
        const li = document.createElement("li");
        li.id = category.id;
        li.textContent = category.name;
        menu.appendChild(li);
    });
}
createCategories();

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
        li.addEventListener("click", function(e) {
            e.preventDefault();
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
    login.textContent = "logout";
    login.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.clear();
        window.location.reload();
    })
}

function loggedIn() {
    return token !== null;
}

// Display and delete images in modalAdmin
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
        galleryTrash.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Trash clicked")
            // Get index from selected modalCard 
            const indexCard = Array.from(modalCards.children).indexOf(setModalCard);

            modalCards.removeChild(setModalCard);

            deleteImageAPI(work.id);

            // Remove selected (trash icon) image from modalAdmin
            worksData.splice(indexCard, 1);
        });

        modalCards.appendChild(setModalCard);
        setModalCard.appendChild(galleryTrash);
        setModalCard.appendChild(galleryImage);
        setModalCard.appendChild(galleryLegend);
    })
}

// Remove selected image from API
function deleteImageAPI(imageId) {
    fetch(`http://localhost:5678/api/works/${imageId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (response.ok) {
                console.log("Image ID ${imageId} successfully removed from the API.");
            } else {
                console.error("Error deleting image from the API");
            }
        })
        .catch((error) => {
            console.error("Error deleting image from API : ", error);
        });
}


const imageUploadForm = document.getElementById("imageUploadForm");

imageUploadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(imageUploadForm);

    // Get form values
    const title = formData.get("name");
    const categoryName = formData.get("category"); // Obtenir la catégorie en tant que chaîne
    const imageFile = formData.get("image");
    console.log("imageFile: ", imageFile);

    // Find  matching ID in categoriesIds
    const selectedCategory = categoriesIds.find((category) => category.name === categoryName);

    // Check the category
    if (selectedCategory) {
        const categoryId = selectedCategory.id;

        // Create a FormData object to send the data
        const data = new FormData();
        data.append("title", title);
        data.append("image", imageFile, imageFile.name);
        data.append("category", categoryId);

        // Check values
        console.log("Title:", title);
        console.log("Category:", categoryId);
        console.log("Image file name:", imageFile.name);

        // Call addImageAPI function to add image to API
        addImageAPI(data);
    } else {
        console.error("Category is invalid.");
    }
});


const editBar = document.querySelector(".editBar");
const buttonModifier = document.querySelectorAll(".ButtonModifier");

// Display elements if logged or not
if (loggedIn()) {
    editBar.style.display = "flex";
    logoutButton();
    buttonModifier.forEach(button => {
        button.style.display = "flex";
    })
    menu.style.display = "none";
    displayImagesInModal();
} else {
    editBar.style.display = "none";
    buttonModifier.forEach(button => {
        button.style.display = "none";
    })
    menu.style.display = "flex";
};

// Select fileInput
const fileInput = document.getElementById("image");
console.log("File Input: ", fileInput);

// Select imagePreview
const imagePreview = document.getElementById("imagePreview");

// Listen fileInput change event
fileInput.addEventListener("change", showPreview);

// Define showPreview function
function showPreview(event) {
    if (event.target.files.length > 0) {
        const src = URL.createObjectURL(event.target.files[0]);
        const preview = document.getElementById("imagePreview");
        const cardAddphoto = document.getElementById("cardAddphoto");
        const imagePreviewContainer = document.getElementById("imagePreviewContainer");

        // Display imagePreview
        preview.src = src;
        preview.style.display = "block";

        // Hide children of cardAddphoto (text and icon)
        var children = cardAddphoto.children;
        for (var i = 0; i < children.length; i++) {
            if (children[i].id !== "imagePreview") {
                children[i].style.display = "none";
            }
        }
        imagePreviewContainer.style.display = "flex";
    }
}

// Select button "+ Ajouter photo"
const addButton = document.getElementById("imageAddButton");

// Trigger on the fileInput
addButton.addEventListener('click', function(e) {
    e.preventDefault();
    fileInput.click();
});

// Function to add an image to API
function addImageAPI(formData) {
    fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (response.ok) {
                console.log("Image successfully added to API.");
            } else {
                console.error("Error adding image to API.");
            }
        })
        .catch((error) => {
            console.error("Error adding image to API : ", error);
        });
}