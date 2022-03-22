import recettes from "../data/recipes.js";
import Recette from "./Recette.js";
import tagTemplate from "./templates/tagTemplate.js";
import Utils from "./Utils.js";


/// Eléments du DOM : section d'affichage des recettes
const domSectionResult = document.getElementById("result-section");

// insertion effective des tags dans les modules, selon leur type
let ingredient = "ingredient";
let appareil = "appareil";
let ustensile = "ustensile";
let saisieUtilisateur = "";

//// Creation des tableaux
let recettesListe = [];
let ingredientsListeForModule = [];
let appareilsListeForModule = [];
let ustensilesListeForModule = [];
let ingredientsTags = [];
let appareilsTags = [];
let ustensilesTags = [];


// Fonction de completion des tableaux
const creerListes = () => {
    recettes.forEach(recette => {
        recettesListe.push(new Recette(recette));
        recette.ingredients.forEach(ingredient => {
            const ingredientModifie = Utils.moduleElementCapitale(ingredient.ingredient);
            if (!ingredientsListeForModule.includes(ingredientModifie)) {
                ingredientsListeForModule.push(ingredientModifie);
            }
        })
        const appareilModifie = Utils.moduleElementCapitale(recette.appliance);
        if (!appareilsListeForModule.includes(appareilModifie)) {
            appareilsListeForModule.push(appareilModifie);
        }
        recette.ustensils.forEach(ustensile => {
            const ustensileModifie = Utils.moduleElementCapitale(ustensile);
            if (!ustensilesListeForModule.includes(ustensileModifie)) {
                ustensilesListeForModule.push(ustensileModifie);
            }
        })
    })
    /// Tri par ordre alphabetique des tableaux
    ingredientsListeForModule.sort();
    appareilsListeForModule.sort();
    ustensilesListeForModule.sort();

    /// Insertion des éléments & complétion du tableau des cartes de recettes
    recettesListe.forEach(recette => {
        domSectionResult.appendChild(recette.createRecetteCard());
    })
}


/// fonction pour créer les tags des modules + LISTENER "click"
const createItemsForModule = (list, itemType) => {
    /// pour chaque liste d'items, on crée la liste qui sera insérée dans chaque type de module
    list.forEach(item => {
        const domElement = document.createElement("li");
        domElement.classList.add(`search__modules__container__module__list__${itemType}`);
        domElement.setAttribute("data-type", itemType);
        domElement.innerHTML = item;
        document.getElementById(`list-${itemType}`).appendChild(domElement);
        /// LISTENER : possibilité de selection d'un item de la liste, si pas encore sélectionné
        domElement.addEventListener("click", (tagClick) => {
            tagClick.preventDefault();
            tagClick.stopPropagation();
            /// si la liste de tags sélectionnés n'inclue pas déjà l'item, on crée le tag et on l'ajoute à la liste de tags sélectionnés
            switch (itemType) {
                case "ingredient":
                    if (!ingredientsTags.includes(item)) {
                        createTagSelected(item, itemType);
                        ingredientsTags.push(item);
                    }
                    break
                case "appareil":
                    if (!appareilsTags.includes(item)) {
                        createTagSelected(item, itemType);
                        appareilsTags.push(item);
                    }
                    break
                case "ustensile":
                    if (!ustensilesTags.includes(item)) {
                        createTagSelected(item, itemType);
                        ustensilesTags.push(item);
                    }
                    break
                default:
                    console.log("selection de l'" + item + " impossible")
                    break
            }
            let isRecetteMatching = false;
            recettesListe.forEach(recette => {
                const isMatching = recette.isMatchingAllTagsAndUserInput(ingredientsTags, appareilsTags, ustensilesTags, saisieUtilisateur);
                isRecetteMatching = isRecetteMatching || isMatching;
            })
            Utils.noResultHelper(isRecetteMatching);
        })
    })
}



//// ouverture/fermeture des modules de recherche
// Eléments du DOM
const moduleIngredients = document.getElementById("module-ingredients");
const moduleAppareils = document.getElementById("module-appareil");
const moduleUstensiles = document.getElementById("module-ustensiles");
// Création du tableau de tag correspondant à la saisie utilisateur dans l'input du module
let targetItems = [];
// Fonction ouverture du module + LISTENER "keyup" sur l'input intégré
const openModule = (moduleConcerne, listeOriginale, itemType) => {
    /// recherche dans les éléments du module
    moduleConcerne.querySelector(".search__modules__container__module__bar__input").addEventListener("keyup", key => {
        let saisieUser = Utils.moduleElementUniformise(key.target.value);
        targetItems = []; /// RAZ du tableau
        if (saisieUser.length > 0) {
            listeOriginale.forEach(item => {
                let mots = Utils.moduleElementUniformise(item);
                if (mots.includes(saisieUser) && !targetItems.includes(item)) {
                    targetItems.push(item);
                    document.getElementById(`list-${itemType}`).innerHTML = "";
                    createItemsForModule(targetItems, itemType);
                } else {
                    targetItems = targetItems.filter(items => items !== item);
                    document.getElementById(`list-${itemType}`).innerHTML = "";
                    createItemsForModule(targetItems, itemType);
                }
            })
        }
    })
    /// apparition du menu (masqué en CSS)
    moduleConcerne.classList.add("expanded");
    Utils.afficherItem(moduleConcerne.querySelector(".search__modules__container__module__list"));
}
// fonction fermeture du module
const closeModule = (moduleConcerne, listeOriginale, itemType) => {
    moduleConcerne.classList.remove("expanded");
    Utils.masquerItem(moduleConcerne.querySelector(".search__modules__container__module__list"));
    /// RAZ input + ré-insertion de l'ensemble des tags existants
    moduleConcerne.querySelector(".search__modules__container__module__bar__input").value = "";
    document.getElementById(`list-${itemType}`).innerHTML = "";
    createItemsForModule(listeOriginale, itemType);
}
// fonction ouverture/fermeture au "click"
const openCloseModules = (module, listeOriginale, itemType) => {
    if (!module.classList.contains("expanded")) {
        module.addEventListener("click", (open) => {
            open.preventDefault();
            open.stopPropagation();
            /// A la demande d'ouverture d'un module, en fermer un autre déjà ouvert
            if (moduleIngredients.classList.contains("expanded") || moduleAppareils.classList.contains("expanded") || moduleUstensiles.classList.contains("expanded")) {
                closeModule(moduleIngredients, ingredientsListeForModule, ingredient);
                closeModule(moduleAppareils, appareilsListeForModule, appareil);
                closeModule(moduleUstensiles, ustensilesListeForModule, ustensile);
            }
            openModule(module, listeOriginale, itemType);
            /// fermer le module au "click" en dehors de celui-ci
            document.getElementById("body").addEventListener("click", (close) => {
                close.preventDefault();
                close.stopPropagation();
                closeModule(module, listeOriginale, itemType);
            })
        })
    }
}


//// création des tags sélectionnés
// Element du DOM
const tagSection = document.getElementById("tags-selected")
// fonction création d'un tag sélectionné, selon son type
const createTagSelected = (tagSelected, tagType) => {
    const tagItem = document.createElement("article");
    tagItem.classList.add("template__tag__item");
    tagItem.setAttribute("data-tag", tagSelected)

    /// Détermine la couleur en CSS
    tagItem.setAttribute("id", tagType)

    tagItem.innerHTML = tagTemplate;
    tagItem.querySelector(".template__tag__item__title").innerText = tagSelected;
    tagSection.appendChild(tagItem);
    /// possibilité supprimer le tag + MAJ tableau des tags sélectionnés
    tagItem.querySelector(".template__tag__item__icon").addEventListener("click", (tagClose) => {
        tagClose.preventDefault();
        tagClose.stopPropagation();
        switch (tagType) {
            case "ingredient":
                if (ingredientsTags.includes(tagSelected)) {
                    ingredientsTags = ingredientsTags.filter(tag => tag !== tagSelected)
                }
                break
            case "appareil":
                if (appareilsTags.includes(tagSelected)) {
                    appareilsTags = appareilsTags.filter(tag => tag !== tagSelected)
                }
                break
            case "ustensile":
                if (ustensilesTags.includes(tagSelected)) {
                    ustensilesTags = ustensilesTags.filter(tag => tag !== tagSelected)
                }
                break
            default:
                console.log("erreur dans la suppression de " + tagSelected)
                break
        }
        tagSection.removeChild(tagItem);
        let isRecetteMatching = false;
        recettesListe.forEach(recette => {
            const isMatching = recette.isMatchingAllTagsAndUserInput(ingredientsTags, appareilsTags, ustensilesTags, saisieUtilisateur);
            isRecetteMatching = isRecetteMatching || isMatching;
        })
        Utils.noResultHelper(isRecetteMatching);
    })
}

//// recherche avec la saisie utilisateur dans l'input ptincipal
const recherchePrincipale = () => {
    document.getElementById("search-bar-input").addEventListener("click", click => {
        click.preventDefault();
        click.target.value = "";
        saisieUtilisateur = click.target.value;
        let isRecetteMatching = false;
        recettesListe.forEach(recette => {
            const isMatching = recette.isMatchingAllTagsAndUserInput(ingredientsTags, appareilsTags, ustensilesTags, saisieUtilisateur);
            isRecetteMatching = isRecetteMatching || isMatching;
        })
        Utils.noResultHelper(isRecetteMatching);
    })
    document.getElementById("search-bar-input").addEventListener("keyup", clef => {
        clef.preventDefault();
        saisieUtilisateur = clef.target.value;
        let isRecetteMatching = false;
        recettesListe.forEach(recette => {
            const isMatching = recette.isMatchingAllTagsAndUserInput(ingredientsTags, appareilsTags, ustensilesTags, saisieUtilisateur);
            isRecetteMatching = isRecetteMatching || isMatching;
        })
        Utils.noResultHelper(isRecetteMatching);
    })
}
const init = () => {
    creerListes();
    createItemsForModule(ingredientsListeForModule, ingredient);
    createItemsForModule(appareilsListeForModule, appareil);
    createItemsForModule(ustensilesListeForModule, ustensile);
    openCloseModules(moduleIngredients, ingredientsListeForModule, ingredient);
    openCloseModules(moduleAppareils, appareilsListeForModule, appareil);
    openCloseModules(moduleUstensiles, ustensilesListeForModule, ustensile);
    recherchePrincipale()
}
init();