pub mod adnl;
pub mod gql;
pub mod jrpc;
use ton_block::Serializable;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

use crate::utils::*;

#[wasm_bindgen(typescript_custom_section)]
const FULL_CONTRACT_STATE: &'static str = r#"
export type FullContractState = {
    balance: string,
    genTimings: GenTimings,
    lastTransactionId: LastTransactionId,
    isDeployed: boolean,
    boc: string,
};
"#;

pub fn make_full_contract_state(
    contract_state: nt::transport::models::RawContractState,
) -> Result<JsValue, JsValue> {
    use crate::core::models::*;

    match contract_state {
        nt::transport::models::RawContractState::Exists(state) => {
            let account_cell = state.account.serialize().handle_error()?;
            let boc = ton_types::serialize_toc(&account_cell)
                .map(base64::encode)
                .handle_error()?;

            Ok(ObjectBuilder::new()
                .set("balance", state.account.storage.balance.grams.0.to_string())
                .set("genTimings", make_gen_timings(state.timings))
                .set(
                    "lastTransactionId",
                    make_last_transaction_id(state.last_transaction_id),
                )
                .set(
                    "isDeployed",
                    matches!(
                        &state.account.storage.state,
                        ton_block::AccountState::AccountActive(_)
                    ),
                )
                .set("boc", boc)
                .build()
                .unchecked_into())
        }
        nt::transport::models::RawContractState::NotExists => Ok(JsValue::undefined()),
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Promise<GenericContract>")]
    pub type PromiseGenericContract;

    #[wasm_bindgen(typescript_type = "Promise<TonWallet>")]
    pub type PromiseTonWallet;

    #[wasm_bindgen(typescript_type = "Promise<TokenWallet>")]
    pub type PromiseTokenWallet;

    #[wasm_bindgen(typescript_type = "Promise<FullContractState | undefined>")]
    pub type PromiseOptionFullContractState;
}
