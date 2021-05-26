import React, { useState } from 'react'
import { DEFAULT_CONTRACT_TYPE } from '@popup/common'
import { AccountToCreate, KeyToRemove, LedgerKeyToCreate } from '@shared/approvalApi'
import * as nt from '@nekoton'

import SignPolicy from '@popup/components/SignPolicy'
import SelectContractType from '@popup/components/SelectContractType'
import ConnectLedger from '@popup/components/ConnectLedger'
import Modal from '@popup/components/Modal'

enum LocalStep {
    SIGN_POLICY,
    SELECT_CONTRACT_TYPE,
    CONNECT_LEDGER,
}

interface INewAccountLedgerPage {
    name: string
    createLedgerKey: (params: LedgerKeyToCreate) => Promise<nt.KeyStoreEntry>
    removeKey: (params: KeyToRemove) => Promise<nt.KeyStoreEntry | undefined>
    createAccount: (params: AccountToCreate) => Promise<nt.AssetsList>
    selectAccount: (params: string) => Promise<void>
    getLedgerFirstPage: () => Promise<{ publicKey: string; index: number }[]>
    onBack: () => void
}

const NewAccountLedgerPage: React.FC<INewAccountLedgerPage> = ({
    name,
    createLedgerKey,
    removeKey,
    createAccount,
    selectAccount,
    getLedgerFirstPage,
    onBack,
}) => {
    const [inProcess, setInProcess] = useState<boolean>(false)
    const [localStep, setLocalStep] = useState<LocalStep>(LocalStep.SIGN_POLICY)
    const [error, setError] = useState<string>()

    const accountId = 0

    const [contractType, setContractType] = useState<nt.ContractType>(DEFAULT_CONTRACT_TYPE)

    const onSubmit = async () => {
        let key: nt.KeyStoreEntry | undefined
        try {
            setInProcess(true)

            key = await createLedgerKey({
                accountId,
            })

            await createAccount({ name, publicKey: key.publicKey, contractType })
        } catch (e) {
            key && removeKey({ publicKey: key.publicKey }).catch(console.error)
            setInProcess(false)
            setError(e.toString())
        }
    }

    return (
        <>
            {localStep == LocalStep.SIGN_POLICY && (
                <SignPolicy
                    onSubmit={() => {
                        setLocalStep(LocalStep.SELECT_CONTRACT_TYPE)
                    }}
                    onBack={onBack}
                />
            )}
            {localStep == LocalStep.SELECT_CONTRACT_TYPE && (
                <SelectContractType
                    onSubmit={async (contractType) => {
                        setContractType(contractType)
                        setLocalStep(LocalStep.CONNECT_LEDGER)
                    }}
                    onBack={() => {
                        setLocalStep(LocalStep.SIGN_POLICY)
                    }}
                    excludedContracts={['WalletV3']}
                />
            )}
            {localStep == LocalStep.CONNECT_LEDGER && (
                <ConnectLedger
                    onSubmit={() => {
                        // TODO
                        //onSubmit
                        return []
                    }}
                    onNext={() => {
                        // todo
                    }}
                    onBack={() => {
                        setLocalStep(LocalStep.SELECT_CONTRACT_TYPE)
                    }}
                    createLedgerKey={createLedgerKey}
                    removeKey={removeKey}
                    createAccount={createAccount}
                    selectAccount={selectAccount}
                    getLedgerFirstPage={getLedgerFirstPage}
                />
            )}
            {error && (
                <Modal
                    onClose={() => {
                        setError(undefined)
                    }}
                    className="enter-password-screen__modal"
                >
                    <h3 style={{ color: 'black', marginBottom: '18px' }}>
                        Could not create wallet
                    </h3>
                    <div className="check-seed__content-error">{error}</div>
                </Modal>
            )}
        </>
    )
}

export default NewAccountLedgerPage