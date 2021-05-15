const { EventEmitter } = require('events')

const BRIDGE_URL = 'https://pashinov.github.io/ton-ledger-bridge'

type IBridgeApi = {
    'ledger-get-public-key': {
        input: {
            account: number
        }
        output: {
            publicKey: Uint8Array
        }
    }
    'ledger-sign-hash': {
        input: {
            account: number
            message: Uint8Array
        }
        output: {
            signature: Uint8Array
        }
    }
}

type IBridgeResponse<T extends keyof IBridgeApi> =
    | {
          success: true
          payload: IBridgeApi[T]['output']
          error: undefined
      }
    | { success: false; payload: undefined; error: Error | undefined }

export default class LedgerBridge extends EventEmitter {
    private readonly bridgeUrl: string = BRIDGE_URL
    private iframe?: HTMLIFrameElement
    private iframeLoaded: boolean = false

    constructor() {
        super()
        this._setupIframe()
    }

    public async getPublicKey(account: number) {
        const { success, payload, error } = await this._sendMessage('ledger-get-public-key', {
            account,
        })

        if (success && payload) {
            return payload.publicKey
        } else {
            throw error || new Error('Unknown error')
        }
    }

    public async signHash(account: number, message: Uint8Array) {
        const { success, payload, error } = await this._sendMessage('ledger-sign-hash', {
            account,
            message,
        })

        if (success && payload) {
            return payload.signature
        } else {
            throw error || new Error('Unknown error')
        }
    }

    private _setupIframe() {
        console.log('_setupIframe')
        this.iframe = document.createElement('iframe')
        this.iframe.src = this.bridgeUrl
        this.iframe.allow = 'hid'
        this.iframe.onload = async () => {
            this.iframeLoaded = true
        }
        document.body.appendChild(this.iframe)
    }

    private _getOrigin() {
        const tmp = this.bridgeUrl.split('/')
        tmp.splice(-1, 1)
        return tmp.join('/')
    }

    private _sendMessage<T extends keyof IBridgeApi>(
        action: T,
        params: IBridgeApi[T]['input']
    ): Promise<IBridgeResponse<T>> {
        const message = {
            target: 'LEDGER-IFRAME',
            background: true,
            action,
            params,
        }

        return new Promise<IBridgeResponse<T>>((resolve, reject) => {
            const eventListener = ({ origin, data }: MessageEvent) => {
                if (origin !== this._getOrigin()) {
                    return false
                }

                window.removeEventListener('message', eventListener)

                if (data && data.action && data.action === `${message.action}-reply`) {
                    resolve(data)
                } else {
                    reject(new Error('Invalid reply'))
                }

                return undefined
            }
            window.addEventListener('message', eventListener)

            this.iframe?.contentWindow?.postMessage(message, '*')
        })
    }
}
