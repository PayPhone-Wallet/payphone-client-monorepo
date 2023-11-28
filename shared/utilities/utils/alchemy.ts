import { erc20ABI, SupportedNetwork, VIEM_CHAIN } from '..'
import {
  getDefaultLightAccountFactoryAddress,
  LightSmartContractAccount
} from '@alchemy/aa-accounts'
import { AlchemyProvider } from '@alchemy/aa-alchemy'
import { LocalAccountSigner } from '@alchemy/aa-core'
import { Address, encodeFunctionData, HttpTransport } from 'viem'

/**
 * Returns an `AlchemyProvider` to send gas abstracted transactions through
 * @param chainId the chain ID transactions should be submitted to
 * @param privateKey the private key of the signing wallet
 * @param apiKey an alchemy API key
 * @returns
 */
export const getAlchemyProvider = (
  chainId: SupportedNetwork,
  privateKey: `0x${string}`,
  apiKey: string
) => {
  const chain = VIEM_CHAIN[chainId]
  const owner = LocalAccountSigner.privateKeyToAccountSigner(privateKey)
  const factoryAddress = getDefaultLightAccountFactoryAddress(chain)

  return new AlchemyProvider({ apiKey, chain }).connect(
    (rpcClient) => new LightSmartContractAccount({ rpcClient, owner, chain, factoryAddress })
  )
}

/**
 * Sends a user operation request to the gas abstracted transactions API
 * @param target the contract that is being targeted with this transaction
 * @param data the transaction's calldata
 * @param alchemyProvider an `AlchemyProvider` object
 * @param options optional parameters
 * @returns
 */
export const sendUserOperation = async (
  target: Address,
  data: `0x${string}`,
  alchemyProvider: AlchemyProvider & {
    account: LightSmartContractAccount<HttpTransport>
  },
  options?: { value?: bigint }
) => {
  const { hash } = await alchemyProvider.sendUserOperation({ target, data, value: options?.value })
  const txHash = await alchemyProvider.waitForUserOperationTransaction(hash)
  return txHash
}

/**
 * Sends a user operation request to transfer an amount of tokens
 * @param recipient the address to send tokens to
 * @param amount the amount of tokens to transfer
 * @param alchemyProvider an `AlchemyProvider` object
 * @returns
 */
export const sendTransferPayTokenUserOperation = async (
  recipient: Address,
  amount: bigint,
  alchemyProvider: AlchemyProvider & {
    account: LightSmartContractAccount<HttpTransport>
  }
) => {
  const target = await alchemyProvider.account.getAddress()

  const data = encodeFunctionData({
    abi: erc20ABI,
    functionName: 'transfer',
    args: [recipient, amount]
  })

  const txHash = await sendUserOperation(target, data, alchemyProvider)

  return txHash
}
