import { useEffect, useState } from 'react'
import Web3 from "web3"
import Web3Modal from "web3modal"
import WalletConnectProvider from "@walletconnect/web3-provider";
import config from '../config.json'

var MicroModal

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "3f328ea098d5463c94ee12dc73cd9a3d"
    }
  },
};

export default function Home() {
  const [currentSupply, setCurrentSupply] = useState(null)
  const [maxSupply, setMaxSupply] = useState(null)
  const [walletAddress, setWalletAddress] = useState(null)
  const [price, setPrice] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [mintTransactionStatus, setMintTransactionStatus] = useState(0)
  const [mintTransactionCustomError, setMintTransactionCustomError] = useState("")
  const [mintTransactionID, setMintTransactionID] = useState(null)
  const [saleActive, setSaleActive] = useState(false)
  const [contract, setContract] = useState(false)

  useEffect(() => {
    MicroModal = require('micromodal');
    signIn();
  }, []);

  async function signIn() {
    if (typeof window.web3 !== 'undefined') {
      const web3Modal = new Web3Modal({
        network: config.NETWORK,
        cacheProvider: false,
        providerOptions,
        theme: "light"
      });

      web3Modal.on("connect", (info) => {
        setWalletAddress(info.selectedAddress)
      });

      web3Modal.on("disconnect", (error) => {
        setWalletAddress(null)
      });

      const provider = await web3Modal.connect();
      console.log(provider)
      if (!!provider) {
        provider.on("accountsChanged", (accounts) => {
          setWalletAddress(accounts[0])
        })

        let w3 = new Web3(provider)
        let con = new w3.eth.Contract(config.ABI, config.ADDRESS)
        setContract(con)
        loadContractData(con)
      }
    } else {
      MicroModal.default.init()
      MicroModal.default.show("modal-eth-wallet")
    }
  }

  async function loadContractData(con) {
    setMaxSupply(await con.methods.MAX_TOKENS().call())
    setPrice(await con.methods.PRICE().call())
    setSaleActive(true)

    let supplyVal = await con.methods.totalSupply().call()
    supplyVal = +supplyVal
    const origSupplyVal = +supplyVal

    if (supplyVal < 1012) {
      supplyVal += 1012
    } else {
      supplyVal *= 5;
    }

    let multiplier = 5;

    while (supplyVal > 6969) {
      supplyVal = origSupplyVal * multiplier
      multiplier -= 0.1
    }

    supplyVal = parseInt(supplyVal, 10)

    if (supplyVal !== maxSupply) {
      setCurrentSupply(supplyVal)
    }

  }

  async function mint() {
    setMintTransactionStatus(0)
    setMintTransactionCustomError("")

    MicroModal.default.init()
    MicroModal.default.show("modal-mint")

    let totalPrice = Number(price) * quantity

    contract.methods.mintToken(quantity).estimateGas({ from: walletAddress, value: totalPrice }).then(gasAmount => {
      contract.methods.mintToken(quantity).send({ from: walletAddress, value: totalPrice, gas: String(gasAmount) })
        .on('transactionHash', function (hash) {
          setMintTransactionID(hash)
          setMintTransactionStatus(1)
          console.log("transactionHash", hash)
        })
        .on('receipt', function (receipt) {
          setMintTransactionStatus(2)
          loadContractData(contract)
          console.log("receipt", receipt)
        })
        .on('error', function (err) {
          setMintTransactionStatus(3)
          console.error(err)
        })
    }).catch(err => {
      setMintTransactionStatus(3)
      setMintTransactionCustomError(err?.message?.split("\n")[0])
      console.error(err)
    })
  }


  var truncate = function (fullStr, strLen, separator) {
    if (fullStr.length <= strLen) return fullStr;

    separator = separator || '...';

    var sepLen = separator.length,
      charsToShow = strLen - sepLen,
      frontChars = Math.ceil(charsToShow / 2),
      backChars = Math.floor(charsToShow / 2);

    return fullStr.substr(0, frontChars) +
      separator +
      fullStr.substr(fullStr.length - backChars);
  };



  return (
    <main className="text-center">
      <section>
        <div className="row justify-content-end">
          <div className="col-sm-8 col-md-6 col-lg-4">
            {!!walletAddress &&
              <b>{truncate(walletAddress, 22)}</b>
            }
          </div>
        </div>

        {!walletAddress ?
          <button data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="250" type="button" className="btn bg-color-orange text-white fs-4" onClick={() => signIn()}>Connect Wallet</button>
          :
          <div>
            {saleActive ?
              <div className="row justify-content-center">
                <div className="col-sm-8 col-md-6 col-lg-4">
                  <img width={150} alt="logo" src="images/img.png"></img>
                  <div className="input-group mt-4">
                    <select
                      className="form-control text-center"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                      }}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                      <option value="13">13</option>
                      <option value="14">14</option>
                      <option value="15">15</option>
                      <option value="16">16</option>
                      <option value="17">17</option>
                      <option value="18">18</option>
                      <option value="19">19</option>
                      <option value="20">20</option>
                    </select>
                  </div>
                  <button disabled={!quantity} type="button" className="btn fs-4 bg-color-orange my-4" onClick={() => mint()}>Mint Now</button>
                  <p><b>{currentSupply}/6969 MINTED!</b></p>
                </div>
              </div>
              :
              <div></div>
            }
          </div>
        }
      </section>

      {/* MODALS */}
      <div className="modal micromodal-slide" id="modal-mint" aria-hidden="true">
        <div className="modal__overlay" tabIndex="-1">
          <div className="modal__container bg-color-green" role="dialog" aria-modal="true" aria-labelledby="modal-mint-title">
            <main className="modal__content" id="modal-mint-content">
              {
                {
                  0: <div>
                    <h4 className="modal__content__header">Signature Required</h4>
                    <p>Waiting for you to sign the transaction...</p>
                    <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                  </div>,
                  1: <div>
                    <h4 className="modal__content__header">Please Wait</h4>
                    <p>Confirming transaction on the blockchain...</p>
                    <p><a target="_blank" rel="noreferrer" href={`https://etherscan.io/tx/${mintTransactionID}`}>Transaction Link (Etherscan)</a></p>
                    <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                  </div>,
                  2: <div>
                    <h4 className="modal__content__header mb-4">Transaction Success</h4>
                    <p><a target="_blank" rel="noreferrer" href={`https://etherscan.io/tx/${mintTransactionID}`}>Transaction Link (Etherscan)</a></p>
                  </div>,
                  3: <div>
                    <h4 className="modal__content__header">Transaction Error</h4>
                    {
                      !!mintTransactionCustomError ?
                        <p>{mintTransactionCustomError}</p>
                        :
                        <p>There was a problem minting</p>
                    }
                  </div>
                }[mintTransactionStatus]
              }
            </main>
            <footer className="modal__footer">
              <button type="button" className="btn bg-color-xlightgrey text-white fs-4" data-micromodal-close>Close</button>
            </footer>
          </div>
        </div>
      </div>

    </main >
  )
}
