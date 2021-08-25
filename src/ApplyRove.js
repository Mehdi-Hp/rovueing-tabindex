import {
    ref, unref, watch, computed
} from 'vue';
import { getKeyboardFocusableElements } from './_helpers';

export function ApplyRove({
    element, disabled, isRTL, roveMap
}) {
    const roves = getKeyboardFocusableElements(element);
    const focusableRove = ref(0);
    const focusableRoveElm = computed(() => {
        return roves[focusableRove.value];
    });

    if (unref(disabled)) {
        roves.forEach((rove, index) => {
            return rove.setAttribute('tabindex', '0');
        });
        return;
    }

    watch(focusableRove, () => {
        roves.forEach((rove, index) => {
            if (focusableRove.value === index) {
                return rove.setAttribute('tabindex', '0');
            }
            return rove.setAttribute('tabindex', '-1');
        });
    }, { immediate: true });

    const prevKeys = ['ArrowUp'];
    const nextKeys = ['ArrowDown'];
    const endKeys = ['End'];
    const homeKeys = ['Home'];
    if (isRTL) {
        prevKeys.push('ArrowRight');
        nextKeys.push('ArrowLeft');
    } else {
        prevKeys.push('ArrowLeft');
        nextKeys.push('ArrowRight');
    }
    function makePrevFocusable() {
        if (focusableRove.value === 0) {
            focusableRove.value = roves.length - 1;
        } else {
            focusableRove.value -= 1;
        }
    }
    function makeNextFocusable() {
        if (focusableRove.value === roves.length - 1) {
            focusableRove.value = 0;
        } else {
            focusableRove.value += 1;
        }
    }
    function handleKeydown(event) {
        if (prevKeys.includes(event.key)) {
            event.preventDefault();
            makePrevFocusable();
        }
        if (nextKeys.includes(event.key)) {
            event.preventDefault();
            makeNextFocusable();
        }
        if (homeKeys.includes(event.key)) {
            event.preventDefault();
            focusableRove.value = 0;
        }
        if (endKeys.includes(event.key)) {
            event.preventDefault();
            focusableRove.value = roves.length - 1;
        }
    }
    function handleFocus(event) {
        focusableRoveElm.value.addEventListener('keydown', handleKeydown);
    }
    function handleBlur(event) {
        focusableRoveElm.value.removeEventListener('keydown', handleKeydown);
    }
    watch(focusableRoveElm, (newFocusableRoveElm, oldFocusableRoveElm) => {
        newFocusableRoveElm?.addEventListener('focus', handleFocus);
        newFocusableRoveElm?.addEventListener('blur', handleBlur);
        oldFocusableRoveElm?.removeEventListener('focus', handleFocus);
        oldFocusableRoveElm?.removeEventListener('blur', handleBlur);
        oldFocusableRoveElm?.blur();
        newFocusableRoveElm?.focus();
    }, { immediate: true });

    function handleClick(clickedRove) {
        roves.forEach((rove, index) => {
            return rove.setAttribute('tabindex', '-1');
        });
        return clickedRove.setAttribute('tabindex', '0');
    }
    function removeEventListener() {
        roves.forEach((rove) => {
            rove.removeEventListener('click', handleClick);
            rove.removeEventListener('keydown', handleKeydown);
            rove.removeEventListener('focus', handleFocus);
            rove.removeEventListener('blur', handleBlur);
        });
    }
    roves.forEach((rove, index) => {
        rove.addEventListener('click', (event) => {
            handleClick(rove);
        });
    });
    roveMap.set(element, {
        ...roveMap.get(element),
        removeEventListener
    });
}
