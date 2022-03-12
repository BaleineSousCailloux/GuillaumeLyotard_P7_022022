import recetteTemplate from "./templates/recetteTemplate.js";
import Utils from "./Utils.js";

export default class Recette {
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
        recetteCard.classList.add(this.id);
        recetteCard.setAttribute("id", this.id);
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
    masquerRecette() {
        const recetteCard = document.getElementsByClassName("template__recette__item");
        console.log(recetteCard);
        recetteCard[0].classList.add("hidden");
    }
    afficherRecette() {
        const recetteCard = document.querySelector(".template__recette__item");
        recetteCard.classList.remove("hidden")
    }
    listeMotsClefs() {
        let motsClefs = [];
        this.ingredients.forEach(ingredient => {
            const ingredientFactore = Utils.moduleElementCapitale(ingredient.ingredient);
            motsClefs.push(ingredientFactore);
        })
        const appareilFactore = Utils.moduleElementCapitale(this.appareil);
        motsClefs.push(appareilFactore);
        this.ustensiles.forEach(ustensile => {
            const ustensileFactore = Utils.moduleElementCapitale(ustensile);
            motsClefs.push(ustensileFactore);
        })
        return motsClefs
    }
    // 5 méthodes
    //match allTags && saisieUser
    // appel des 4 autres méthodes
    //match saisieUser
    //match ingredients
    //match appareils
    //match ustensiles


}