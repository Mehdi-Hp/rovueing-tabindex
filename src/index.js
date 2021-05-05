import { ApplyRove } from './ApplyRoving';

export const RovueingTabindex = {
    install(app, { direction }) {
        const roveMap = new WeakMap();
        app.directive('rove', {
            created(el, { value = true, modifiers: { rtl = direction === 'rtl' } }) {
                const observer = new MutationObserver(() => {
                    ApplyRove({
                        element: el,
                        disabled: !value,
                        isRTL: rtl,
                        roveMap
                    });
                });
                const observerConfig = { attributes: false, childList: true };
                roveMap.set(el, { observer, observerConfig });
            },
            mounted(el) {
                const { observer, observerConfig } = roveMap.get(el);
                observer.observe(el, observerConfig);
            },
            updated(el) {
                const { observer, observerConfig } = roveMap.get(el);
                observer.observe(el, observerConfig);
            },
            unmounted(el) {
                const { observer, removeEventListener } = roveMap.get(el);
                removeEventListener();
                observer.disconnect();
                roveMap.delete(el);
            }
        });
        app.directive('rove-focusable', {
            mounted(el) {
                el.setAttribute('data-v-rove-focusable', '');
            },
            updated(el) {
                el.setAttribute('data-v-rove-focusable', '');
            },
            unmounted(el) {
                el.removeAttribute('data-v-rove-focusable');
            }
        });
    }
};
