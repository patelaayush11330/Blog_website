import React from "react";

export default function Terms() {
  return (
    <div className="privacy-root">
      <section className="privacy-hero">
        <h1>Terms & Conditions</h1>
        <p>
          Please read these terms and conditions carefully before using BlogHub. By accessing or using our website, you agree to comply with and be bound by these terms.
        </p>
      </section>

      <section className="privacy-content">
        <div className="privacy-section">
          <h2>1. Acceptance of Terms</h2>
          <ul>
            <li>
              <span className="icon">&#9989;</span>
              By accessing BlogHub, you agree to these Terms & Conditions and our Privacy Policy.
            </li>
            <li>
              <span className="icon">&#128221;</span>
              If you do not agree with any part of the terms, you must not use our website.
            </li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>2. User Accounts</h2>
          <ul>
            <li>
              <span className="icon">&#128100;</span>
              You are responsible for maintaining the confidentiality of your account and password.
            </li>
            <li>
              <span className="icon">&#128274;</span>
              You agree to notify us immediately of any unauthorized use of your account.
            </li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>3. User Content</h2>
          <ul>
            <li>
              <span className="icon">&#128221;</span>
              You retain ownership of the content you post, but grant BlogHub a license to use, display, and distribute it.
            </li>
            <li>
              <span className="icon">&#9888;&#65039;</span>
              Content must not violate any laws or infringe on any third-party rights.
            </li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>4. Prohibited Activities</h2>
          <ul>
            <li>
              <span className="icon">&#10060;</span>
              Do not post spam, offensive, or harmful content.
            </li>
            <li>
              <span className="icon">&#128683;</span>
              Do not attempt to gain unauthorized access to our systems.
            </li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>5. Termination</h2>
          <ul>
            <li>
              <span className="icon">&#9940;</span>
              We reserve the right to suspend or terminate your account for violations of these terms.
            </li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>6. Limitation of Liability</h2>
          <ul>
            <li>
              <span className="icon">&#9888;&#65039;</span>
              BlogHub is provided "as is" without warranties of any kind. We are not liable for any damages resulting from your use of the site.
            </li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>7. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of BlogHub after changes constitutes acceptance of the new terms.
          </p>
        </div>

        <div className="privacy-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms & Conditions, please email us at{" "}
            <a href="mailto:terms@bloghub.com">teams@bloghub.com</a>.
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
