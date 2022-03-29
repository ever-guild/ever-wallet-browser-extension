import React from 'react'
import { useIntl } from 'react-intl'
import { NATIVE_CURRENCY } from '@shared/constants'

import QRCode from 'react-qr-code'
import { CopyButton } from '@popup/components/CopyButton'
import { CopyText } from '@popup/components/CopyText'
import Button from '@popup/components/Button'
import UserAvatar from '@popup/components/UserAvatar'

import './style.scss'

interface IReceive {
    accountName?: string
    address: string
    currencyName?: string
}

const Receive: React.FC<IReceive> = ({ accountName, address, currencyName }) => {
    const intl = useIntl()
    return (
        <div className="receive-screen">
            <div className="receive-screen__account_details">
                <UserAvatar address={address} />
                <span className="receive-screen__account_details-title">{accountName || ''}</span>
            </div>

            <h3 className="receive-screen__form-title noselect">
                {intl.formatMessage(
                    { id: 'RECEIVE_ASSET_LEAD_TEXT' },
                    { symbol: currencyName || NATIVE_CURRENCY }
                )}
            </h3>
            <div className="receive-screen__qr-code">
                <div className="receive-screen__qr-code-code">
                    <QRCode value={`ton://chat/${address}`} size={80} />
                </div>
                <div className="receive-screen__qr-code-address">
                    <CopyText text={address} />
                </div>
            </div>

            <CopyButton text={address}>
                <Button text={intl.formatMessage({ id: 'COPY_ADDRESS_BTN_TEXT' })} />
            </CopyButton>
        </div>
    )
}

export default Receive
