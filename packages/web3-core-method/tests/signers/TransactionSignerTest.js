import * as sinonLib from 'sinon';
import {WebsocketProvider, SocketProviderAdapter} from 'web3-providers';
import {Accounts} from 'web3-eth-accounts';
import TransactionSigner from '../../src/signers/TransactionSigner';

const sinon = sinonLib.createSandbox();

/**
 * TransactionSigner test
 */
describe('TransactionSignerTest', () => {
    let transactionSigner, provider, providerAdapter, accounts, accountsMock;

    beforeEach(() => {
        provider = new WebsocketProvider('ws://127.0.0.1', {});

        providerAdapter = new SocketProviderAdapter(provider);

        accounts = new Accounts(providerAdapter, {});
        accountsMock = sinon.mock(accounts);

        transactionSigner = new TransactionSigner();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('calls sign and throws error', () => {
        transactionSigner.sign({from: 0}, accounts).catch((error) => {
            expect(error.message).equal('Wallet or privateKey in wallet is not set!');
        });
    });

    it('calls sign and returns signed transaction', async () => {
        accounts.wallet[0] = {privateKey: '0x0'};
        const transaction = {
            from: 0
        };

        accountsMock
            .expects('signTransaction')
            .withArgs(transaction, '0x0')
            .returns(
                new Promise((resolve) => {
                    resolve('0x0');
                })
            )
            .once();

        const returnValue = await transactionSigner.sign(transaction, accounts);

        expect(returnValue).toBe('0x0');
        expect(transaction.from).toBe(undefined);

        accountsMock.verify();
    });
});