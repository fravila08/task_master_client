import Layout from '../components/Layout'
import './ContactPage.css'

export default function ContactPage() {
  return (
    <Layout>
      <div className="contact-content">
        <p className="contact-intro">
          Need help? Have a question? We've got your back. Reach out through any of the channels below — our team responds fast.
        </p>

        <section className="contact-section">
          <h3 className="contact-heading">As a customer</h3>
          <ul className="contact-list">
            <li>
              <span className="contact-label">email</span>
              <a href="mailto:fr4v1l4@gmail.com" className="contact-value">fr4v1l4@gmail.com</a>
            </li>
            <li>
              <span className="contact-label">phone</span>
              <span className="contact-value">555-555-5555</span>
            </li>
          </ul>
        </section>

        <section className="contact-section">
          <h3 className="contact-heading">As a dev</h3>
          <ul className="contact-list">
            <li>
              <span className="contact-label">github</span>
              <a
                href="https://github.com/fravila08/task_master"
                target="_blank"
                rel="noreferrer"
                className="contact-value"
              >
                fravila08/task_master
              </a>
            </li>
            <li>
              <span className="contact-label">linkedin</span>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="contact-value"
              >
                linkedin
              </a>
            </li>
          </ul>
        </section>
      </div>
    </Layout>
  )
}
