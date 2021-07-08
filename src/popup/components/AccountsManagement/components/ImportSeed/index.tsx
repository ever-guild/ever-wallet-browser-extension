import * as React from 'react'
import { useForm } from 'react-hook-form'

import Button from '@popup/components/Button'
import Input from '@popup/components/Input'


type Props = {
	wordsCount: number;
	onSubmit(words: string[]): void;
	onBack(): void;
}

export function ImportSeed({ wordsCount = 12, onBack, ...props }: Props): JSX.Element {
	const { register, handleSubmit, setValue } = useForm()

	const numbers = React.useMemo(
		() => new Array(wordsCount).fill(1).map((_, i) => i + 1),
		[wordsCount]
	)

	const onPaste: React.ClipboardEventHandler<HTMLFormElement> = (event) => {
		try {
			const seedPhrase = event.clipboardData.getData('text/plain')
			const words = seedPhrase
				.replace(/\s\s+/g, ' ')
				.split(' ')
				.slice(0, wordsCount)

			if (words.length > 0 && words.length <= wordsCount) {
				setTimeout(() => {
					words.forEach((word, idx) => {
						setValue(`word${idx + 1}`, word)
					})
				}, 0)
			}
		} catch (e) {}
	}

	const onSubmit = (data: { [word: string]: string }) => {
		props.onSubmit(window.ObjectExt.values(data))
	}

	return (
		<>
			<div className="accounts-management__content">
				<h2 className="accounts-management__content-title">Let’s check the seed phrase</h2>
				<form
					id="words"
					onSubmit={handleSubmit(onSubmit)}
					className="accounts-management__content-form"
					onPaste={onPaste}
				>
					<div className="accounts-management__seed-columns">
						<div className="accounts-management__seed-column">
							{numbers.slice(0, wordsCount / 2).map((number, idx) => (
								<div
									key={number}
									className="accounts-management__seed-input"
								>
									<span className="accounts-management__seed-input-number">{`${number}. `}</span>
									<Input
										autoFocus={idx === 0}
										className="accounts-management__seed-input-placeholder"
										label="Word..."
										name={`word${number}`}
										register={register({
											required: true,
										})}
										type="text"
										value=""
									/>
								</div>
							))}
						</div>
						<div className="accounts-management__seed-column">
							{numbers.slice(wordsCount / 2, wordsCount).map((number) => (
								<div
									key={number}
									className="accounts-management__seed-input"
								>
									<span className="accounts-management__seed-input-number">{`${number}. `}</span>
									<Input
										className="accounts-management__seed-input-placeholder"
										label="Word..."
										name={`word${number}`}
										register={register({
											required: true,
										})}
										type="text"
										value=""
									/>
								</div>
							))}
						</div>
					</div>
				</form>

				<div className="accounts-management__content-buttons">
					<div className="accounts-management__content-buttons-back-btn">
						<Button text="Back" white onClick={onBack} />
					</div>
					<Button text="Confirm" form="words" onClick={handleSubmit(onSubmit)} />
				</div>
			</div>
		</>
	)
}
