import {
    WechatConfig,
    WechatError,
    WechatJSSDK,
    WechatShareInfo,
    WindowDotT,
    ChooseWXPayInfo
} from './types';

// script(src="https://res.wx.qq.com/open/js/jweixin-1.4.0.js")


declare const window: any;

const { T, wx }: { T: WindowDotT; wx: WechatJSSDK } = window;

export class WechatHelper {
    public static wx = wx;

    public static isWeChat(): boolean {
        return window.navigator.userAgent.indexOf('MicroMessenger/') > -1;
    }

    public static ready(): Promise<WechatConfig> {
        return new Promise((resolve, reject) => {
            wx.config(T.wechatConfig);
            wx.ready(() => resolve(T.wechatConfig));
            wx.error((err: WechatError) => reject(err.errMsg));
        });
    }

    public static async setShareInfo(shareInfo: WechatShareInfo): Promise<void> {
        if (WechatHelper.isWeChat()) {
            if (!shareInfo.link) {
                shareInfo.link = location.href;
            }

            shareInfo.imgUrl = shareInfo.imgUrl || 'https://defalut.png';

            await WechatHelper.ready();
            wx.onMenuShareTimeline(shareInfo);
            wx.onMenuShareAppMessage(shareInfo);
            wx.onMenuShareQQ(shareInfo);
            wx.onMenuShareWeibo(shareInfo);
            wx.onMenuShareQZone(shareInfo);
        }
    }

    public static async hideAllNonBaseMenuItem(): Promise<void> {
        if (WechatHelper.isWeChat()) {
            await WechatHelper.ready();
            wx.hideAllNonBaseMenuItem();
        }
    }

    public static async showAllNonBaseMenuItem(): Promise<void> {
        if (WechatHelper.isWeChat()) {
            await WechatHelper.ready();
            wx.showAllNonBaseMenuItem();
        }
    }

    public static async hideOptionMenu(): Promise<void> {
        if (WechatHelper.isWeChat()) {
            await WechatHelper.ready();
            wx.hideOptionMenu();
        }
    }

    public static async showOptionMenu(): Promise<void> {
        if (WechatHelper.isWeChat()) {
            await WechatHelper.ready();
            wx.showOptionMenu();
        }
    }

    public static async chooseWXPay(chooseWXPayInfo: ChooseWXPayInfo) {
        if (WechatHelper.isWeChat()) {
            await WechatHelper.ready();
            wx.chooseWXPay(chooseWXPayInfo);
        }
    }

}
