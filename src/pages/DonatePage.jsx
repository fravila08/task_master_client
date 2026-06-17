import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useApp } from '../context/AppContext'
import supabase from '../services/supabaseClient'
import Layout from '../components/Layout'
import './DonatePage.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const PRESETS = [5, 10, 25, 50]

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#e0e0f0',
      fontFamily: '"Share Tech Mono", monospace',
      fontSize: '14px',
      '::placeholder': { color: '#8888aa' },
    },
    invalid: { color: '#ff003c' },
  },
}

function DonationForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { currentUser } = useApp()

  const [selectedAmount, setSelectedAmount] = useState(10)
  const [customAmount, setCustomAmount] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [paidAmount, setPaidAmount] = useState(0)

  const dollarAmount = customAmount !== '' ? parseFloat(customAmount) : selectedAmount
  const centsAmount = Math.round(dollarAmount * 100)

  function handlePreset(dollars) {
    setSelectedAmount(dollars)
    setCustomAmount('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return

    if (!Number.isFinite(centsAmount) || centsAmount < 1 || centsAmount > 1_000_000) {
      setStatus('error')
      setErrorMessage('Please enter an amount between $0.01 and $10,000.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    let clientSecret
    try {
      const { data, error } = await supabase.functions.invoke('process-donation', {
        body: { amount: centsAmount, user_id: currentUser.id },
      })
      if (error) throw new Error(error.message)
      clientSecret = data.client_secret
    } catch (err) {
      const msg = err.message || 'Failed to reach payment server.'
      const isNetwork = msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')
      setStatus(isNetwork ? 'network-error' : 'error')
      setErrorMessage(msg)
      return
    }

    const cardElement = elements.getElement(CardElement)
    const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    })

    if (stripeError) {
      setStatus('error')
      setErrorMessage(stripeError.message || 'Payment failed. Please check your card details.')
      return
    }

    setPaidAmount(dollarAmount)
    setStatus('success')
  }

  function handleRetry() {
    setStatus('idle')
    setErrorMessage('')
  }

  if (status === 'success') {
    return (
      <div className="donate-success">
        <p className="donate-success-msg">
          Payment of <strong>${paidAmount.toFixed(2)}</strong> received. Thank you!
        </p>
      </div>
    )
  }

  return (
    <form className="donate-form" onSubmit={handleSubmit}>
      <p className="donate-subtitle">Support this project with a one-time donation.</p>

      <div className="donate-presets">
        {PRESETS.map(amt => (
          <button
            key={amt}
            type="button"
            className={`donate-preset${selectedAmount === amt && customAmount === '' ? ' active' : ''}`}
            onClick={() => handlePreset(amt)}
          >
            ${amt}
          </button>
        ))}
      </div>

      <div className="donate-custom">
        <span className="donate-custom-prefix">$</span>
        <input
          type="number"
          className="donate-custom-input"
          placeholder="Custom amount"
          min="0.01"
          step="0.01"
          value={customAmount}
          onChange={e => {
            setCustomAmount(e.target.value)
            setSelectedAmount(null)
          }}
        />
      </div>

      <div className="donate-card-wrapper">
        <label className="donate-card-label">CARD DETAILS</label>
        <div className="donate-card-element">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {status === 'error' && (
        <p className="donate-error">{errorMessage}</p>
      )}

      {status === 'network-error' && (
        <div className="donate-network-error">
          <p>{errorMessage}</p>
          <button type="button" className="donate-retry" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      <button
        type="submit"
        className="donate-submit"
        disabled={status === 'loading' || !stripe}
      >
        {status === 'loading'
          ? 'Processing...'
          : `Donate $${Number.isFinite(dollarAmount) && dollarAmount > 0 ? dollarAmount.toFixed(2) : '—'}`}
      </button>
    </form>
  )
}

export default function DonatePage() {
  return (
    <Layout>
      <div className="donate-page">
        <h2 className="donate-title">Buy Me a Coffee</h2>
        <Elements stripe={stripePromise}>
          <DonationForm />
        </Elements>
      </div>
    </Layout>
  )
}
