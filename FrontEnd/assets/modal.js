const openAdminModal = document.getElementById("openModalButton");
const openAddModal = document.getElementById("openAddModal");
const modalAdmin = document.getElementById("modalAdmin");
const modalAdd = document.getElementById("modalAdd");
const closeIcon = portfolio.querySelectorAll(".fa-xmark");
const backIcon = modalAdd.querySelector(".fa-arrow-left");

modalAdmin.style.display = "none";
modalAdd.style.display = "none";

openAdminModal.addEventListener("click", (e) => {
    e.preventDefault();
    modalAdmin.style.display = "flex";
});

openAddModal.addEventListener("click", (e) => {
  e.preventDefault();
  modalAdd.style.display = "flex";
  modalAdmin.style.display = "none";
});

closeIcon.forEach(closeIcon => {
  closeIcon.addEventListener ("click", () => {
  modalAdmin.style.display = "none";
  modalAdd.style.display = "none" ;
  });
})

window.addEventListener("click", (e) => {
    if (e.target === modalAdmin) {
      modalAdmin.style.display = "none";
    }
});

backIcon.addEventListener("click", () => {
  modalAdd.style.display = "none";
  modalAdmin.style.display = "flex";
});