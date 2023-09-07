
const gallery = document.querySelector(".gallery");

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((works) => {

    for (let i = 0; i < works.length; i++) {
        const figure = document.createElement("figure");
        const galleryImage = document.createElement("img");
        galleryImage.src = works[i].imageUrl;

        const galleryLegend = document.createElement("figcaption");
        galleryLegend.innerText = works[i].title;

        figure.appendChild(galleryImage);
        figure.appendChild(galleryLegend);

        gallery.appendChild(figure);
    }
});
