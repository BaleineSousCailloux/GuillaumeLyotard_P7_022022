import recettes from "../data/recipes.js";
import Recette from "./Recette.js";
import tagTemplate from "./templates/tagTemplate.js";
import Utils from "./Utils.js";


//// Creation des tableaux
let recettesListe = [];
let recettesCards = [];
let ingredientsListe = [];
let appareilsListe = [];
let ustensilesListe = [];
//let tousLesMotsClefs = []; // inutile ?
let tags = [];
/*/ nouvelle oragnisation des tags de recherche >>> suspendue...
let tagsIngredients = [];
let tagsAppareils = [];
let tagsUstensiles = [];
let saisieUtilisateur = [];  */

recettes.forEach(recette => {
    recettesListe.push(new Recette(recette));
    recette.ingredients.forEach(ingredient => {
        const ingredientModifie = Utils.moduleElementCapitale(ingredient.ingredient);
        //const ingredientUniformise = Utils.moduleElementUniformise(ingredient.ingredient);
        if (!ingredientsListe.includes(ingredientModifie)) {
            ingredientsListe.push(ingredientModifie);
            //tousLesMotsClefs.push(ingredientUniformise); inutile ?
        }
    })
    const appareilModifie = Utils.moduleElementCapitale(recette.appliance);
    //const appareilUniformise = Utils.moduleElementUniformise(recette.appliance);
    if (!appareilsListe.includes(appareilModifie)) {
        appareilsListe.push(appareilModifie);
        //tousLesMotsClefs.push(appareilUniformise); inutile ?
    }
    recette.ustensils.forEach(ustensile => {
        const ustensileModifie = Utils.moduleElementCapitale(ustensile);
        //const ustensileUniformise = Utils.moduleElementUniformise(ustensile);
        if (!ustensilesListe.includes(ustensileModifie)) {
            ustensilesListe.push(ustensileModifie);
            //tousLesMotsClefs.push(ustensileUniformise); inutile ?
        }
    })
})
//// Tri par ordre alphabetique des éléments
ingredientsListe.sort();
appareilsListe.sort();
ustensilesListe.sort();
//tousLesMotsClefs.sort(); inutile ?
const domSectionResult = document.getElementById("result-section");
//// Insertion des éléments
recettesListe.forEach(recette => {
    domSectionResult.appendChild(recette.createRecetteCard());
    recettesCards = document.querySelectorAll(".template__recette__item")
    //recette.listeMotsClefs(); //////// ok ou Utils.listeMotsClefs(recette)  inutile ?
})

const createItemsForModule = (list, itemType) => {
    // pour chaque liste d'items, on crée la liste qui sera insérée dans chaque type de module
    list.forEach(item => {
        const domElement = document.createElement("li");
        domElement.classList.add(`search__modules__container__module__list__${itemType}`);
        domElement.setAttribute("data-type", itemType);
        domElement.innerHTML = item;
        document.getElementById(`list-${itemType}`).appendChild(domElement);
        //// possibilité de selection d'un item de la liste, si pas encore sélectionné
        domElement.addEventListener("click", (tagClick) => {
            tagClick.preventDefault();
            tagClick.stopPropagation();
            // si la liste de tags sélectionnés n'inclue pas déjà l'item, on crée le tag et on l'ajoute à la liste de tags [tags]
            if (!tags.includes(item)) {
                createTagSelected(item, itemType);
                tags.push(item);
                console.log(tags);
                // pour chaque recette de la liste des recettes (data), on récupère les mots clefs de la recette et les cartes de recettes
                recettesListe.forEach(recette => {
                    recette.isMatchingAllTags(tags, recettesCards);
                    // NOUVELLE VERSION
                    /*if (!recette.isMatchingAllTags(tags)) {
                        recettesCards.forEach(card => {
                            if (card.classList.contains(recette.id)) {
                                Utils.masquerItem(card);
                            }
                        })
                    }
                    // ancienne version
                    /*const recetteTags = recette.listeMotsClefs()
                    const recetteCards = document.getElementsByClassName("template__recette__item");
                    Array.from(recetteCards).forEach(recetteCard => {
                        // pour chaque carte de recette, si elle sa liste de mots clefs n'inclue pas l'item tagé et que son id correspond à celle de la recette (data)
                        if (!recetteTags.includes(item) && !recetteCard.classList.contains("hidden") && recetteCard.classList.contains(recette.id)) {
                            recetteCard.classList.add("hidden"); // elle est masquée
                        }
                    })*/
                })
            }
        })
    })
}
// insertion effective des tags dans les modules, selon leur type
let ingredient = "ingredient";
let appareil = "appareil";
let ustensile = "ustensile";
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
        let saisieUser = Utils.moduleElementUniformise(key.target.value);
        targetItems = []; // tableau de tags correspondants à la saisie, afin de faire évoluer la liste de tags affichés dans le module
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
    //// apparition du menu caché en absolu
    moduleConcerne.classList.add("expanded");
    moduleConcerne.querySelector(".search__modules__container__module__list").classList.remove("hidden");
}
const closeModule = (moduleConcerne, listeOriginale, itemType) => {
    moduleConcerne.classList.remove("expanded");
    moduleConcerne.querySelector(".search__modules__container__module__list").classList.add("hidden");
    //// remise à zéro de la recherche, et donc ré-insertion de l'ensemble des tags existants
    moduleConcerne.querySelector(".search__modules__container__module__bar__input").value = "";
    document.getElementById(`list-${itemType}`).innerHTML = "";
    createItemsForModule(listeOriginale, itemType);
}
// ouverture d'un module au click, en s'assurrant que cela ferme les autres + fermeture du module au click à l'extérieur de celui-ci
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
// appel effectif de la fonction d'ouverture/fermeture de chaque module
openCloseModules(moduleIngredients, ingredientsListe, ingredient);
openCloseModules(moduleAppareils, appareilsListe, appareil);
openCloseModules(moduleUstensiles, ustensilesListe, ustensile);


//// création de tag sélectionné, selon son type
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
        tagSection.removeChild(tagItem);

        // afficher/masquer recettes selon tags sélectionnés
        //const recetteCards = document.getElementsByClassName("template__recette__item"); inutile ?
        recettesListe.forEach(recette => {
            recette.isMatchingAllTags(tags, recettesCards);

            //const recetteTags = recette.listeMotsClefs(); inutile ?
            /*if (tags.length > 0) {
                // NOUVELLE VERSION
                if (recette.isMatchingAllTags(tags)) {
                    recettesCards.forEach(card => {
                        if (card.classList.contains(recette.id)) {
                            Utils.afficherItem(card);
                        }
                    })
                }
                // ancienne version
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
                recettesCards.forEach(card => {
                    if (card.classList.contains(recette.id)) {
                        Utils.afficherItem(card);
                    }
                })
                Array.from(recetteCards).forEach(recetteCard => {
                    recetteCard.classList.remove("hidden");
                })
            }*/
        })
    })
}
//// recherche multi mots

// récupérer uniquement les recettes actives (si tag(s) sélectionné(s))
const recetteCards = Array.from(document.getElementsByClassName("template__recette__item")); // tableau des cartes de recettes
let recettesActives = []; // tableau des recettes visibles
recetteCards.forEach(recetteCard => {
    if (!recetteCard.classList.contains("hidden")) {
        recettesActives.push(recetteCard);
    }
})

document.getElementById("search-bar-input").addEventListener("keypress", clef => {
    if (clef.key == "Enter") {
        clef.preventDefault();
        let input = "";
        input = clef.target.value;
        let saisieUtilisateur = [];
        saisieUtilisateur = Utils.moduleElementUniformise(input).split(" "); // tableau depuis la saisie utilisateur
        let recettesConcernee = []; // tableau des recettes (data) concernées
        recettesListe.forEach(recette => {
            recettesActives.forEach(recetteActive => {
                if (recetteActive.classList.contains(recette.id)) {
                    recettesConcernee.push(recette);
                }
            })
        })
        if (saisieUtilisateur.length > 0) {
            let controlSaisies = 0;
            saisieUtilisateur.forEach(motSaisi => { /// pour chaque mot saisi par l'utilisateur /// à parcourir après recettes
                recettesConcernee.forEach(recette => { /// pour chaque recette (data)
                    let motsClefs = recette.listeMotsClefs(); // récupération de la liste des mots clefs de la recette
                    let arrayMotsClefs = Array.from(motsClefs); // tableau des mots clefs de la recette
                    arrayMotsClefs.push(recette.nom); // ajout du nom de recette aux mots clefs
                    recettesActives.forEach(recetteActive => { /// pour chaque recette
                        let controlClefs = 0;
                        if (recetteActive.classList.contains(recette.id)) { // du même id que la recette (data)
                            arrayMotsClefs.forEach(motClef => { /// pour chaque mot clef de la recette
                                const motClefUniformise = Utils.moduleElementUniformise(motClef);
                                if (!motClefUniformise.includes(motSaisi)) { // s'il n'inclue pas le mot saisi
                                    controlClefs++;
                                }
                            })
                            // si aucun mot clef de la recette ne correspond au mot saisi
                            if (controlClefs == arrayMotsClefs.length) {
                                controlSaisies++;
                                console.log(controlSaisies);
                            }
                            if (controlSaisies == saisieUtilisateur.length && !recetteActive.classList.contains("hidden")) {
                                recetteActive.classList.add("hidden");
                            }
                        }
                    })

                })

            })
            controlSaisies = 0;
        } else {
            recettesActives.forEach(card => {
                card.classList.remove("hidden");
            })
        }
    }
})
/*
//// recherche principale V1.1 // spliter la saisie utilisateur pour recherche mutliple ?
document.getElementById("search-bar-input").addEventListener("keyup", clef => {
    clef.preventDefault();
    let saisieUtilisateur = Utils.moduleElementUniformise(clef.target.value);
    const recetteCards = document.getElementsByClassName("template__recette__item");
recettesListe.forEach(recette => {
    let motsClefs = recette.listeMotsClefs();
    let arrayMotsClefs = Array.from(motsClefs);
    arrayMotsClefs.push(recette.nom); // ajout du nom de recette aux mots clefs
    let control = 0;
    if (saisieUtilisateur.length > 0) {
        Array.from(recetteCards).forEach(card => {
            if (card.classList.contains(recette.id)) {
                arrayMotsClefs.forEach(motClef => {
                    const motClefUniformise = Utils.moduleElementUniformise(motClef);
                    if (!motClefUniformise.includes(saisieUtilisateur)) {
                        control++;
                    }
                    if (control == arrayMotsClefs.length) {
                        card.classList.add("hidden");
                    } else {
                        card.classList.remove("hidden");
                    }
                })
            }
        })
        Utils.noResultHelper(recettesListe, Array.from(recetteCards));
    } else {
        Array.from(recetteCards).forEach(card => {
            card.classList.remove("hidden");
            control = 0;
        })
    }
})
})





/*


export default `
<div>
</div>
`

const moduleElementCapitale = (element) => {
    if (typeof element !== 'string') {
        return '';
    } else {
        let elementModifie = element.trim().toLowerCase();
        elementModifie = elementModifie.replaceAll(/[.,!?]/g, "");
        return elementModifie.charAt(0).toUpperCase() + elementModifie.slice(1);
    }
}
const moduleElementUniformise = (element) => {    //// utils
    if (typeof element !== 'string') {
        return '';
    } else {
        let elementUniforme = element.trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036F\u1DC0-\u1DFF\u1AB0-\u1AFF]+/g, '')
        elementUniforme = elementUniforme.replaceAll(/[.,!?]/g, "");
        return elementUniforme;
    }
}





/// fonction pour cacher une recette
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

targetItems = targetItems.filter(items => items !== item);
document.getElementById(`list-${itemType}`).innerHTML = "";
createItemsForModule(targetItems, itemType);
===
let mots = moduleElementUniformise(item).split(" ");
mots.forEach(mot => {
if (mot.length > 2) {
    let motOk = mot;
    if (motOk.startsWith(saisieUser)) {
        if (!targetItems.includes(item)) {
            targetItems.push(item);
            document.getElementById("list-ingredient").innerHTML = "";
            createItemsForModule(targetItems, ingredient);
        }
    }
}
tags = tags.filter(tag => tag !== tagSelected);
===
const indexOfTag = tags.indexOf(tagSelected);
if (indexOfTag !== -1) {
    tags.splice(indexOfTag, 1);
}

//console.log(new Recette(recettes[0]).ingredients);
//console.log(recettes[0].ingredients);
//////////////////////////////////////////////////////////////////////////*/