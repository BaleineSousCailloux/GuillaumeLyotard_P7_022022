import recettes from "../data/recipes.js";
import recetteTemplate from "./recetteTemplate.js";

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

        //class & id
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
        recetteCard.querySelector(".template__recette__item__details__header__title").innerText = this.nom;
        recetteCard.querySelector(".template__recette__item__details__header__title").innerText = this.nom;
        return recetteCard;
    }
}
console.log(new Recette(recettes[0]).ingredients);
console.log(recettes[0].ingredients);

let recettesArray = []
recettes.forEach(recette => {
    recettesArray.push(new Recette(recette))
})
console.log(recettesArray)

recettesArray.forEach(recette => {

    document.getElementById("result-section").appendChild(recette.createRecetteCard());
})

/*///// Ajouter ... au texte de description si trop long  ///////
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
//////////////////////////////////////////////////////////////////////////*/