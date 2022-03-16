//// Fonction de mise en forme des éléments des modules   //// utils
export default class Utils {
    static moduleElementCapitale(element) {
        if (typeof element !== 'string') {
            return '';
        } else {
            let elementModifie = element.trim().toLowerCase();
            elementModifie = elementModifie.replaceAll(/[.,!?]/g, "");
            return elementModifie.charAt(0).toUpperCase() + elementModifie.slice(1);
        }
    }
    static moduleElementUniformise(element) {
        if (typeof element !== 'string') {
            return '';
        } else {
            let elementUniforme = element.trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036F\u1DC0-\u1DFF\u1AB0-\u1AFF]+/g, '')
            elementUniforme = elementUniforme.replaceAll(/[.,!?]/g, "");
            return elementUniforme;
        }
    }
    static noResultHelper(listeSource, listeToCompare) {
        let verifAll = 0;
        let noResult = document.getElementById("no-result");
        listeToCompare.forEach(item => {
            if (item.classList.contains("hidden")) {
                verifAll++;
            } else {
                verifAll--;
            }
        })
        if (verifAll == listeSource.length && noResult.classList.contains("hidden")) {
            noResult.classList.remove("hidden");
        } else {
            noResult.classList.add("hidden")
        }
    }
    static masquerItem(item) {
        item.classList.add("hidden");

    }
    static afficherItem(item) {
        item.classList.remove("hidden");
    }
}
