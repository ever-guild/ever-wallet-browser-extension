import React from 'react'
import { useForm } from 'react-hook-form'

import Input from '@components/Input'
import Button from '@components/Button'

import './style.scss'

type IEnterPasswordScreen = {
    onSubmit: (password: string) => void
    onBack: () => void
}

const EnterNewPassword: React.FC<IEnterPasswordScreen> = ({ onSubmit, onBack }) => {
    const { register, handleSubmit, errors, watch, getValues } = useForm()

    return (
        <div className="enter-password__content">
            <div className="enter-password__content-pwd-form">
                <h2 className="enter-password__content-pwd-form-header">Password protection</h2>
                <h3 className="enter-password__content-pwd-form-comment">
                    So no one else, but you can unlock your wallet.
                </h3>
                <form
                    id="password"
                    onSubmit={handleSubmit(() => {
                        onSubmit(getValues('pwd'))
                    })}
                    style={{ position: 'relative' }}
                >
                    <Input
                        label={'Your password'}
                        autoFocus
                        type={'password'}
                        name="pwd"
                        register={register({
                            required: true,
                            minLength: 6,
                        })}
                    />
                    <Input
                        label={'Confirm password'}
                        type={'password'}
                        name="pwdConfirm"
                        register={register({
                            required: true,
                            validate: (value) => value === watch('pwd'),
                        })}
                    />
                    {errors.pwd && (
                        <div className="check-seed__content-error">
                            The password is required and must be minimum 6 characters long
                        </div>
                    )}
                    {errors.pwdConfirm && (
                        <div className="check-seed__content-error">Your password doesn't match</div>
                    )}
                </form>
            </div>
            <div className="enter-password__content-buttons">
                <Button text={'Sign in the wallet'} type="submit" form="password" />
                <Button text={'Back'} white onClick={onBack} />
            </div>
        </div>
    )
}

export default EnterNewPassword
