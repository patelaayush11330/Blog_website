import React from "react";

export default function Privacy() {
  return (
    <div className="privacy-root">
      <section className="privacy-hero">
        <h1>Privacy Policy</h1>
        <p>
          Your privacy is our top priority. This policy describes how BlogHub collects, uses, and protects your personal information.
        </p>
      </section>

      <section className="privacy-content">
        <div className="privacy-section">
          <h2>1. Information We Collect</h2>
          <ul>
            <li>
              <span className="icon">&#128100;</span>
              <strong>Account Information:</strong> Name, email address, and profile details when you register.
            </li>
            <li>
              <span className="icon">&#128221;</span>
              <strong>Content:</strong> Posts, comments, and messages you create on BlogHub.
            </li>
            <li>
              <span className="icon">&#128187;</span>
              <strong>Usage Data:</strong> Analytics data such as pages visited, device type, and IP address.
            </li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>
              <span className="icon">&#9881;&#65039;</span>
              To provide and personalize our services.
            </li>
            <li>
              <span className="icon">&#128172;</span>
              To communicate updates, respond to inquiries, and send notifications.
            </li>
            <li>
              <span className="icon">&#128200;</span>
              To improve user experience and site security.
            </li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>3. Sharing & Disclosure</h2>
          <ul>
            <li>
              <span className="icon">&#10060;</span>
              We do not sell your personal information.
            </li>
            <li>
              <span className="icon">&#128274;</span>
              We may share data with trusted partners for analytics and service improvement, under strict confidentiality.
            </li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>4. Data Security</h2>
          <ul>
            <li>
              <span className="icon">&#128274;</span>
              Your data is protected with industry-standard security practices.
            </li>
            <li>
              <span className="icon">&#128274;</span>
              We use encryption and regular security reviews to keep your information safe.
            </li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>5. Your Rights</h2>
          <ul>
            <li>
              <span className="icon">&#128221;</span>
              You can update or delete your account at any time.
            </li>
            <li>
              <span className="icon">&#9993;&#65039;</span>
              Contact us for data access, correction, or deletion requests.
            </li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>6. Changes to this Policy</h2>
          <p>
            We may update this policy from time to time. We will notify you of significant changes via email or on our website.
          </p>
        </div>

        <div className="privacy-section">
          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please email us at{" "}
            <a href="mailto:privacy@bloghub.com">privacy@bloghub.com</a>.
          </p>
        </div>
      </section>

      <style>{`
        .privacy-root {
          font-family: 'Segoe UI', Arial, sans-serif;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          min-height: 100vh;
          padding-bottom: 40px;
          display: flex;
          flex-direction: column;
        }
        .privacy-hero {
          padding: 70px 20px 36px 20px;
          text-align: center;
          background: linear-gradient(120deg, #e0e7ff 0%, #fffbe6 100%);
          border-radius: 0 0 36px 36px;
          box-shadow: 0 4px 32px rgba(30, 64, 175, 0.10);
          margin-bottom: 30px;
        }
        .privacy-hero h1 {
          font-size: 2.9rem;
          font-weight: 800;
          color: #1976d2;
          letter-spacing: 1.5px;
          margin-bottom: 12px;
          text-shadow: 0 2px 12px rgba(30,64,175,0.07);
          animation: fadeInDown 1s;
        }
        .privacy-hero p {
          font-size: 1.18rem;
          color: #333;
          max-width: 700px;
          margin: 0 auto;
          animation: fadeIn 1.5s;
        }
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-40px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeIn {
          0% { opacity: 0;}
          100% { opacity: 1;}
        }
        .privacy-content {
          background: rgba(255,255,255,0.75);
          box-shadow: 0 8px 40px rgba(30,64,175,0.18), 0 1.5px 8px rgba(30,64,175,0.08);
          max-width: 850px;
          margin: 0 auto 40px auto;
          padding: 44px 38px 32px 38px;
          border-radius: 24px;
          backdrop-filter: blur(8px);
          border: 1.5px solid rgba(30,64,175,0.10);
          position: relative;
        }
        .privacy-section:not(:last-child) {
          border-bottom: 1.5px solid #e3eafc;
          margin-bottom: 32px;
          padding-bottom: 22px;
        }
        .privacy-section h2 {
          color: #1e3c72;
          font-size: 1.32rem;
          font-weight: 700;
          margin-top: 0;
          margin-bottom: 14px;
          letter-spacing: 0.5px;
          position: relative;
          padding-left: 6px;
          animation: fadeInDown 1.2s;
        }
        .privacy-section h2:before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 24px;
          background: linear-gradient(135deg, #1976d2 60%, #42a5f5 100%);
          border-radius: 4px;
          margin-right: 14px;
          vertical-align: middle;
        }
        .privacy-section ul {
          margin: 0 0 0 0;
          padding: 0;
          color: #222;
          list-style: none;
        }
        .privacy-section li {
          margin-bottom: 14px;
          font-size: 1.06rem;
          display: flex;
          align-items: flex-start;
          line-height: 1.6;
          background: rgba(30, 64, 175, 0.04);
          border-radius: 8px;
          padding: 8px 14px 8px 10px;
          transition: background 0.2s;
        }
        .privacy-section li:hover {
          background: rgba(25, 118, 210, 0.13);
        }
        .icon {
          font-size: 1.25rem;
          margin-right: 10px;
          margin-top: 2px;
          color: #1976d2;
          flex-shrink: 0;
        }
        .privacy-section p {
          color: #222;
          font-size: 1.07rem;
          margin: 0 0 8px 0;
        }
        .privacy-section a {
          color: #1976d2;
          text-decoration: underline;
          font-weight: 500;
          transition: color 0.18s;
        }
        .privacy-section a:hover {
          color: #0d47a1;
          text-shadow: 0 2px 8px rgba(25,118,210,0.10);
        }
        @media (max-width: 900px) {
          .privacy-content {
            max-width: 98vw;
            padding: 24px 4vw 18px 4vw;
          }
        }
        @media (max-width: 600px) {
          .privacy-content {
            padding: 16px 2vw 12px 2vw;
          }
          .privacy-hero {
            padding: 40px 8px 18px 8px;
          }
          .privacy-hero h1 {
            font-size: 2.1rem;
          }
        }
      `}</style>
    </div>
  );
}
