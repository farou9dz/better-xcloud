import { BX_FLAGS } from "@/utils/bx-flags";
import { BxIcon } from "@/utils/bx-icon";
import { AppInterface } from "@/utils/global";
import { ButtonStyle, CE, createButton } from "@/utils/html";
import { t } from "@/utils/translation";
import { parseDetailsPath } from "@/utils/utils";

export class ProductDetailsPage {
    private static $btnShortcut = AppInterface && createButton({
        icon: BxIcon.CREATE_SHORTCUT,
        label: t('create-shortcut'),
        style: ButtonStyle.FOCUSABLE,
        onClick: e => {
            AppInterface.createShortcut(window.location.pathname.substring(6));
        },
    });

    private static $btnWallpaper = AppInterface && createButton({
        icon: BxIcon.DOWNLOAD,
        label: t('wallpaper'),
        style: ButtonStyle.FOCUSABLE,
        onClick: e => {
            const details = parseDetailsPath(window.location.pathname);
            details && AppInterface.downloadWallpapers(details.titleSlug, details.productId);
        },
    });

    private static injectTimeoutId: number | null = null;

    static injectButtons() {
        if (!AppInterface) {
            return;
        }

        ProductDetailsPage.injectTimeoutId && clearTimeout(ProductDetailsPage.injectTimeoutId);
        ProductDetailsPage.injectTimeoutId = window.setTimeout(() => {
            // Find action buttons container
            const $container = document.querySelector('div[class*=ActionButtons-module__container]');
            if ($container && $container.parentElement) {
                $container.parentElement.appendChild(CE('div', {
                    class: 'bx-product-details-buttons',
                },
                    ['android-handheld', 'android'].includes(BX_FLAGS.DeviceInfo.deviceType) && ProductDetailsPage.$btnShortcut,
                    ProductDetailsPage.$btnWallpaper,
                ));
            }
        }, 500);
    }
}
