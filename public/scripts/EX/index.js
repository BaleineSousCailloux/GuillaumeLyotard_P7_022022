// variables
let listTags = [];
let tagsZoneDom = document.getElementById("tagsList");
let tagsPhotographerDom = document.querySelector(".photographer__legend__tags");


// async functions json file data extract
const fetchData = async () => {
    const res = await fetch("./public/data/FishEyeData.json");
    const data = await res.json();
    return data;
};
const getPhotographersData = async () => {
    const data = await fetchData();
    return data.photographers;
}


// function to create tags list with json data
const getTagsListData = (photographers) => {
    photographers.forEach(photographer => {
        photographer.tags.forEach(tag => {
            if (!listTags.includes(tag)) {
                listTags.push(tag)
            }
        })
    })
    return listTags;
}


// function to create header tags list
const getHeaderTagsList = (listTags) => {
    let self = this;
    listTags.forEach(tag => {
        const instance = self.headerTagFactory(tag);
        const newHeaderTag = instance.self.getHeaderTag();
        tagsZoneDom.appendChild(newHeaderTag);

        // click event on a tag
        newHeaderTag.addEventListener("click", e => {
            if (e.target.id == "tag-selected") {
                document.location.href = "index.html";
                document.querySelector("h1").focus();
            } else {
                document.location.href = `index.html?tag=${e.target.getAttribute("data-tag")}`;
            }
        })
    })
}


// function to create photographers cards with json data and tag selection
const getPhotographerCards = (photographers, tagSelected) => {
    let self = this;

    // variable that include only photographers tagged or all photographers if no tag selected
    const filteredPhotographers = photographers.filter(photographer => {
        return !tagSelected || photographer.tags.includes(tagSelected);
    })
    if (tagSelected !== null) {
        document.querySelector("h1").focus();
    }

    // create and insert photographer card
    const container = document.getElementById("photographers");
    container.innerHTML = "";
    filteredPhotographers.forEach(photographer => {
        const instance = self.indexCardFactory(photographer);
        const newCard = instance.self.getCard();
        container.appendChild(newCard);
        // header tags function extend to photographer card tag
        const personnalTags = newCard.querySelectorAll(".photographer__legend__tags__tag");
        Array.from(personnalTags).forEach(personnalTag => {
            personnalTag.addEventListener("click", event => {
                document.location.href = `index.html?tag=${event.target.getAttribute("data-tag")}`
            })
        })
    })
}

// await global function
const init = async () => {
    let self = this;
    const photographers = await getPhotographersData();
    const tagsList = getTagsListData(photographers);

    //url search tag
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let tagUrl = urlParams.get("tag");

    // call header tags list function
    getHeaderTagsList(tagsList);

    // gestion of selected tag and style css
    tagsList.forEach(tag => {
        if (tag == tagUrl) {
            let domCardTag = document.getElementsByClassName(tag)[0];
            if (domCardTag) {
                domCardTag.setAttribute("id", "tag-selected");
                domCardTag.setAttribute("aria-label", `le mot-clef ${tag} est sélectionné`);
            }
        }
    })

    // call photographers cards
    getPhotographerCards(photographers, tagUrl);

    // call keyboard navigation function for tags
    tagsZoneDom = document.getElementById("tagsList");
    tagsPhotographerDom = document.querySelector(".photographer__legend__tags");
    tagsZoneDom.addEventListener("keydown", e => {
        self.enterTagsNav(e, tagsZoneDom);
    })
    tagsPhotographerDom.addEventListener("keydown", e => {
        self.enterTagsNav(e, tagsPhotographerDom);
    })
}

init()