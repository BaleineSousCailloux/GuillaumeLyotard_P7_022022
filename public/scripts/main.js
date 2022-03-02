import recettes from "../data/recipes.js";
import recetteTemplate from "./templates/recetteTemplate.js";

/*
export default `
<div>
</div>
`
*/

class Recette {
    constructor({ id, name, servings, ingredients, time, description, appliance, ustensils }) {
        this.id = id;
        this.nom = name;
        this.parts = servings;
        this.ingredients = ingredients;
        this.temps = time;
        this.description = description;
        this.appareil = appliance;
        this.ustensiles = ustensils;
    }
    //methodes (fonctions intégrées)
    ellipsis() {
        //Récupération du texte
        let text = this.description;
        //On remplace les suites d'espaces par un espace puis on coupe les X premiers caractères
        text = text.replace(/  +/g, ' ');
        text = text.substr(0, 200);
        //On coupe à nouveau pour enlever le dernier mot si il a été coupé en 2
        text = text.substr(0, Math.min(text.length, text.lastIndexOf(" ")));
        //On retourne le texte coupé avec les 3 points à la fin
        return text + " ...";
    }
    createRecetteCard() {
        const recetteCard = document.createElement("article");
        recetteCard.classList.add("template__recette__item");
        recetteCard.setAttribute("id", "recette");
        recetteCard.innerHTML = recetteTemplate;
        // insertion des éléments souhaités
        let nomPhoto = "";
        nomPhoto = this.nom;
        nomPhoto = nomPhoto.replace(/,/g, '');
        nomPhoto = nomPhoto.replace(/'/g, ' ');
        nomPhoto = nomPhoto.replace(/ /g, '-');
        nomPhoto = nomPhoto.trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036F\u1DC0-\u1DFF\u1AB0-\u1AFF]+/g, '');

        recetteCard.querySelector(".template__recette__item__thumbnail").innerHTML = `
        <img class="template__recette__item__thumbnail__img" id="recette-thumbnail"
        src="./public/assets/Photos/${nomPhoto}.jpg" alt="${this.nom}" />`;
        recetteCard.querySelector(".template__recette__item__details__header__title").innerText = this.nom;
        recetteCard.querySelector(".template__recette__item__details__header__infos__time").innerText = this.temps + " min";
        const listeIngredients = recetteCard.querySelector(".template__recette__item__details__content__ingredients");
        const ingredients = this.ingredients;
        ingredients.forEach(ingredient => {
            const ingredientDetail = document.createElement("li");
            ingredientDetail.classList.add("template__recette__item__details__content__ingredients__ingredient");
            const nomIngredient = document.createElement("span");
            nomIngredient.classList.add("template__recette__item__details__content__ingredients__ingredient__name");
            nomIngredient.setAttribute("data-ingredient", ingredient.ingredient);
            nomIngredient.innerText = ingredient.ingredient;
            ingredientDetail.appendChild(nomIngredient);
            if (ingredient.quantite || ingredient.quantity) {
                const quantiteIngredient = document.createElement("span");
                quantiteIngredient.classList.add("template__recette__item__details__content__ingredients__ingredient__quantity");
                let quantite = ""
                if (ingredient.quantite) {
                    quantite = ingredient.quantite;
                } else {
                    quantite = ingredient.quantity;
                }
                if (ingredient.unit) {
                    quantiteIngredient.innerText = ": " + quantite + " " + ingredient.unit;
                } else {
                    quantiteIngredient.innerText = ": " + quantite;
                }
                let quantiteIngredientCorrection = quantiteIngredient.textContent.replace('.', ',');
                quantiteIngredient.innerText = quantiteIngredientCorrection;
                ingredientDetail.appendChild(quantiteIngredient);
            }
            listeIngredients.appendChild(ingredientDetail);
        })
        recetteCard.querySelector(".template__recette__item__details__content__description").innerText = this.ellipsis();
        return recetteCard;
    }
}

//// Fonction de mise en forme des éléments des modules
const moduleElementCapitale = (element) => {
    if (typeof element !== 'string') {
        return '';
    } else {
        let elementModifie = element.trim().toLowerCase();
        elementModifie = elementModifie.replaceAll(/[.,!?]/g, "");
        return elementModifie.charAt(0).toUpperCase() + elementModifie.slice(1);
    }
}

//// Creation des tableaux
let recettesListe = [];
let ingredientsListe = [];
let appareilsListe = [];
let ustensilesListe = [];
recettes.forEach(recette => {
    recettesListe.push(new Recette(recette));
    recette.ingredients.forEach(ingredient => {
        const ingredientModifie = moduleElementCapitale(ingredient.ingredient)
        if (!ingredientsListe.includes(ingredientModifie)) {
            ingredientsListe.push(ingredientModifie)
        }
    })
    const appareilModifie = moduleElementCapitale(recette.appliance)
    if (!appareilsListe.includes(appareilModifie)) {
        appareilsListe.push(appareilModifie)
    }
    recette.ustensils.forEach(ustensile => {
        const ustensileModifie = moduleElementCapitale(ustensile)
        if (!ustensilesListe.includes(ustensileModifie)) {
            ustensilesListe.push(ustensileModifie);
        }
    })
})

//// Tri par ordre alphabetique des éléments
ingredientsListe.sort();
appareilsListe.sort();
ustensilesListe.sort();

//// Insertion des éléments
let ingredient = "ingredient";
let appareil = "appareil";
let ustensile = "ustensile";
recettesListe.forEach(recette => {
    document.getElementById("result-section").appendChild(recette.createRecetteCard());
})
const createItemsForModule = (list, itemType) => {
    list.forEach(item => {
        const domElement = document.createElement("li");
        domElement.classList.add(`search__modules__container__module__list__${itemType}`);
        domElement.setAttribute(`data-${itemType}`, item);
        domElement.innerHTML = item;
        document.getElementById(`list-${itemType}`).appendChild(domElement);
    })
}
createItemsForModule(ingredientsListe, ingredient);
createItemsForModule(appareilsListe, appareil);
createItemsForModule(ustensilesListe, ustensile);


/*ingredientsListe.forEach(ingredient => {
    const ingredientPourListe = document.createElement("li");
    ingredientPourListe.classList.add("search__modules__container__module__list__ingredient");
    ingredientPourListe.setAttribute("data-ingredient", ingredient);
    ingredientPourListe.innerHTML = ingredient;
    document.getElementById("list-ingredient").appendChild(ingredientPourListe);
})
appareilsListe.forEach(appareil => {
    const appareilPourListe = document.createElement("li");
    appareilPourListe.classList.add("search__modules__container__module__list__appareil");
    appareilPourListe.setAttribute("data-appareil", appareil);
    appareilPourListe.innerHTML = appareil;
    document.getElementById("list-appareil").appendChild(appareilPourListe);
})
ustensilesListe.forEach(ustensile => {
    const ustensilePourListe = document.createElement("li");
    ustensilePourListe.classList.add("search__modules__container__module__list__ustensile");
    ustensilePourListe.setAttribute("data-ustensile", ustensile);
    ustensilePourListe.innerHTML = ustensile;
    document.getElementById("list-ustensile").appendChild(ustensilePourListe);
})

////// Ajouter ... au texte de description si trop long  ///////
let description = document.querySelectorAll(".template__recette__item__details__content__description");

const ellipsis = (p) => {
    //Récupération du texte
    let text = p.textContent;
    //On remplace les suites d'espaces par un espace puis on coupe les 220 premiers caractères
    text = text.replace(/  +/g, ' ');
    text = text.substr(0, 220);
    //On coupe à nouveau pour enlever le dernier mot si il a été coupé en 2
    text = text.substr(0, Math.min(text.length, text.lastIndexOf(" ")));
    //On injecte le texte coupé avec les 3 points à la fin
    p.textContent = text + " ...";
}

description.forEach(recette => {
    ellipsis(recette)
});

//console.log(new Recette(recettes[0]).ingredients);
//console.log(recettes[0].ingredients);
//////////////////////////////////////////////////////////////////////////*/