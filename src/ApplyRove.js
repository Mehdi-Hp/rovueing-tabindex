import { ref, unref, watch } from 'vue';
import { getRoveFocusables } from './_helpers';


const previousKeys = new Set(['ArrowUp']);
const nextKeys = new Set(['ArrowDown']);
const endKeys = new Set(['End']);
const homeKeys = new Set(['Home']);

export function ApplyRove({
    element, disabled, isRTL, roveMap, autoFocus, updateMode
}) {
    const roves = getRoveFocusables(element);
    const isTouchedByRovueing = ref(false);

    if (unref(disabled)) {
        if (isTouchedByRovueing.value) {
            roves.forEach((rove) => {
                return rove.setAttribute('tabindex', '0');
            });
        }
        return;
    }

    isTouchedByRovueing.value = true;

    if (roves.length === 0) {
        throw new Error('No rove focusables found');
    }
    if (isRTL) {
        previousKeys.add('ArrowRight');
        nextKeys.add('ArrowLeft');
    } else {
        previousKeys.add('ArrowLeft');
        nextKeys.add('ArrowRight');
    }

    const isFocusedInside = ref(false);
    if (checkIfIsFocusedInside()) {
        isFocusedInside.value = true;
    }
    const toReceiveFocus = ref(findBestRoveToFocus());

    element.addEventListener('focusin', handleFocusIn, true);
    element.addEventListener('focusout', handleFocusOut, true);
    element.addEventListener('keydown', handleKeydown, true);

    function checkIfIsFocusedInside() {
        const focused = document.activeElement;
        const alreadyFocusedRove = roves.find((rove) => {
            return rove.contains(focused);
        });
        return Boolean(alreadyFocusedRove);
    }
    function findBestRoveToFocus() {
        const focused = document.activeElement;
        if (focused) {
            const alreadyFocusedRove = roves.find((rove) => {
                return rove.contains(focused);
            });
            if (alreadyFocusedRove) {
                return roves.indexOf(alreadyFocusedRove);
            }
            const checkedRoves = roves.filter((rove) => {
                return rove.checked;
            });
            if (checkedRoves.length === 1) {
                return roves.indexOf(checkedRoves[0]);
            }
        }
        return 0;
    }
    function handleFocusIn(event) {
        if (!isFocusedInside.value) {
            const hasCheckedRove = roves.some((rove) => {
                return rove.checked;
            });
            if (hasCheckedRove) {
                toReceiveFocus.value = roves.findIndex((rove) => {
                    return rove.checked;
                });
            }
        }
        isFocusedInside.value = true;
    }
    function handleFocusOut(event) {
        const isAllOut = !roves.some((rove) => {
            return rove.contains(event.relatedTarget);
        });
        if (isAllOut) {
            isFocusedInside.value = false;
        }
    }

    function handleKeydown(event) {
        if (previousKeys.has(event.key)) {
            event.preventDefault();
            if (toReceiveFocus.value === 0) {
                toReceiveFocus.value = roves.length - 1;
            } else {
                toReceiveFocus.value -= 1;
            }
        }
        if (nextKeys.has(event.key)) {
            event.preventDefault();
            if (toReceiveFocus.value === roves.length - 1) {
                toReceiveFocus.value = 0;
            } else {
                toReceiveFocus.value += 1;
            }
        }
        if (endKeys.has(event.key)) {
            event.preventDefault();
            toReceiveFocus.value = roves.length - 1;
        }
        if (homeKeys.has(event.key)) {
            event.preventDefault();
            toReceiveFocus.value = 0;
        }
    }

    const stopToReceiveFocusWatcher = watch(
        toReceiveFocus,
        () => {
            roves.forEach((rove, roveIndex) => {
                if (toReceiveFocus.value === roveIndex) {
                    rove.setAttribute('tabindex', '0');
                    if (isFocusedInside.value) {
                        rove.focus();
                    }
                    if (autoFocus && !isFocusedInside.value) {
                        rove.focus();
                    }
                } else {
                    rove.setAttribute('tabindex', '-1');
                }
            });
        },
        {
            immediate: true
        }
    );


    function removeEventListeners() {
        element.removeEventListener('focusin', handleFocusIn);
        element.removeEventListener('focusout', handleFocusOut);
        element.removeEventListener('keydown', handleKeydown);
        stopToReceiveFocusWatcher();
    }
    roveMap.set(element, {
        ...roveMap.get(element),
        removeEventListeners
    });
}
