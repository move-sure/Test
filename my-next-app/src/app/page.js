import Link from 'next/link';
import './home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="content-box">
        <h1 className="company-heading">MOVESURE.IO</h1>
        <p className="company-description">
          A modern transport software company empowering logistics
        </p>
        <Link href="/dashboard" className="dashboard-button">
          Go to Bilty Dashboard
        </Link>
      </div>
    </div>
  );
}