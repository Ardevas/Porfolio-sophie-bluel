const openAdminModal = document.getElementById("openModalButton");
const openAddModal = document.getElementById("openAddModal");
const modalAdmin = document.getElementById("modalAdmin");
const modalAdd = document.getElementById("modalAdd");
const modalCard = document.getElementById("modalCards").querySelector(".modalCard");
const closeIcon = portfolio.querySelectorAll(".fa-xmark");
const backIcon = modalAdd.querySelector(".fa-arrow-left");

// Modals initial display
modalAdmin.style.display = "none";
modalAdd.style.display = "none";

// Modals opening function
openAdminModal.addEventListener("click", (e) => {
    e.preventDefault();
    modalAdmin.style.display = "flex";
});
openAddModal.addEventListener("click", (e) => {
  e.preventDefault();
  modalAdd.style.display = "flex";
  modalAdmin.style.display = "none";
});

// Modals close and back functions
closeIcon.forEach(closeIcon => {
  closeIcon.addEventListener ("click", () => {
  modalAdmin.style.display = "none";
  modalAdd.style.display = "none" ;
  });
})
backIcon.addEventListener("click", () => {
    modalAdd.style.display = "none";
    modalAdmin.style.display = "flex";
  });

// ModalAdmin close when click outside of it
window.addEventListener("click", (e) => {
    if (e.target === modalAdmin) {
      modalAdmin.style.display = "none";
    }
});

// const trashIcon = modalCard.querySelectorAll(".fa-trash-can");

// trashIcon.addEventListener("click", (e) => {

// })