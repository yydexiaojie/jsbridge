declare var require: any;

const Buffer = require('buffer').Buffer;
const win = window;
const isNotInnerApp = !/Qiuku/.test(win.navigator.userAgent);
const UID_PREFIX = Date.now().toString();
let uid = 1;

interface WebviewParams {
    callback?: Function; 
    [key: string]: any;
}

class WebView {

    /**
     * 直接调用api
     * 比如：WebView.exec('setTitle', { message: 'iam toast', trigger: () => {}});
     * @param {string} name apiName
     * @param {Object} [params] 可能存在的参数
     */
    public exec(name: string, params: WebviewParams) {
        return this.addApi(name)[name](params);
    }

    /**
     * 增加一项新的Api
     * @param {string} name api名字
     */
    public addApi(name: string) {
        if (!this[name]) {
            this[name] = (params) => {
                // 非App内，没有必要处理
                if (isNotInnerApp) {
                    return this;
                }

                return this.run(name, params);
            };
        }
        return this;
    }

    private getUid(name) {
        return (name || 'fn') + UID_PREFIX + (++uid);
    }

    private run(apiName: string, params: WebviewParams = {}) {
        const callback = params && params.callback;

        if (typeof callback === 'function') {
            const callbackName = this.getUid(callback.name);

            win[callbackName] = this.convertToReceiveBase64(callback);

            params.trigger = callbackName;
        }

        let messageHandler = win['QiukuWebview'] as any;


        if (!messageHandler[apiName]) {
            return false;
        }

        const encodeParam = (new Buffer(JSON.stringify(params))).toString('base64');

        messageHandler[apiName](encodeParam);

        return this;
    }

    // base64string transfer to normal string
    private base64ToString(base64String: string): string {
        base64String = String(base64String)
            .replace(/[-_]/g, function (m0) {
                return m0 === '-' ? '+' : '/';
            })
            .replace(/[^A-Za-z0-9+/]/g, '');

        return (new Buffer(base64String, 'base64')).toString();
    }

    // 解析base64数据
    private convertToReceiveBase64(callback: Function) {
        return (base64String) => {
            let data = {};
            if (base64String) {
                try {
                    data = JSON.parse(this.base64ToString(base64String));
                } catch (e) {
                    const msg = e.message || 'WebView Parse Base64Data Error';
                    data = { msg };
                }
            }
            // 传null或undefined时，将是JS执行环境的全局变量。浏览器中是window，其它环境（如node）则是global。
            callback.apply(null, data);
        };
    }

}

export default WebView;

const webview = new WebView();

webview.addApi('setLeftButton');
webview.exec('setLeftButton', { callback: (err, response) => {
    
}});