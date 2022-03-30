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
        this.visible = true; /// pour la fonction de maj des listes d'items
    }
    //// création de la carte recette
    createRecetteCard() {
        this.recetteCard = document.createElement("article");
        this.recetteCard.classList.add("template__recette__item");
        this.recetteCard.classList.add(this.id);
        this.recetteCard.setAttribute("id", this.id);
        this.recetteCard.innerHTML = recetteTemplate;
        // lier les photo en faisant correspondre les noms de recettes
        let nomPhoto = "";
        nomPhoto = this.nom;
        nomPhoto = nomPhoto.replace(/,/g, '');
        nomPhoto = nomPhoto.replace(/'/g, ' ');
        nomPhoto = nomPhoto.replace(/ /g, '-');
        nomPhoto = nomPhoto.trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036F\u1DC0-\u1DFF\u1AB0-\u1AFF]+/g, '');
        // HTML
        this.recetteCard.querySelector(".template__recette__item__thumbnail").innerHTML = `
        <img class="template__recette__item__thumbnail__img"
        src="./public/assets/Photos/${nomPhoto}.jpg" alt="${this.nom}" />`;
        this.recetteCard.querySelector(".template__recette__item__details__header__title").innerText = this.nom;
        this.recetteCard.querySelector(".template__recette__item__details__header__infos__time").innerText = this.temps + " min";
        const listeIngredients = this.recetteCard.querySelector(".template__recette__item__details__content__ingredients");
        const ingredients = this.ingredients;
        ingredients.forEach(ingredient => {
            const ingredientDetail = document.createElement("li");
            ingredientDetail.classList.add("template__recette__item__details__content__ingredients__ingredient");
            const nomIngredient = document.createElement("span");
            nomIngredient.classList.add("template__recette__item__details__content__ingredients__ingredient__name");
            nomIngredient.setAttribute("data-ingredient", ingredient.ingredient);
            nomIngredient.innerText = ingredient.ingredient;
            ingredientDetail.appendChild(nomIngredient);
            // Adapter l'affichage aux différences de data (quantity/quantite, unit ou non, ponctuation inadéquate)
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
        this.recetteCard.querySelector(".template__recette__item__details__content__description").innerText = this.ellipsis();
        return this.recetteCard;
    }
    //// limite les descriptions à 210 caractères
    ellipsis() {
        ///Récupération du texte
        let text = this.description;
        ///On remplace les suites d'espaces par un espace
        text = text.replace(/  +/g, ' ');
        /// si le texte est plus long que 210 caractères, on ajoite "..."
        if (text.length > 210) {
            // On coupe les X premiers caractères
            text = text.substr(0, 210);
            //On coupe à nouveau pour enlever le dernier mot si il a été coupé en 2
            text = text.substr(0, Math.min(text.length, text.lastIndexOf(" ")));
            //On retourne le texte coupé avec les 3 points à la fin
            return text + " ...";
        } else {
            // ou le texte si inférieur à 210 caractères
            return text
        }
    }
    isMatchingAllTagsAndUserInput(ingredientsTags, appareilsTags, ustensilesTags, userInput) {
        let allIsMatching = true
        //const tagsTest = this.isMatchingAllTags(tags);
        const ingredientsTest = this.isMatchingIngredientsTags(ingredientsTags);
        const appareilsTest = this.isMatchingAppareilsTags(appareilsTags);
        const ustensilesTest = this.isMatchingUstensilesTags(ustensilesTags);
        const userInputTest = this.isMatchingUserInput(userInput);
        // allIsMatching est true si les 4 tests sont true
        allIsMatching = ingredientsTest && appareilsTest && ustensilesTest && userInputTest
        // gestion de l'affichage des recettes en CSS
        if (allIsMatching) {
            Utils.afficherItem(this.recetteCard);
            this.visible = true;
        } else {
            Utils.masquerItem(this.recetteCard);
            this.visible = false;
        }

        return allIsMatching;
    }
    isMatchingIngredientsTags(ingredientsTags) {
        let ingredientsTest = true;
        if (ingredientsTags.length > 0) {
            ingredientsTags.forEach(ingredientTag => {
                // pour chaque ingredient du tableau d'objet, on cherche une correspondance
                const ingredientFind = this.ingredients.find(ingredient => {
                    // renvoi l'ingredient(true) ou undefined(false)
                    return Utils.uniformise(ingredient.ingredient) === Utils.uniformise(ingredientTag);
                })
                // logique combinatoire (mémoire persistante) : true + true = true, 1 seul "false" transforme le résultat en false
                ingredientsTest = ingredientFind && ingredientsTest;
            })
        }
        // renvoi true si tous les tags d'ingrédients sont trouvés dans la liste d'ingredients de la recette
        return ingredientsTest;
    }
    isMatchingAppareilsTags(appareilsTags) {
        let appareilsTest = true;
        if (appareilsTags.length > 0) {
            appareilsTags.forEach(appareilTag => {
                const appareilFind = Utils.uniformise(this.appareil).includes(Utils.uniformise(appareilTag));
                appareilsTest = appareilFind && appareilsTest;
            })
        }
        return appareilsTest;
    }
    isMatchingUstensilesTags(ustensilesTags) {
        let ustensilesTest = true;
        if (ustensilesTags.length > 0) {
            ustensilesTags.forEach(ustensileTag => {
                const ustensileFind = this.ustensiles.find(ustensile => {
                    return Utils.uniformise(ustensile) === Utils.uniformise(ustensileTag);
                })
                ustensilesTest = ustensileFind && ustensilesTest;
            })
        }
        return ustensilesTest;
    }
    //// algorithme de recherche : version 2 - programmation avec boucles natives
    isMatchingUserInput(userInput) {
        let userInputTest = true

        if (userInput.length >= 3) {
            let instanceSaisie = Utils.uniformise(userInput);
            let saisieUser = instanceSaisie.split(" ");
            let n = 0

            do {
                const testIngredients = () => {
                    let ingredientsTest = false;
                    for (let i = 0; i < this.ingredients.length; i++) {
                        let ingredientUniformise = Utils.uniformise(this.ingredients[i].ingredient);
                        if (ingredientUniformise.includes(saisieUser[n])) {
                            ingredientsTest = true;
                            i = this.ingredients.length;
                        }
                    }
                    return ingredientsTest
                }
                const titreTest = Utils.uniformise(this.nom).includes(saisieUser[n]);
                const descriptionTest = Utils.uniformise(this.description).includes(saisieUser[n]);
                userInputTest = userInputTest && (testIngredients() || titreTest || descriptionTest);
                n++;
            } while (n < saisieUser.length)
        }
        return userInputTest;
    }
}