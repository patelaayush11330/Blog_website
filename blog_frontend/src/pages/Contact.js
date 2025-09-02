import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple front-end validation
    if (!form.name || !form.email || !form.message) {
      setStatus("Please fill in all fields.");
      return;
    }
    setStatus("Sending...");

    // Example: Replace with your backend or Formspree endpoint
    try {
      // Uncomment and set your endpoint:
      // await fetch("YOUR_ENDPOINT_URL", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });
      setStatus("Thank you for reaching out! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="contact-root">
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>
          Have questions, suggestions, or feedback? Fill out the form below and our team will get in touch!
        </p>
      </section>

      <form className="contact-form" onSubmit={handleSubmit} autoComplete="off">
        <label>
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />
        </label>

        <label>
          Message
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Type your message here..."
            rows={5}
            required
          />
        </label>

        <button type="submit">Send Message</button>
        {status && <div className="form-status">{status}</div>}
      </form>

      <style>{`
        .contact-root {
          font-family: 'Segoe UI', Arial, sans-serif;
          background: linear-gradient(120deg, #e3f0ff 0%, #f7fafc 100%);
          min-height: 100vh;
          padding-bottom: 40px;
        }
        .contact-hero {
          padding: 60px 20px 30px 20px;
          text-align: center;
          background: linear-gradient(120deg, #e0e7ff 0%, #fffbe6 100%);
          border-radius: 0 0 30px 30px;
        }
        .contact-hero h1 {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1976d2;
        }
        .contact-hero p {
          font-size: 1.1rem;
          color: #444;
          max-width: 600px;
          margin: 0 auto;
        }
        .contact-form {
          background: #fff;
          max-width: 430px;
          margin: 40px auto 0 auto;
          padding: 32px 28px 24px 28px;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(30, 64, 175, 0.10);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .contact-form label {
          font-size: 1.01rem;
          color: #1a237e;
          margin-bottom: 6px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 10px 12px;
          margin-top: 6px;
          border: 1.5px solid #b3c7f7;
          border-radius: 7px;
          font-size: 1rem;
          background: #f8fbff;
          transition: border 0.18s;
          resize: none;
        }
        .contact-form input:focus,
        .contact-form textarea:focus {
          border-color: #1976d2;
          outline: none;
        }
        .contact-form button {
          background: #1976d2;
          color: #fff;
          font-size: 1.07rem;
          border: none;
          border-radius: 7px;
          padding: 12px 0;
          cursor: pointer;
          margin-top: 10px;
          transition: background 0.18s;
          font-weight: 500;
        }
        .contact-form button:hover {
          background: #0d47a1;
        }
        .form-status {
          margin-top: 10px;
          font-size: 1rem;
          color: #1565c0;
          min-height: 24px;
        }
        @media (max-width: 600px) {
          .contact-form {
            max-width: 98vw;
            padding: 22px 8vw 18px 8vw;
          }
        }
      `}</style>
    </div>
  );
}
