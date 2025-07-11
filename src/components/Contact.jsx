import React, { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import confetti from 'canvas-confetti'
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react'

// Confetti blast function
export const blastConfetti = () => {
  const count = 200
  const defaults = {
    origin: { y: 0.7 },
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: [
      '#FF0000',  // Vivid Red
      '#FF8C00',  // Orange
      '#FFD700',  // Gold
      '#32CD32',  // Lime Green
      '#00BFFF',  // Deep Sky Blue
      '#8A2BE2',  // Blue Violet
      '#FF69B4',  // Hot Pink
      '#FF1493'   // Deep Pink
    ]
  }

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    })
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  })

  fire(0.2, {
    spread: 60,
  })

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  })

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  })

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  })
}

const Contact = () => {
  const form = useRef()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const sendEmail = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    // Note: Replace these with your actual EmailJS credentials
    emailjs.sendForm(
      'service_your_service_id', // Replace with your service ID
      'template_your_template_id', // Replace with your template ID
      form.current,
      'your_public_key', // Replace with your public key
      {
        reply_to: form.current.user_email.value
      }
    )
    .then((result) => {
      setSubmitStatus('success')
      form.current.reset()
      blastConfetti()
    }, (error) => {
      console.error('EmailJS error:', error)
      setSubmitStatus('error')
    })
    .finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <div className="bg-dark-bg py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-3xl font-bold text-dark-text mb-4">
            Contact Us
          </h2>
          <p className="text-lg text-dark-text-secondary">
            Have questions about air quality monitoring? We'd love to hear from you.
          </p>
        </div>

        <form ref={form} onSubmit={sendEmail} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="user_name" className="block text-sm font-medium text-dark-text mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="user_name"
                id="user_name"
                required
                className="input"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label htmlFor="user_email" className="block text-sm font-medium text-dark-text mb-2">
                Your Email
              </label>
              <input
                type="email"
                name="user_email"
                id="user_email"
                required
                className="input"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-dark-text mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              required
              className="input"
              placeholder="What's this about?"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-dark-text mb-2">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              rows={6}
              required
              className="input resize-none"
              placeholder="Tell us about your air quality monitoring needs..."
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary w-full flex items-center justify-center ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </>
              )}
            </button>
          </div>

          {submitStatus === 'success' && (
            <div className="flex items-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <p className="text-green-300">
                Message sent successfully! We'll get back to you soon.
              </p>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="flex items-center p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-red-300">
                Oops! Something went wrong. Please try again or contact us directly.
              </p>
            </div>
          )}
        </form>

        <div className="mt-12 text-center">
          <p className="text-sm text-dark-text-secondary">
            Note: To enable email functionality, configure EmailJS with your service credentials.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Contact