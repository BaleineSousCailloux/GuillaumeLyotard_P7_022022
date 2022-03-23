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

    console.log(ingredientsListeForModule);
}

let tempIngredientsListeForModule = ingredientsListeForModule;
let tempAppareilsListeForModule = appareilsListeForModule;
let tempUstensilesListeForModule = ustensilesListeForModule;

const majListes = () => {
    tempIngredientsListeForModule = [];
    tempAppareilsListeForModule = [];
    tempUstensilesListeForModule = [];
    recettesListe.forEach(recette => {
        if (recette.visible == true) {
            recette.ingredients.forEach(ingredient => {
                const ingredientModifie = Utils.moduleElementCapitale(ingredient.ingredient);
                if (!tempIngredientsListeForModule.includes(ingredientModifie)) {
                    tempIngredientsListeForModule.push(ingredientModifie);
                }
            })
            const appareilModifie = Utils.moduleElementCapitale(recette.appareil);
            if (!tempAppareilsListeForModule.includes(appareilModifie)) {
                tempAppareilsListeForModule.push(appareilModifie);
            }
            recette.ustensiles.forEach(ustensile => {
                const ustensileModifie = Utils.moduleElementCapitale(ustensile);
                if (!tempUstensilesListeForModule.includes(ustensileModifie)) {
                    tempUstensilesListeForModule.push(ustensileModifie);
                }
            })


        }
    })
    tempIngredientsListeForModule.sort();
    tempAppareilsListeForModule.sort();
    tempUstensilesListeForModule.sort();

    createItemsForModule(tempIngredientsListeForModule, ingredient);
    createItemsForModule(tempAppareilsListeForModule, appareil);
    createItemsForModule(tempUstensilesListeForModule, ustensile);

    console.log(tempIngredientsListeForModule);
}


/// fonction pour créer les tags des modules + LISTENER "click"
const createItemsForModule = (list, itemType) => {
    document.getElementById(`list-${itemType}`).innerHTML = ""; // RAZ avant insertion
    /// pour chaque liste d'items, on crée la liste qui sera insérée dans chaque type de module
    list.forEach(item => {
        const domElement = document.createElement("li");
        domElement.classList.add(`search__modules__container__module__list__${itemType}`);
        domElement.setAttribute("data-type", itemType);
        domElement.setAttribute("id", item);
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
                        closeModule(moduleIngredients);
                    }
                    break
                case "appareil":
                    if (!appareilsTags.includes(item)) {
                        createTagSelected(item, itemType);
                        appareilsTags.push(item);
                        closeModule(moduleAppareils);
                    }
                    break
                case "ustensile":
                    if (!ustensilesTags.includes(item)) {
                        createTagSelected(item, itemType);
                        ustensilesTags.push(item);
                        closeModule(moduleUstensiles);
                    }
                    break
                default:
                    console.log("selection de l'" + item + " impossible")
                    break
            }
            Utils.masquerItem(domElement);
            let isRecetteMatching = false;
            recettesListe.forEach(recette => {
                const isMatching = recette.isMatchingAllTagsAndUserInput(ingredientsTags, appareilsTags, ustensilesTags, saisieUtilisateur);
                isRecetteMatching = isRecetteMatching || isMatching;
            })
            Utils.noResultHelper(isRecetteMatching);
            majListes();
        })
    })
}



//// ouverture/fermeture des modules de recherche
// Eléments du DOM
const moduleIngredients = document.getElementById("module-ingredients");
const moduleAppareils = document.getElementById("module-appareil");
const moduleUstensiles = document.getElementById("module-ustensiles");
// Création du tableau de tag correspondant à la saisie utilisateur dans l'input du module
// Fonction ouverture du module + LISTENER "keyup" sur l'input intégré
const openModule = (moduleConcerne, listeOriginale) => {
    /// recherche dans les éléments du module
    moduleConcerne.querySelector(".search__modules__container__module__bar__input").addEventListener("keyup", key => {
        let saisieUser = Utils.moduleElementUniformise(key.target.value);
        if (saisieUser.length > 1) {

            listeOriginale.forEach(item => {
                let mots = Utils.moduleElementUniformise(item);
                if (mots.includes(saisieUser) && document.getElementById(item)) {
                    Utils.afficherItem(document.getElementById(item));
                } else if (!mots.includes(saisieUser) && document.getElementById(item)) {
                    Utils.masquerItem(document.getElementById(item));
                }
            })
        } else {
            listeOriginale.forEach(item => {
                if (document.getElementById(item)) {
                    Utils.afficherItem(document.getElementById(item));
                }
            })
        }
    })
    /// apparition du menu (masqué en CSS)
    moduleConcerne.classList.add("expanded");
    Utils.afficherItem(moduleConcerne.querySelector(".search__modules__container__module__list"));
}
// fonction fermeture du module
const closeModule = (moduleConcerne) => {
    moduleConcerne.classList.remove("expanded");
    Utils.masquerItem(moduleConcerne.querySelector(".search__modules__container__module__list"));
    /// RAZ input + ré-insertion de l'ensemble des tags existants
    moduleConcerne.querySelector(".search__modules__container__module__bar__input").value = "";
    //document.getElementById(`list-${itemType}`).innerHTML = "";
    majListes();
}
// fonction ouverture/fermeture au "click"
const openCloseModules = (module, listeOriginale) => {
    if (!module.classList.contains("expanded")) {
        module.addEventListener("click", (open) => {
            open.preventDefault();
            open.stopPropagation();
            /// A la demande d'ouverture d'un module, en fermer un autre déjà ouvert
            if (moduleIngredients.classList.contains("expanded") || moduleAppareils.classList.contains("expanded") || moduleUstensiles.classList.contains("expanded")) {
                closeModule(moduleIngredients);
                closeModule(moduleAppareils);
                closeModule(moduleUstensiles);
            }
            openModule(module, listeOriginale);
            /// fermer le module au "click" en dehors de celui-ci
            document.getElementById("body").addEventListener("click", (close) => {
                close.preventDefault();
                //close.stopPropagation();
                closeModule(module);
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
    console.log(tagSelected);
    /// Détermine la couleur en CSS
    tagItem.setAttribute("id", tagType)

    tagItem.innerHTML = tagTemplate;
    tagItem.querySelector(".template__tag__item__title").innerText = tagSelected;
    tagSection.appendChild(tagItem);
    /// possibilité supprimer le tag + MAJ tableau des tags sélectionnés
    tagItem.querySelector(".template__tag__item__icon").addEventListener("click", (tagClose) => {
        tagClose.preventDefault();
        //tagClose.stopPropagation();
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
        majListes();
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
        majListes();
    })
    document.getElementById("search-bar-input").addEventListener("keyup", clef => {
        clef.preventDefault();
        saisieUtilisateur = clef.target.value;
        let isRecetteMatching = false;
        recettesListe.forEach(recette => {
            console.log(ingredientsTags);
            const isMatching = recette.isMatchingAllTagsAndUserInput(ingredientsTags, appareilsTags, ustensilesTags, saisieUtilisateur);
            isRecetteMatching = isRecetteMatching || isMatching;
        })
        Utils.noResultHelper(isRecetteMatching);
        majListes();


    })
}
const init = () => {
    creerListes();
    createItemsForModule(tempIngredientsListeForModule, ingredient);
    createItemsForModule(tempAppareilsListeForModule, appareil);
    createItemsForModule(tempUstensilesListeForModule, ustensile);
    openCloseModules(moduleIngredients, tempIngredientsListeForModule);
    openCloseModules(moduleAppareils, tempAppareilsListeForModule);
    openCloseModules(moduleUstensiles, tempAppareilsListeForModule);
    recherchePrincipale()

}
init();