// factory of a photographer card in index page
this.indexCardFactory = (indexCard) => {
    this.getCard = () => {
        const newPhotographer = document.createElement("article");
        newPhotographer.classList.add("photographer");
        newPhotographer.setAttribute("aria-label", `carte du photographe ${indexCard.name}`);
        newPhotographer.innerHTML = `
        <a href="./pages/photographe.html?id=${indexCard.id}" class="photographer__card" tabindex="6" aria-label="se rendre sur la page de ${indexCard.name}">
            <img class="photographer__card__img" src="./public/images/Photos/Photographers_ID_Photos/${indexCard.portrait}" alt="portrait de ${indexCard.name}" aria-label="portrait de ${indexCard.name}" />
            <h2 class="photographer__card__name" aria-label="nom du photographe">${indexCard.name}</h2>
        </a>
        <div class="photographer__legend" tabindex="6" aria-label="informations sur ${indexCard.name}">
            <h3 class="photographer__legend__city" aria-label="sa localisation">${indexCard.city}, ${indexCard.country}</h3>
            <p class="photographer__legend__slogan" aria-label="son slogan">${indexCard.tagline}</p>
            <p class="photographer__legend__price" aria-label="son prix">${indexCard.price}€/jour</p>
        </div>
        <div class="photographer__legend__tags" tabindex="6" aria-label="ses mots-clef, via lequels vous pouvez lancer une recherche"></div>
        `;

        // add tags to photographer card
        indexCard.tags.forEach(tag => {
            const newTag = document.createElement("span");
            newTag.classList.add("photographer__legend__tags__tag");
            newTag.classList.add("tag");
            newTag.setAttribute("data-tag", tag);
            newTag.setAttribute("aria-label", tag);
            newTag.innerHTML = `#${tag}`;
            newPhotographer.getElementsByClassName("photographer__legend__tags")[0].appendChild(newTag);
        })
        return newPhotographer;
    }
    return this;
};