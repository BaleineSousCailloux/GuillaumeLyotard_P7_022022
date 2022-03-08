import recettes from "../data/recipes.js";
import recetteTemplate from "./templates/recetteTemplate.js";
import tagTemplate from "./templates/tagTemplate.js";

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
            const ingredientFactore = moduleElementCapitale(ingredient.ingredient);
            motsClefs.push(ingredientFactore);
        })
        const appareilFactore = moduleElementCapitale(this.appareil);
        motsClefs.push(appareilFactore);
        this.ustensiles.forEach(ustensile => {
            const ustensileFactore = moduleElementCapitale(ustensile);
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
const moduleElementUniformise = (element) => {
    if (typeof element !== 'string') {
        return '';
    } else {
        let elementUniforme = element.trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036F\u1DC0-\u1DFF\u1AB0-\u1AFF]+/g, '')
        elementUniforme = elementUniforme.replaceAll(/[.,!?]/g, "");
        return elementUniforme;
    }
}

//// Creation des tableaux
let recettesListe = [];
let ingredientsListe = [];
let appareilsListe = [];
let ustensilesListe = [];
let tags = [];
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
    recette.listeMotsClefs();
})
const createItemsForModule = (list, itemType) => {
    list.forEach(item => {
        const domElement = document.createElement("li");
        domElement.classList.add(`search__modules__container__module__list__${itemType}`);
        domElement.setAttribute("data-type", itemType);
        domElement.innerHTML = item;
        //document.getElementById(`list-${itemType}`).innerHTML = "";
        document.getElementById(`list-${itemType}`).appendChild(domElement);
        //// possibilité de selection, si pas encore sélectionné
        domElement.addEventListener("click", (tagClick) => {
            tagClick.preventDefault();
            tagClick.stopPropagation();
            if (!tags.includes(item)) {
                createTagSelected(item, itemType);
                tags.push(item);
                recettesListe.forEach(recette => {
                    const recetteTags = recette.listeMotsClefs()
                    const recetteCards = document.getElementsByClassName("template__recette__item");
                    Array.from(recetteCards).forEach(recetteCard => {
                        if (!recetteTags.includes(item) && !recetteCard.classList.contains("hidden") && recetteCard.classList.contains(recette.id)) {
                            recetteCard.classList.add("hidden");
                        }
                    })

                })

            }
        })
    })
}
createItemsForModule(ingredientsListe, ingredient);
createItemsForModule(appareilsListe, appareil);
createItemsForModule(ustensilesListe, ustensile);

//// ouverture/fermeture des modules de recherche
const moduleIngredients = document.getElementById("module-ingredients");
const moduleAppareils = document.getElementById("module-appareil");
const moduleUstensiles = document.getElementById("module-ustensiles");
let targetItems = [];

const openModule = (moduleConcerne, listeOriginale, itemType) => {
    //// recherche dans les éléments du module
    moduleConcerne.querySelector(".search__modules__container__module__bar__input").addEventListener("keyup", key => {
        let saisieUser = moduleElementUniformise(key.target.value);
        targetItems = [];
        if (saisieUser.length > 0) {
            console.log(saisieUser);
            listeOriginale.forEach(item => { ////////////////////////////////////////////////////////
                let mots = moduleElementUniformise(item);
                if (mots.includes(saisieUser) && !targetItems.includes(item)) {
                    targetItems.push(item);
                    document.getElementById(`list-${itemType}`).innerHTML = "";
                    createItemsForModule(targetItems, itemType);
                } else {
                    targetItems = targetItems.filter(items => items !== item);
                    document.getElementById(`list-${itemType}`).innerHTML = "";
                    createItemsForModule(targetItems, itemType);
                }
                /*let mots = moduleElementUniformise(item).split(" ");
                mots.forEach(mot => {
                    if (mot.length > 2) {
                        let motOk = mot;
                        if (motOk.startsWith(saisieUser)) {
                            if (!targetItems.includes(item)) {
                                targetItems.push(item);
                                document.getElementById("list-ingredient").innerHTML = "";
                                createItemsForModule(targetItems, ingredient); ////////////////////////////////
                            }

                        }
                    }
                })*/

            })
        }
    })
    //// apparition du menu caché en absolu
    moduleConcerne.classList.add("expanded");
    moduleConcerne.querySelector(".search__modules__container__module__list").classList.remove("hidden");
}
const closeModule = (moduleConcerne, listeOriginale, itemType) => {
    moduleConcerne.classList.remove("expanded");
    moduleConcerne.querySelector(".search__modules__container__module__list").classList.add("hidden");
    //// remise à zéro de la recherche
    moduleConcerne.querySelector(".search__modules__container__module__bar__input").value = "";
    document.getElementById(`list-${itemType}`).innerHTML = "";
    createItemsForModule(listeOriginale, itemType); /////////////////////////////////////////////////////////////////
}
const openCloseModules = (module, listeOriginale, itemType) => {
    if (!module.classList.contains("expanded")) {
        module.addEventListener("click", (open) => {
            open.preventDefault();
            open.stopPropagation();
            if (moduleIngredients.classList.contains("expanded") || moduleAppareils.classList.contains("expanded") || moduleUstensiles.classList.contains("expanded")) {
                closeModule(moduleIngredients, ingredientsListe, ingredient);
                closeModule(moduleAppareils, appareilsListe, appareil);
                closeModule(moduleUstensiles, ustensilesListe, ustensile);
            }
            openModule(module, listeOriginale, itemType);
            document.getElementById("body").addEventListener("click", (close) => {
                close.preventDefault();
                close.stopPropagation();
                closeModule(module, listeOriginale, itemType);
            })
        })
    }
}

openCloseModules(moduleIngredients, ingredientsListe, ingredient);
openCloseModules(moduleAppareils, appareilsListe, appareil);
openCloseModules(moduleUstensiles, ustensilesListe, ustensile);


//// création de tag ingredient
const tagSection = document.getElementById("tags-selected")
const createTagSelected = (tagSelected, tagType) => {
    const tagItem = document.createElement("article");
    tagItem.classList.add("template__tag__item");
    tagItem.setAttribute("data-tag", tagSelected)
    tagItem.setAttribute("id", tagType) // -> détermine la couleur en CSS
    tagItem.innerHTML = tagTemplate;
    tagItem.querySelector(".template__tag__item__title").innerText = tagSelected;
    tagSection.appendChild(tagItem);
    //// possibilité supprimer le tag
    tagItem.querySelector(".template__tag__item__icon").addEventListener("click", (tagClose) => {
        tagClose.preventDefault();
        //tagClose.stopPropagation();
        tags = tags.filter(tag => tag !== tagSelected);
        /*const indexOfTag = tags.indexOf(tagSelected);
        if (indexOfTag !== -1) {
            tags.splice(indexOfTag, 1);
        }*/
        tagSection.removeChild(tagItem);


        const recetteCards = document.getElementsByClassName("template__recette__item");
        recettesListe.forEach(recette => {
            const recetteTags = recette.listeMotsClefs();
            if (tags.length >= 1) {
                let verif = 0;
                tags.forEach(tag => {
                    let searchTag = recetteTags.indexOf(tag);
                    if (searchTag != -1) {
                        verif++;
                    }
                })
                Array.from(recetteCards).forEach(recetteCard => {
                    if (verif == tags.length && recetteCard.classList.contains("hidden") && recetteCard.classList.contains(recette.id)) {
                        recetteCard.classList.remove("hidden");
                    }
                })
            } else {
                Array.from(recetteCards).forEach(recetteCard => {
                    recetteCard.classList.remove("hidden");
                })
            }

        })

    })

}

/*/// fonction pour cacher une recette
const masquerRecette = (recette) => {
    
}*/

/*const openCloseModules = (module) => {
    module.addEventListener("click", (open) => {
        open.preventDefault();
        open.stopPropagation();
        if (!module.classList.contains("expanded")) {
            openModule(module);
        }
    })
    document.getElementById("body").addEventListener("click", (close) => {
        close.preventDefault();
        close.stopPropagation();
        if (module.classList.contains("expanded") && close.target != module) {
            closeModule(module);
        }
    })
}*/

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