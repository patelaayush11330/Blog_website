import React from "react";

const teamMembers = [
  {
    name: "Rahul",
    role: "Founder & Developer",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    email: "subhrank@example.com",
  },
  {
    name: "Mahak Agarwal",
    role: "UI/UX Designer",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    email: "aditi@example.com",
  },
  {
    name: "Subhrank Priya",
    role: "Content Strategist",
    img: "https://randomuser.me/api/portraits/men/65.jpg",
    email: "rahul@example.com",
  },
];

export default function About() {
  return (
    <div className="about-root">
      <section className="about-hero">
        <h1>About BlogHub</h1>
        <p>
          BlogHub is India's most feature-rich blogging platform. We empower writers and readers to share stories, discover new perspectives, and join a vibrant community.
        </p>
      </section>

      <section className="about-highlights">
        <h2>Our Mission</h2>
        <p>
          To create a safe, inclusive, and inspiring space for everyone to express, learn, and grow through the power of words.
        </p>
        <div className="about-features">
          <div>
            <h3>📝 Easy Publishing</h3>
            <p>Write, edit, and publish your stories with a simple, intuitive editor.</p>
          </div>
          <div>
            <h3>🌐 Diverse Community</h3>
            <p>Connect with writers and readers from all walks of life.</p>
          </div>
          <div>
            <h3>🚀 Discover & Grow</h3>
            <p>Explore trending topics, featured blogs, and expert tips to enhance your skills.</p>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2>Meet Our Team</h2>
        <div className="team-cards">
          {teamMembers.map((member, idx) => (
            <div className="team-card" key={idx}>
              <img src={member.img} alt={member.name} />
              <h3>{member.name}</h3>
              <p className="role">{member.role}</p>
              <a href={`mailto:${member.email}`}>Contact</a>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .about-root {
          font-family: 'Segoe UI', Arial, sans-serif;
          color: #232323;
          background: linear-gradient(135deg, #f7fafc 0%, #e3f0ff 100%);
          min-height: 100vh;
          padding-bottom: 40px;
        }
        .about-hero {
          padding: 60px 20px 30px 20px;
          text-align: center;
          background: linear-gradient(120deg, #e0e7ff 0%, #fffbe6 100%);
          border-radius: 0 0 30px 30px;
        }
        .about-hero h1 {
          font-size: 2.8rem;
          font-weight: bold;
          margin-bottom: 15px;
          color: #1a237e;
        }
        .about-hero p {
          font-size: 1.2rem;
          color: #444;
          max-width: 700px;
          margin: 0 auto;
        }
        .about-highlights {
          margin: 40px auto 0 auto;
          max-width: 900px;
          padding: 0 20px;
        }
        .about-highlights h2 {
          font-size: 2rem;
          color: #1976d2;
          margin-bottom: 10px;
        }
        .about-highlights p {
          font-size: 1.1rem;
          margin-bottom: 30px;
        }
        .about-features {
          display: flex;
          gap: 25px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .about-features > div {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(30, 64, 175, 0.08);
          padding: 25px 20px;
          flex: 1 1 240px;
          min-width: 220px;
          max-width: 280px;
          margin-bottom: 10px;
        }
        .about-features h3 {
          margin: 0 0 10px 0;
          color: #1565c0;
          font-size: 1.1rem;
        }
        .about-features p {
          margin: 0;
          color: #333;
        }
        .about-team {
          margin: 60px auto 0 auto;
          max-width: 900px;
          padding: 0 20px;
          text-align: center;
        }
        .about-team h2 {
          font-size: 2rem;
          color: #1976d2;
          margin-bottom: 30px;
        }
        .team-cards {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .team-card {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(30, 64, 175, 0.1);
          padding: 30px 22px;
          max-width: 220px;
          text-align: center;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .team-card:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 8px 24px rgba(30, 64, 175, 0.18);
        }
        .team-card img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 15px;
        }
        .team-card h3 {
          margin: 10px 0 5px 0;
          color: #1a237e;
          font-size: 1.1rem;
        }
        .team-card .role {
          color: #757575;
          font-size: 0.98rem;
          margin-bottom: 12px;
        }
        .team-card a {
          display: inline-block;
          background: #1976d2;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          padding: 8px 16px;
          font-size: 0.97rem;
          transition: background 0.18s;
        }
        .team-card a:hover {
          background: #0d47a1;
        }
        @media (max-width: 800px) {
          .about-features {
            flex-direction: column;
            align-items: center;
          }
          .team-cards {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
