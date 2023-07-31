export interface WindowDotT {
    wechatConfig: WechatConfig;
    jsApiList: WechatJsApi[];
    Wechat: (method: string, args?: any) => void;
    urlMap: { [key: string]: boolean };
}

export interface WechatError {
    errMsg: string;
    [key: string]: any;
}

export type WechatJsApi =
    | 'updateAppMessageShareData'
    | 'updateTimelineShareData'
    | 'onMenuShareTimeline'
    | 'onMenuShareAppMessage'
    | 'onMenuShareQQ'
    | 'onMenuShareWeibo'
    | 'onMenuShareQZone'
    | 'showOptionMenu'
    | 'hideOptionMenu'
    | 'hideAllNonBaseMenuItem'
    | 'showAllNonBaseMenuItem'
    | 'chooseWXPay';

export interface WechatConfig {
    // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来
    // 若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印
    debug: boolean;
    // 必填，公众号的唯一标识
    appId: string;
    // 必填，生成签名的时间戳
    timestamp: number;
    // 必填，生成签名的随机串
    nonceStr: string;
    // 必填，签名
    signature: string;
    // 必填，需要使用的JS接口列表
    jsApiList: WechatJsApi[];
}

export interface CommonJsApiInfo {
    // 接口调用成功时执行的回调函数
    success?: (res: WechatError) => void;
    // 接口调用失败时执行的回调函数
    fail?: (res: WechatError) => void;
    // 接口调用完成时执行的回调函数，无论成功或失败都会执行
    complete?: (res: WechatError) => void;
    // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到
    cancel?: (res: WechatError) => void;
    // 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口
    trigger?: (res: WechatError) => void;
}

export interface WechatShareInfo extends CommonJsApiInfo {
    // 分享标题
    title?: string;
    // 分享描述
    desc?: string;
    // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
    link?: string;
    // 分享图标
    imgUrl?: string;
    // 分享类型, music、video 或 link，不填默认为 link
    type?: 'music' | 'video' | 'link';
    // 如果 type 是 music 或 video，则要提供数据链接，默认为空
    dataUrl?: string;
}

export interface CheckJsApiInfo extends CommonJsApiInfo {
    jsApiList: WechatJsApi[];
}

export interface ChooseWXPayInfo extends CommonJsApiInfo {
    // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
    timestamp: number;
    // 支付签名随机串，不长于 32 位
    nonceStr: string;
    // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
    package: string;
    // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
    signType: 'SHA1' | 'MD5';
    // 支付签名
    paySign: string;
}

/**
 * 仅记录 JSSDK 部分 API，可根据业务需求添加 API 接口
 * 详情可参考官方文档 https://mp.weixin.qq.com
 */
export interface WechatJSSDK {
    // 判断当前客户端版本是否支持指定JS接口
    checkJsApi: (checkJsApi: CheckJsApiInfo) => void;

    // 发起一个微信支付请求
    chooseWXPay: (chooseWXPayInfo: ChooseWXPayInfo) => void;

    // 关闭当前网页窗口接口
    closeWindow: () => void;

    // 通过config接口注入权限验证配置
    config: (wechatConfig: WechatConfig) => void;

    // 通过error接口处理失败验证
    error: (callback: (e: WechatError) => void) => void;

    // 隐藏所有非基础按钮接口
    hideAllNonBaseMenuItem: () => void;

    hideOptionMenu: () => void;

    // @Deprecate
    // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
    onMenuShareTimeline: (shareInfo: WechatShareInfo) => void;

    // @Deprecate
    // 获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
    onMenuShareAppMessage: (shareInfo: WechatShareInfo) => void;

    // @Deprecate
    // 获取“分享到QQ”按钮点击状态及自定义分享内容接口（即将废弃）
    onMenuShareQQ: (shareInfo: WechatShareInfo) => void;

    // 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
    onMenuShareWeibo: (shareInfo: WechatShareInfo) => void;

    // @Deprecate
    onMenuShareQZone: (shareInfo: WechatShareInfo) => void;

    // 通过ready接口处理成功验证
    ready: (callback: () => void) => void;

    // 显示所有功能按钮接口
    showAllNonBaseMenuItem: () => void;

    showOptionMenu: () => void;

    // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
    updateAppMessageShareData: (shareInfo: WechatShareInfo) => void;

    // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
    updateTimelineShareData: (shareInfo: WechatShareInfo) => void;
}
