// factory of the header tags liste for the index page
this.headerTagFactory = (headerTag) => {
    this.getHeaderTag = () => {
        const newHeaderTag = document.createElement("span");
        newHeaderTag.classList.add("tag");
        newHeaderTag.classList.add(headerTag)
        newHeaderTag.setAttribute("data-tag", headerTag);
        newHeaderTag.setAttribute("aria-label", headerTag)
        newHeaderTag.innerHTML = `#${headerTag}`;
        return newHeaderTag;
    }
    return this;
}