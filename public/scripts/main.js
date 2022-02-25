import recettes from "../data/recipes.js";

export default `
<div>
</div>
`

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
}

////// Ajouter ... au texte de description si trop long  ///////
let description = document.querySelectorAll(".template__recette__item__details__content__description");

const ellipsis = (p) => {
    //Déccoupe à la longueur max
    let text = p.textContent;
    //On coupe les X+1 premiers caractères
    text = text.replace(/  +/g, ' ');
    text = text.substr(0, 220);
    //On coupe à nouveau pour enlever le dernier mot si il a été coupé en 2
    text = text.substr(0, Math.min(text.length, text.lastIndexOf(" ")));
    //On remplace dans la boite
    p.textContent = text + " ...";
}

description.forEach(recette => {
    ellipsis(recette)
});
///////////////////////////////////////////////////////////////////////////