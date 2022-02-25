// navigation in tags listes with keyboard
this.enterTagsNav = (e, tagsContainer) => {
    const tags = tagsContainer.querySelectorAll(".tag");
    const firstTag = tags[0]
    const lastTag = tags[tags.length - 1];

    // open tags list and tag gestion
    if (e.keyCode === 13 || e.keyCode === 32) {
        e.preventDefault();
        tags.forEach(tag => {
            tag.setAttribute("tabindex", "0");
            tag.addEventListener("keydown", active => {
                if (active.keyCode === 13 || active.keyCode === 32) {
                    active.preventDefault();
                    tag.click();
                }
            })
        })
        firstTag.focus();

        // keep focus in list tags
        lastTag.addEventListener("keydown", event => {
            if (event.keyCode === 9 && !event.shiftKey) {
                event.preventDefault();
                firstTag.focus();
            }
        })
        firstTag.addEventListener("keydown", backEvent => {

            if (backEvent.keyCode === 9 && backEvent.shiftKey) {
                backEvent.preventDefault();
                lastTag.focus();
            }
        })
    }

    //  Escape tags list
    if (e.keyCode === 27 && tagsContainer.contains(document.activeElement)) {
        tagsContainer.focus();
    }
}