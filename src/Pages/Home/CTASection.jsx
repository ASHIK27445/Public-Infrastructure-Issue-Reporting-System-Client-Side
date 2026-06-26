import React, { use } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { AuthContext } from '../AuthProvider/AuthContext';
import { NavLink, useNavigate } from 'react-router';
const BG_IMAGE = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&h=900&fit=crop";
const CARD_IMAGE = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop";

const CTASection = () => {
  const { role } = use(AuthContext);
  const navigate = useNavigate();

  const handleStaffReportIssue = () => {
    if (role === 'staff') {
      alert("Staff can't report issues.");
      return;
    }
    navigate('dashboard/dashboard/addissues');
  };

  return (
    <div style={{ background: '#111', padding: '24px', borderRadius: '28px' }}>
      <section
        style={{
          position: 'relative',
          width: '100%',
          height: '520px',
          borderRadius: '20px',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Background image */}
        <img
          src={BG_IMAGE}
          alt="Community"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Subtle dark overlay — only enough to make text readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.55) 100%)',
        }} />

        {/* TOP-LEFT: Headline — each line has its own dark blob behind it */}
        <div style={{
          position: 'absolute',
          top: '36px',
          left: '36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(0,0,0,0.62)',
            backdropFilter: 'blur(6px)',
            borderRadius: '14px',
            padding: '10px 20px',
            width: 'fit-content',
          }}>
            <span style={{
              color: '#fff',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}>
              Fix Your Community
            </span>
          </div>

          <div style={{
            display: 'inline-block',
            background: 'rgba(0,0,0,0.62)',
            backdropFilter: 'blur(6px)',
            borderRadius: '14px',
            padding: '10px 20px',
            width: 'fit-content',
          }}>
            <span style={{
              color: '#fff',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}>
              Starting Today
            </span>
          </div>
        </div>

        {/* TOP-RIGHT: pill CTA button */}
        <button
          onClick={handleStaffReportIssue}
          style={{
            position: 'absolute',
            top: '36px',
            right: '36px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.92)',
            color: '#111',
            fontWeight: 600,
            fontSize: '14px',
            padding: '10px 20px',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            transition: 'background 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.92)'}
        >
          Start Reporting
          <ArrowRight size={15} />
        </button>

        {/* BOTTOM-RIGHT: floating dark card */}
        <div style={{
          position: 'absolute',
          bottom: '32px',
          right: '32px',
          width: '260px',
          background: 'rgba(18,18,18,0.92)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {/* card image */}
          <img
            src={CARD_IMAGE}
            alt="Issue preview"
            style={{
              width: '100%',
              height: '120px',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {/* card body */}
          <div style={{ padding: '16px' }}>
            <p style={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '15px',
              marginBottom: '6px',
              lineHeight: 1.3,
            }}>
              Real Issues. Real Solutions.
            </p>
            <p style={{
              color: '#9ca3af',
              fontSize: '13px',
              lineHeight: 1.5,
              marginBottom: '14px',
            }}>
              Citizens report, officials act. Transparent from start to finish.
            </p>
            <NavLink
              to="community-guidelines"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#fff',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <span>More info</span>
              <ArrowRight size={16} />
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CTASection;