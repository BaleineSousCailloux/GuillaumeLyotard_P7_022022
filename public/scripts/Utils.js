export default class Utils {
    //// Fonctions de mise en forme des éléments des modules
    static moduleElementCapitale(element) {
        if (typeof element !== 'string') {
            return '';
        } else {
            let elementModifie = element.trim().toLowerCase();
            elementModifie = elementModifie.replaceAll(/[.,!?]/g, "");
            return elementModifie.charAt(0).toUpperCase().normalize('NFKD').replace(/[\u0300-\u036F\u1DC0-\u1DFF\u1AB0-\u1AFF]+/g, '') + elementModifie.slice(1);
        }
    }
    //// Fonction d'uniformisation des textes pour comparaisons
    static uniformise(element) {
        if (typeof element !== 'string') {
            return '';
        } else {
            let elementUniforme = element.trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036F\u1DC0-\u1DFF\u1AB0-\u1AFF]+/g, '');
            elementUniforme = elementUniforme.replaceAll(/[.,!?]/g, "");
            return elementUniforme;
        }
    }
    //// Affiche ou non le message "aucun résultat"
    static noResultHelper(match) {
        const noResult = document.getElementById("no-result");
        if (!match) {
            noResult.classList.remove("hidden");
        } else {
            noResult.classList.add("hidden")
        }
    }
    //// permet de masquer un objet HTML via CSS
    static masquerItem(item) {
        item.classList.add("hidden");

    }
    //// permet d'afficher un objet HTML via CSS
    static afficherItem(item) {
        item.classList.remove("hidden");
    }
}
