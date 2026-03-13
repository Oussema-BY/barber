import * as React from 'react';

interface ContactFormEmailProps {
  name: string;
  email: string;
  message: string;
}

export const ContactFormEmail: React.FC<Readonly<ContactFormEmailProps>> = ({
  name,
  email,
  message,
}) => (
  <div style={{
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
    backgroundColor: '#f6f9fc',
    padding: '40px 0',
  }}>
    <div style={{
      backgroundColor: '#ffffff',
      margin: '0 auto',
      padding: '40px',
      maxWidth: '600px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    }}>
      <h1 style={{
        color: '#1a1a1a',
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '24px',
        borderBottom: '1px solid #eeeeee',
        paddingBottom: '16px',
      }}>New Contact Request</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <p style={{ margin: '0 0 8px 0', color: '#666666', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Sender Name</p>
        <p style={{ margin: '0', color: '#1a1a1a', fontSize: '16px', fontWeight: '500' }}>{name}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ margin: '0 0 8px 0', color: '#666666', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Sender Email</p>
        <p style={{ margin: '0', color: '#1a1a1a', fontSize: '16px', fontWeight: '500' }}>{email}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ margin: '0 0 8px 0', color: '#666666', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Message</p>
        <div style={{ 
          margin: '0', 
          color: '#444444', 
          fontSize: '16px', 
          lineHeight: '1.6',
          backgroundColor: '#f9f9f9',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #eeeeee'
        }}>
          {message}
        </div>
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <p style={{ margin: '0', color: '#888888', fontSize: '12px' }}>
          This email was sent from the Taktak Beauty contact form.
        </p>
      </div>
    </div>
  </div>
);
