import recettes from "../data/recipes.js";
import Recette from "./Recette.js";
import tagTemplate from "./templates/tagTemplate.js";
import Utils from "./Utils.js";


/// Eléments du DOM
const domSectionResult = document.getElementById("result-section");
const moduleIngredients = document.getElementById("module-ingredients");
const moduleAppareils = document.getElementById("module-appareil");
const moduleUstensiles = document.getElementById("module-ustensiles");
const tagSection = document.getElementById("tags-selected")

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
let tagsWidthCunt = 0;


//// Fonction de création de la liste de recettes
const creerRecettes = () => {
    recettes.forEach(recette => {
        recettesListe.push(new Recette(recette));
    })
    /// Insertion des éléments des cartes de recettes
    recettesListe.forEach(recette => {
        domSectionResult.appendChild(recette.createRecetteCard());
    })
}

//// fonction de création/maj des listes d'items pour les modules
const listesItems = () => {
    /// raz
    ingredientsListeForModule = [];
    appareilsListeForModule = [];
    ustensilesListeForModule = [];
    recettesListe.forEach(recette => {
        if (recette.visible == true) {
            recette.ingredients.forEach(ingredient => {
                const ingredientModifie = Utils.moduleElementCapitale(ingredient.ingredient);
                if (!ingredientsListeForModule.includes(ingredientModifie)) {
                    ingredientsListeForModule.push(ingredientModifie);
                }
            })
            const appareilModifie = Utils.moduleElementCapitale(recette.appareil);
            if (!appareilsListeForModule.includes(appareilModifie)) {
                appareilsListeForModule.push(appareilModifie);
            }
            recette.ustensiles.forEach(ustensile => {
                const ustensileModifie = Utils.moduleElementCapitale(ustensile);
                if (!ustensilesListeForModule.includes(ustensileModifie)) {
                    ustensilesListeForModule.push(ustensileModifie);
                }
            })


        }
    })
    /// classement par ordre aplphabétique
    ingredientsListeForModule.sort();
    appareilsListeForModule.sort();
    ustensilesListeForModule.sort();
    /// gestion des tags sélectionnés pour les retirer des listes
    if (ingredientsTags.length > 0) {
        ingredientsTags.forEach(tagSelected => {
            ingredientsListeForModule = ingredientsListeForModule.filter(tag => tag !== tagSelected)
        })
    }
    if (appareilsTags.length > 0) {
        appareilsTags.forEach(tagSelected => {
            appareilsListeForModule = appareilsListeForModule.filter(tag => tag !== tagSelected)
        })
    }
    if (ustensilesTags.length > 0) {
        ustensilesTags.forEach(tagSelected => {
            ustensilesListeForModule = ustensilesListeForModule.filter(tag => tag !== tagSelected)
        })
    }
    /// appel de la fonction qui crée kes items
    createItemsForModule(ingredientsListeForModule, ingredient);
    createItemsForModule(appareilsListeForModule, appareil);
    createItemsForModule(ustensilesListeForModule, ustensile);
}

//// fonction qui vérifie l'ensemble des conditions (input principal et tags sélectionnés avant d'afficher les recettes correspondantes
const recettesTrouvees = () => {
    let isRecetteMatching = false;
    recettesListe.forEach(recette => {
        const isMatching = recette.isMatchingAllTagsAndUserInput(ingredientsTags, appareilsTags, ustensilesTags, saisieUtilisateur);
        isRecetteMatching = isRecetteMatching || isMatching;
    })
    /// affichage du message  "aucune recette trouvée"
    Utils.noResultHelper(isRecetteMatching);
    /// maj des listes de tags dans les modules
    listesItems();
}


/// fonction pour créer les tags des modules + LISTENER "click" pour leur sélection
const createItemsForModule = (list, itemType) => {
    document.getElementById(`list-${itemType}`).innerHTML = ""; // RAZ avant insertion
    /// pour une liste d'items, on crée les éléments qui seront insérés dans le module correspondant
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
                        /// appel de la fonction créant le tag
                        createTagSelected(item, itemType);
                        ingredientsTags.push(item);
                        /// fermeture du menu après sélection du tag
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
            /// affichage des recettes trouvées
            recettesTrouvees();
        })
    })
}

//// ouverture/fermeture des modules de recherche
// Fonction ouverture du module + LISTENER "keyup" sur l'input intégré
const openModule = (moduleConcerne, listeOriginale) => {
    /// recherche dans les éléments du module à partir de 2 caractères
    moduleConcerne.querySelector(".search__modules__container__module__bar__input").addEventListener("keyup", key => {
        let saisieUser = Utils.uniformise(key.target.value);
        if (saisieUser.length > 1) {
            listeOriginale.forEach(item => {
                let mots = Utils.uniformise(item);
                if (mots.includes(saisieUser) && document.getElementById(item)) {
                    /// les items sont masqués ou affichés en CSS
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
    /// apparition de la liste d'item / menu développé (masqué en CSS)
    moduleConcerne.classList.add("expanded");
    Utils.afficherItem(moduleConcerne.querySelector(".search__modules__container__module__list"));
}
// fonction fermeture du module
const closeModule = (moduleConcerne) => {
    /// masquer la liste d'item / le menu développé (en CSS)
    moduleConcerne.classList.remove("expanded");
    Utils.masquerItem(moduleConcerne.querySelector(".search__modules__container__module__list"));
    /// RAZ input du module concerné
    moduleConcerne.querySelector(".search__modules__container__module__bar__input").value = ""
}
// fonction globale d'ouverture/fermeture des modules au "click"
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
                closeModule(module);
            })
        })
    }
}

//// fonction de création des tags sélectionnés
// fonction création d'un tag sélectionné, selon son type
const createTagSelected = (tagSelected, tagType) => {
    const tagItem = document.createElement("article");
    tagItem.classList.add("template__tag__item");
    tagItem.setAttribute("id", tagType) /// Détermine la couleur en CSS
    tagItem.innerHTML = tagTemplate;
    tagItem.querySelector(".template__tag__item__title").innerText = tagSelected;
    tagSection.appendChild(tagItem);
    tagsWidthCunt = tagsWidthCunt + tagItem.clientWidth;
    /// Décaler la section resultat si tags sélectionnés > 1 ligne
    if (tagsWidthCunt > (tagSection.clientWidth - tagItem.clientWidth)) {
        domSectionResult.style.marginTop = "223px";
    }
    /// possibilité supprimer le tag (Listener "click")
    tagItem.querySelector(".template__tag__item__icon").addEventListener("click", (tagClose) => {
        tagClose.preventDefault();
        /// maj des listes de tags sélectionnés
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
        /// décaler la section résultat si tags sélectionnés repassent de 2 lignes à 1 ligne
        tagsWidthCunt = tagsWidthCunt - tagItem.clientWidth;
        if (tagsWidthCunt < (tagSection.clientWidth - tagItem.clientWidth)) {
            domSectionResult.style.marginTop = "166px";
        }
        tagSection.removeChild(tagItem);

        /// affichage des recettes trouvées
        recettesTrouvees();
    })
}

//// recherche avec la saisie utilisateur dans l'input ptincipal
const recherchePrincipale = () => {
    /// raz au click dans l'input
    document.getElementById("search-bar-input").addEventListener("click", click => {
        click.preventDefault();
        click.target.value = "";
        saisieUtilisateur = click.target.value;
        /// affichage des recettes trouvées
        recettesTrouvees();
    })
    /// listener "keyup"
    document.getElementById("search-bar-input").addEventListener("keyup", clef => {
        clef.preventDefault();
        saisieUtilisateur = clef.target.value;
        /// affichage des recettes trouvées
        recettesTrouvees();
    })
}

//// RAZ de tous les inputs
const razAllInputs = () => {
    moduleIngredients.querySelector(".search__modules__container__module__bar__input").value = "";
    moduleAppareils.querySelector(".search__modules__container__module__bar__input").value = "";
    moduleUstensiles.querySelector(".search__modules__container__module__bar__input").value = "";
    document.getElementById("search-bar-input").value = "";
}

//// Appel final de toutes les fonctions
const init = () => {
    razAllInputs();
    creerRecettes();
    listesItems();
    openCloseModules(moduleIngredients, ingredientsListeForModule);
    openCloseModules(moduleAppareils, appareilsListeForModule);
    openCloseModules(moduleUstensiles, ustensilesListeForModule);
    recherchePrincipale()
}
init();