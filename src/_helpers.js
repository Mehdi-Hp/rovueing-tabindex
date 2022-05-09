export function getRoveFocusables(element) {
    return [...element.querySelectorAll(
        'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
    )]
        .filter((elm) => {
            return !elm.hasAttribute('disabled') && Object.hasOwn(elm.dataset, 'vRoveFocusable');
        });
}
