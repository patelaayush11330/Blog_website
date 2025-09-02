import React, { useState } from "react";

const careersData = [
  {
    id: 1,
    title: "Frontend React Developer",
    location: "Remote / Bengaluru, India",
    type: "Full Time",
    description:
      "Work on modern UI/UX, build reusable components, and collaborate with a passionate team to deliver a world-class blogging platform.",
    requirements: [
      "2+ years experience with React.js",
      "Strong CSS and JavaScript skills",
      "Experience with REST APIs",
      "Familiarity with Git and agile workflows",
    ],
    applyEmail: "careers@bloghub.com",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    location: "Remote / Mumbai, India",
    type: "Contract",
    description:
      "Design intuitive interfaces and create engaging user experiences for millions of readers and writers.",
    requirements: [
      "1+ year experience in UI/UX design",
      "Proficiency in Figma or Adobe XD",
      "Portfolio of web or app designs",
      "Excellent communication skills",
    ],
    applyEmail: "careers@bloghub.com",
  },
];

export default function Career() {
  const [selectedCareer, setSelectedCareer] = useState(null);

  return (
    <div className="privacy-root">
      <section className="privacy-hero">
        <h1>Careers at BlogHub</h1>
        <p>
          Join our mission to empower storytellers and readers everywhere. Explore open roles and become part of a creative, remote-first team.
        </p>
      </section>

      <section className="privacy-content">
        {!selectedCareer ? (
          <div>
            <div className="privacy-section">
              <h2>Open Positions</h2>
              <ul className="career-list">
                {careersData.map((job) => (
                  <li
                    key={job.id}
                    className="career-list-item"
                    onClick={() => setSelectedCareer(job)}
                  >
                    <span className="icon">&#128188;</span>
                    <div>
                      <div className="career-title">{job.title}</div>
                      <div className="career-meta">
                        <span>{job.location}</span> | <span>{job.type}</span>
                      </div>
                    </div>
                    <span className="arrow">&#8594;</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="privacy-section">
              <h2>Why Work With Us?</h2>
              <ul>
                <li>
                  <span className="icon">&#128640;</span>
                  Flexible remote work and supportive team culture.
                </li>
                <li>
                  <span className="icon">&#127942;</span>
                  Opportunity to shape the future of online publishing.
                </li>
                <li>
                  <span className="icon">&#128187;</span>
                  Access to the latest tools and technologies.
                </li>
                <li>
                  <span className="icon">&#127881;</span>
                  Growth, learning, and recognition for your contributions.
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="privacy-section career-detail">
            <button
              className="back-btn"
              onClick={() => setSelectedCareer(null)}
            >
              &#8592; Back to Openings
            </button>
            <h2>{selectedCareer.title}</h2>
            <div className="career-meta-detail">
              <span>
                <strong>Location:</strong> {selectedCareer.location}
              </span>
              <span>
                <strong>Type:</strong> {selectedCareer.type}
              </span>
            </div>
            <p className="career-description">{selectedCareer.description}</p>
            <h3>Requirements</h3>
            <ul>
              {selectedCareer.requirements.map((req, idx) => (
                <li key={idx}>
                  <span className="icon">&#10003;</span>
                  {req}
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${selectedCareer.applyEmail}?subject=Application for ${selectedCareer.title}`}
              className="apply-btn"
            >
              Apply Now
            </a>
          </div>
        )}
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
        .career-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .career-list-item {
          display: flex;
          align-items: center;
          background: rgba(30, 64, 175, 0.05);
          border-radius: 10px;
          padding: 18px 18px;
          margin-bottom: 18px;
          cursor: pointer;
          transition: background 0.18s, box-shadow 0.18s;
          box-shadow: 0 1px 6px rgba(30,64,175,0.05);
        }
        .career-list-item:hover {
          background: rgba(25, 118, 210, 0.13);
          box-shadow: 0 3px 16px rgba(25,118,210,0.08);
        }
        .career-title {
          font-size: 1.13rem;
          font-weight: 600;
          color: #1976d2;
        }
        .career-meta {
          font-size: 0.98rem;
          color: #444;
          margin-top: 4px;
        }
        .arrow {
          margin-left: auto;
          font-size: 1.4rem;
          color: #1976d2;
          transition: transform 0.18s;
        }
        .career-list-item:hover .arrow {
          transform: translateX(6px);
        }
        .icon {
          font-size: 1.3rem;
          margin-right: 15px;
          color: #1976d2;
          flex-shrink: 0;
        }
        .career-detail {
          animation: fadeIn 0.7s;
        }
        .back-btn {
          background: none;
          border: none;
          color: #1976d2;
          font-size: 1.05rem;
          font-weight: 500;
          margin-bottom: 18px;
          cursor: pointer;
          transition: color 0.18s;
          padding: 0;
        }
        .back-btn:hover {
          color: #0d47a1;
          text-decoration: underline;
        }
        .career-meta-detail {
          display: flex;
          gap: 30px;
          font-size: 1rem;
          color: #333;
          margin-bottom: 10px;
        }
        .career-description {
          color: #222;
          font-size: 1.07rem;
          margin: 10px 0 18px 0;
        }
        .career-detail h3 {
          color: #1976d2;
          margin-bottom: 8px;
          margin-top: 12px;
          font-size: 1.08rem;
        }
        .career-detail ul {
          padding-left: 0;
        }
        .career-detail li {
          background: rgba(30, 64, 175, 0.04);
          border-radius: 8px;
          padding: 7px 12px 7px 10px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          font-size: 1.04rem;
        }
        .career-detail .icon {
          color: #43a047;
          font-size: 1.15rem;
          margin-right: 10px;
        }
        .apply-btn {
          display: inline-block;
          background: linear-gradient(90deg, #1976d2 60%, #42a5f5 100%);
          color: #fff;
          font-weight: 600;
          font-size: 1.07rem;
          border-radius: 7px;
          padding: 12px 28px;
          margin-top: 18px;
          text-decoration: none;
          transition: background 0.18s, box-shadow 0.18s;
          box-shadow: 0 2px 12px rgba(25,118,210,0.08);
        }
        .apply-btn:hover {
          background: linear-gradient(90deg, #0d47a1 70%, #1976d2 100%);
          box-shadow: 0 6px 24px rgba(25,118,210,0.13);
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
          .career-meta-detail {
            flex-direction: column;
            gap: 7px;
          }
        }
      `}</style>
    </div>
  );
}
