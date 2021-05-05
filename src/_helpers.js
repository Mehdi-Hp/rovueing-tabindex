export function getKeyboardFocusableElements(element) {
    return [...element.querySelectorAll(
        'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
    )]
        .filter((elm) => {
            return !elm.hasAttribute('disabled') && elm.hasAttribute('data-v-rove-focusable');
        });
}
