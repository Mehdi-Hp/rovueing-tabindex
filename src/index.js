import { ApplyRove } from './ApplyRove';


export const RovueingTabindex = {
    install(app, { direction = 'ltr' } = {}) {
        const roveMap = new WeakMap();
        app.directive('rove', {
            created(element, { value = true, modifiers }) {
                const resolvedModifiers = {
                    rtl: modifiers.rtl || direction === 'rtl',
                    autoFocus: modifiers.autoFocus || false
                };
                const observer = new MutationObserver(() => {
                    ApplyRove({
                        element,
                        disabled: !value,
                        isRTL: resolvedModifiers.rtl,
                        autoFocus: resolvedModifiers.autoFocus,
                        roveMap,
                        updateMode: false
                    });
                });
                const observerConfig = { attributes: false, childList: true };
                roveMap.set(element, { observer, observerConfig });
            },
            async mounted(element, { value = true, modifiers }) {
                const resolvedModifiers = {
                    rtl: modifiers.rtl || direction === 'rtl',
                    autoFocus: modifiers.autoFocus || false
                };
                const { observer, observerConfig } = roveMap.get(element);
                observer.observe(element, observerConfig);
                ApplyRove({
                    element,
                    disabled: !value,
                    isRTL: resolvedModifiers.rtl,
                    autoFocus: resolvedModifiers.autoFocus,
                    roveMap,
                    updateMode: false
                });
            },
            updated(element, { value = true, modifiers }) {
                const resolvedModifiers = {
                    rtl: modifiers.rtl || direction === 'rtl',
                    autoFocus: modifiers.autoFocus || false
                };
                const { observer, observerConfig, removeEventListeners } = roveMap.get(element);
                observer.disconnect();
                removeEventListeners();
                observer.observe(element, observerConfig);
                ApplyRove({
                    element,
                    disabled: !value,
                    isRTL: resolvedModifiers.rtl,
                    autoFocus: resolvedModifiers.autoFocus,
                    roveMap,
                    updateMode: true
                });
            },
            unmounted(element) {
                const { observer, removeEventListeners } = roveMap.get(element);
                removeEventListeners();
                observer.disconnect();
                roveMap.delete(element);
            }
        });
        app.directive('rove-focusable', {
            mounted(element) {
                element.dataset.vRoveFocusable = '';
            },
            updated(element) {
                element.dataset.vRoveFocusable = '';
            },
            unmounted(element) {
                delete element.dataset.vRoveFocusable;
            }
        });
    }
};
