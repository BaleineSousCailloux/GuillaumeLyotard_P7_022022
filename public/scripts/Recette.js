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
    isMatchingAllTagsAndUserInput(/*ingredientsTags, appareilsTags, ustensilesTags*/tags, userInput) {
        let allIsMatching = true
        const tagsTest = this.isMatchingAllTags(tags);
        /*const ingredientsTest = this.isMatchingIngredientsTags(ingredientsTags);
        const appareilsTest = this.isMatchingAppareilsTags(appareilsTags);
        const ustensilesTest = this.isMatchingUstensilesTags(ustensilesTags);*/
        const userInputTest = this.isMatchingUserInput(userInput);
        //allIsMatching = ingredientsTest && appareilsTest && ustensilesTest && userInputTest // retourne si les 4 conditions sont true
        //return allIsMatching
        allIsMatching = tagsTest && userInputTest;


        if (tags.length > 0 || userInput > 0) {
            if (allIsMatching) {
                Utils.afficherItem(this.recetteCard);
            } else {
                Utils.masquerItem(this.recetteCard);
            }
        } else {
            Utils.afficherItem(this.recetteCard);
        }
    }

    isMatchingAllTags(tags, cards) {
        let allTagsTest = true;
        const motsClefs = this.listeMotsClefs();
        cards = Array.from(cards);
        //return allTagsTest;
        //const recetteCard = this.createRecetteCard();
        //let exCard = "";
        //let exCardIndex = -1;
        if (tags.length > 0) {
            tags.forEach(tag => {
                const tagFind = motsClefs.find(mot => {
                    return Utils.moduleElementUniformise(mot) === Utils.moduleElementUniformise(tag);
                })
                allTagsTest = tagFind && allTagsTest;
                cards.forEach(card => {
                    if (card.classList.contains(this.id)) {
                        if (allTagsTest) {
                            Utils.afficherItem(card);
                        } else {
                            Utils.masquerItem(card);
                        }
                        /*Utils.masquerItem(recetteCard);
                        //cards.forEach(card => {
                            //let index = -1
                            if (card.classList.contains(recetteCard.id)) {
                                destination.replaceChild(recetteCard, card)
                                index = cards.indexOf(card);
                                if (index != -1) {
                                    cards[index] = recetteCard;
                                }
                            }
                        })
                    } else {
                        Utils.afficherItem(recetteCard);
                        cards.forEach(card => {
                            let index = -1
                            if (card.classList.contains(recetteCard.id)) {
                                destination.replaceChild(recetteCard, card)
                                index = cards.indexOf(card);
                                if (index != -1) {
                                    cards[index] = recetteCard;
                                }
                            }
                        })
                    }*/
                    }
                })
            })
        } else {
            cards.forEach(card => {
                Utils.afficherItem(card);
            })
        }
    }
    isMatchingIngredientsTags(ingredientsTags) {
        let ingredientsTest = true;
        if (ingredientsTags.length > 0) {
            ingredientsTags.forEach(ingredientTag => {
                const ingredientFind = this.ingredients.find(ingredient => { ///filtre le tableau d'objets tout en fonctionnant "comme" un forEach, et renvoi un objet ingredient
                    return Utils.moduleElementUniformise(ingredient.ingredient) === Utils.moduleElementUniformise(ingredientTag); // renvoi (ingredient) si true ou undefined si false
                })
                // ingredientFind ci-dessous revient a : ingredientFind is valid ? true si valeur, false si undefined, un objet peut ainsi devient un booléen
                ingredientsTest = ingredientFind && ingredientsTest;  // pour la mémoire persistante du résultat précédent (true+false == false (logique combinatoire))
            })
        }
        return ingredientsTest; // renvoi true si tous les tags d'ingrédients sont trouvés dans la liste d'ingredients de LA recette
    }
    isMatchingAppareilsTags(appareilsTags) {
        let appareilsTest = true;
        if (appareilsTags.length > 0) {
            appareilsTags.forEach(appareilTag => {
                const appareilFind = Utils.moduleElementUniformise(this.appareil).includes(Utils.moduleElementUniformise(appareilTag));
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
                    return Utils.moduleElementUniformise(ustensile) === Utils.moduleElementUniformise(ustensileTag);
                })
                ustensilesTest = ustensileFind && ustensilesTest;
            })
        }
        return ustensilesTest;
    }
    isMatchingUserInput(userInput) {
        let userInputTest = true

        // besoin de 2 tableaux qu'on va entrechoquer
        let instanceSaisie = Utils.moduleElementUniformise(userInput);
        let saisieUser = instanceSaisie.split(" ");

        if (saisieUser > 0) {
            saisieUser.forEach(motSaisi => {
                const motSaisiUniformise = Utils.moduleElementUniformise(motSaisi);
                const ingredientsTest = this.ingredients.find(ingredient => Utils.moduleElementUniformise(ingredient).includes(motSaisiUniformise)); //renvoi objet ingredient(true) ou undefined (false)
                const appareilsTest = Utils.moduleElementUniformise(this.appareil).includes(motSaisiUniformise);
                const ustensilesTest = this.ustensiles.find(ustensile => Utils.moduleElementUniformise(ustensile).includes(motSaisiUniformise));
                const titreTest = Utils.moduleElementUniformise(this.nom).includes(motSaisiUniformise);
                const descriptionTest = Utils.moduleElementUniformise(this.description).includes(motSaisiUniformise);
                // besoin d'un seul True sur les 5 tests...
                userInputTest = userInputTest && (ingredientsTest || appareilsTest || ustensilesTest || titreTest || descriptionTest);
            })
        }
        return userInputTest;
    }
}