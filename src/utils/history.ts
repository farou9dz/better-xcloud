import { BxEvent } from "@utils/bx-event";
import { LoadingScreen } from "@modules/loading-screen";
import { RemotePlayManager } from "@/modules/remote-play-manager";
import { HeaderSection } from "@/modules/ui/header";
import { BxEventBus } from "./bx-event-bus";
import { NavigationDialogManager } from "@/modules/ui/dialog/navigation-dialog";

export function patchHistoryMethod(type: 'pushState' | 'replaceState') {
    const orig = window.history[type];

    return function(...args: any[]) {
        BxEvent.dispatch(window, BxEvent.POPSTATE, {
            arguments: args,
        });

        // @ts-ignore
        return orig.apply(this, arguments);
    };
};


export function onHistoryChanged(e: PopStateEvent) {
    // @ts-ignore
    if (e && e.arguments && e.arguments[0] && e.arguments[0].origin === 'better-xcloud') {
        return;
    }

    window.setTimeout(RemotePlayManager.detect, 10);

    // Hide Navigation dialog
    NavigationDialogManager.getInstance().hide();

    LoadingScreen.reset();
    window.setTimeout(HeaderSection.watchHeader, 2000);

    BxEventBus.Stream.emit('state.stopped', {});
}
