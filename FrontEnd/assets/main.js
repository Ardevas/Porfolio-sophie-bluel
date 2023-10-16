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
const menu = document.getElementById("menu");
function createCategories() {
    categoriesIds.forEach((category) => {
        const li = document.createElement("li");
        // Retrieve id and name from categoriesIds to set id and textContent of li
        li.id = category.id;
        li.textContent = category.name;
        menu.appendChild(li);
    });
}
createCategories();

// #menu categories buttons event listeners
const menuItems = document.querySelectorAll("#portfolio li");
let activeMenuItem = null;

menuItems.forEach((menuItem) => {
    menuItem.addEventListener("click", () => {
        // Remove "active" class from the previously active menu item
        if (activeMenuItem) {
            activeMenuItem.classList.remove("active");
        }

        // Add "active" class to the clicked menu item
        menuItem.classList.add("active");

        // Set the current clicked menu item as the active one
        activeMenuItem = menuItem;
    });
});

// Simulate a click on "All" filter when main page loads
const tousFilter = document.getElementById("all");
tousFilter.click();

// Empty array, store working data and images
let worksData = [];
// Same as up, store categories id
let categoriesId = [];
// Define starting selectedCategoryId
let selectedCategoryId = "all";

// Function to fetch categories data from API 
async function fetchCategories() {
    try {
        // Fetch categories data from API
        const response = await fetch("http://localhost:5678/api/categories");
        // Convert response to JSON
        const categories = await response.json();
        // Store categories data in categoriesId who's an array
        categoriesId = categories;
        categoriesEventListeners();
    } catch (error) {
        // If an error occurs, log it in the console
        console.error("An error occurred:", error);
    }
}

fetchCategories();

// Function to fetch works data from API
async function fetchWorksData() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        worksData = works;
        // Display all images
        displayImagesByCategory();
        displayImagesInModal();
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

fetchWorksData();

// Display images by category function
const gallery = document.querySelector(".gallery");
function displayImagesByCategory() {
    // Empty gallery
    gallery.innerHTML = "";

    // Display images for selected category
    worksData.forEach((work) => {
        if (selectedCategoryId === "all" || work.categoryId === selectedCategoryId) {
            const figure = document.createElement("figure");
            figure.setAttribute("data-image-id", work.id);

            const galleryImage = document.createElement("img");
            // Set image source
            galleryImage.src = work.imageUrl;

            const galleryLegend = document.createElement("figcaption");
            // Set image title
            galleryLegend.innerText = work.title;

            gallery.appendChild(figure);
            figure.appendChild(galleryImage);
            figure.appendChild(galleryLegend);
        }
    });
}

// Categories event listener function
const galleryCategories = menu.querySelectorAll("li[id]");
function categoriesEventListeners() {
    galleryCategories.forEach((li) => {
        li.addEventListener("click", function(e) {
            e.preventDefault();
            const clickedCategoryId = li.id;

            // If "All" is clicked, set selectedCategoryId to "all"
            if (clickedCategoryId === "all") {
                selectedCategoryId = "all";
            // Find matching category in categoriesId
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

// Logout function
function logoutButton() {
    const login = document.querySelector(".login");
    // Change textContent of login button
    login.textContent = "logout";
    login.addEventListener("click", (e) => {
        e.preventDefault();
        // Clear sessionStorage and reload page
        sessionStorage.clear();
        window.location.reload();
    });
}

// Check if user is logged in
const token = sessionStorage.getItem("token");
function loggedIn() {
    // Return true if token is not null
    return token !== null;
}

// Display and delete images in modalAdmin
const modalCards = document.getElementById("modalCards");

function displayImagesInModal() {
    modalCards.innerHTML = "";

    worksData.forEach((work) => {
        const setModalCard = document.createElement("figure");
        setModalCard.classList.add("modalCard");
        setModalCard.setAttribute("data-image-id", work.id);

        const galleryImage = document.createElement("img");
        galleryImage.src = work.imageUrl;

        const galleryLegend = document.createElement("p");
        galleryLegend.innerText = "éditer";

        const galleryTrash = document.createElement("i");
        galleryTrash.classList.add("fas", "fa-trash-alt");
        galleryTrash.addEventListener("click", (e) => {
            e.preventDefault();
            const imageId = work.id;
            deleteImageFromModal(imageId, e);
        });
        modalCards.appendChild(setModalCard);
        setModalCard.appendChild(galleryTrash);
        setModalCard.appendChild(galleryImage);
        setModalCard.appendChild(galleryLegend);
    });
}

// Delete image function from modalAdmin and API
async function deleteImageFromModal(imageId, e) {
    try {
        const index = worksData.findIndex((work) => work.id === imageId);

        if (index !== -1) {
            worksData.splice(index, 1); // Remove image from worksData array

            const modalCard = modalCards.querySelector(`[data-image-id="${imageId}"]`);
            modalCard.remove(); // Remove image from modalAdmin

            const galleryFigure = gallery.querySelector(`[data-image-id="${imageId}"]`);
            galleryFigure.remove(); // Remove image from gallery
        }

        await deleteImageAPI(imageId);

    } catch (error) {
        console.error("Error deleting image : ", error);
    }
    e.preventDefault();
}

// Function to delete an image from API
async function deleteImageAPI(imageId) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Error removing image from API : ", error);
    }
}

// Create confirmation message DOM element
const confirmationMessage = document.createElement("div");
confirmationMessage.id = "confirmationMessage"; // Set id
const modalForm = document.getElementById("modalForm"); 
modalForm.appendChild(confirmationMessage);

// Confirmation message for image upload to API
function showConfirmationMessage(message, imageUrl, title) {
    const confirmationMessage = document.getElementById("confirmationMessage");
    confirmationMessage.textContent = message; // Set message content
    confirmationMessage.style.display = "flex"; // Display message

    // Display a message for X seconds
    setTimeout(function() {
        confirmationMessage.style.display = "none";
    }, 4000);

    // Update gallery
    updateGallery(imageUrl, title);

    // Update modalAdmin
    fetchWorksData();
}

// Update main gallery with new image
function updateGallery(imageUrl, title) {
    const gallery = document.querySelector(".gallery");

    // Create figure and legend
    const newFigure = document.createElement("figure");

    const newImage = document.createElement("img");
    newImage.src = imageUrl; // Set image source

    const newLegend = document.createElement("figcaption");
    newLegend.innerText = title; // Set image title

    // Add new image to the DOM
    newFigure.appendChild(newImage);
    newFigure.appendChild(newLegend);
    gallery.appendChild(newFigure);
}

// Function to restore the content of "Ajouter une photo" card
function restoreCardAddphotoContent() {
    const cardAddphoto = document.getElementById("cardAddphoto");
    const children = cardAddphoto.children;

    for (let i = 0; i < children.length; i++) { 
        if (children[i].id !== "imagePreview") { // If child is not imagePreview
            children[i].style.display = "flex"; // Display it
        }
    }
    const imageInput = document.getElementById("image");
    imageInput.style.display = "none"; // Hide image input
}

const imageUploadForm = document.getElementById("imageUploadForm");

imageUploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(imageUploadForm);

    // Get form values
    const title = formData.get("name");
    const categoryName = formData.get("category");
    const imageFile = formData.get("image");

    // Find matching ID in categoriesIds
    const selectedCategory = categoriesIds.find((category) => category.name === categoryName);

    // Check the category
    if (selectedCategory) {
        const categoryId = selectedCategory.id;

        // Create a FormData object to send the data
        const data = new FormData();
        data.append("title", title); // Add title to data
        data.append("image", imageFile, imageFile.name); // Add image to data
        data.append("category", categoryId); // Add category to data

        // Call addImageAPI function to add image to API
        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                body: data,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                showConfirmationMessage("L'image a été ajoutée avec succès.", URL.createObjectURL(imageFile), title); 
                displayImagesInModal();

                // Clear the form and reset the image preview
                imageUploadForm.reset();
                document.getElementById("imagePreview").src = "";
                document.getElementById("imagePreview").style.display = "none";
                titleInput.value = "";
                categoryInput.value = "";

                // Restore the content of the "Ajouter une photo" card
                restoreCardAddphotoContent();
            } else {
                console.error("Error adding image to API.");
            }
        } catch (error) {
            console.error("Error adding image to API: ", error);
        }
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

// Select imagePreview
const imagePreview = document.getElementById("imagePreview");

// Listen fileInput change event
fileInput.addEventListener("change", showPreview);

// Define showPreview function
function showPreview(event) {
    if (event.target.files.length > 0) {
        const selectedFile = event.target.files[0];

        if (selectedFile.size < 4000000) {
            const src = URL.createObjectURL(selectedFile);
            const preview = document.getElementById("imagePreview");
            const cardAddphoto = document.getElementById("cardAddphoto");
            const imagePreviewContainer = document.getElementById("imagePreviewContainer");

            // Display imagePreview
            preview.src = src;
            preview.style.display = "block";

            // Hide children cardAddphoto text and icon
            const children = cardAddphoto.children;
            for (i = 0; i < children.length; i++) {
                if (children[i].id !== "imagePreview") {
                    children[i].style.display = "none";
                }
            }
            imagePreviewContainer.style.display = "flex";
        } else {
            alert("Le fichier est trop volumineux. Veuillez sélectionner un fichier de moins de 4 Mo.");
            event.target.value = "";
        }
    }
}

// Select button "+ Ajouter photo"
const addButton = document.getElementById("imageAddButton");

// Trigger on the fileInput
addButton.addEventListener("click", function(e) {
    e.preventDefault();
    fileInput.click();
});

const imageInput = document.getElementById("image");
const titleInput = document.querySelector(".title");
const categoryInput = document.getElementById("category");
const button = document.querySelector(".buttonSubmit");

// Function to check if all required fields are filled
function checkFields() {
    const imageFilled = imageInput.files.length > 0;
    const titleFilled = titleInput.value.trim() !== "";
    const categoryFilled = categoryInput.value.trim() !== "";

    // Enable color on the "Valider" button if all fields are filled, otherwise, disable it
    if (imageFilled && titleFilled && categoryFilled) {
        button.classList.add("active");
    } else {
        button.classList.remove("active");
    }
}

// Add event listeners to input fields
imageInput.addEventListener("change", checkFields);
titleInput.addEventListener("input", checkFields);
categoryInput.addEventListener("input", checkFields);

// Initially, check if fields are filled
checkFields();

// Check if file is valid
fileInput.addEventListener("change", function (e) {
    const selectedFile = fileInput.files[0];

    if (selectedFile) {
        // Check the file type (only jpg and png are allowed)
        if (!/\.(jpg|jpeg|png)$/i.test(selectedFile.name)) {
            alert("Veuillez sélectionner un fichier .jpg ou .png valide.");
            // Erase the file input field (clear form)
            imageUploadForm.reset();
            return;
        }

        // Check the file size (less than 4 Mo)
        if (selectedFile.size > 4194304) {
            alert("La taille du fichier ne doit pas dépasser 4 Mo.");
            // Erase the file input field (clear form)
            imageUploadForm.reset();
            return;
        }
    }
});