// DataSchema.jsx
// This page presents the data model and user-facing information that
// should be persisted in the database, formatted like a .txt document.

import { motion } from 'framer-motion';
import Panel from '../components/Panel';

export default function DataSchema() {
  const schemaText = `# ARAMBH Data Requirements

The following information must be stored for each user and session.  The
page is presented as a plain-text document so developers and stakeholders
can review the complete set of fields in one place.

1. User Table
   - user_id (UUID)
   - name (string)
   - email (string, unique)
   - password_hash (string)
   - role (enum: user, admin)
   - created_at (timestamp)
   - last_login (timestamp)
   - profile_picture_url (string)
   - subscription_status (enum: free, premium, expired)

2. Session Table
   - session_id (UUID)
   - user_id (foreign key -> User.user_id)
   - session_type (enum: technical, behavioral, mixed)
   - start_time (timestamp)
   - end_time (timestamp)
   - duration_seconds (integer)
   - questions_answered (integer)
   - score (integer 0-100)
   - capture_data (JSON blob containing raw metrics)

3. Speech Metrics Table
   - metric_id (UUID)
   - session_id (foreign key)
   - words_per_minute (integer)
   - filler_words_count (integer)
   - clarity_percentage (integer)
   - timestamp (timestamp)

4. Confidence Metrics Table
   - confidence_id (UUID)
   - session_id (foreign key)
   - eye_contact (integer 0-100)
   - facial_expression (integer 0-100)
   - hand_movement (integer 0-100)
   - overall_confidence (integer 0-100)
   - timestamp (timestamp)

5. Report Artifacts
   - report_id (UUID)
   - session_id (foreign key)
   - report_pdf_url (string)
   - created_at (timestamp)

6. Settings Table
   - settings_id (UUID)
   - user_id (foreign key)
   - email_notifications (boolean)
   - feedback_alerts (boolean)
   - data_collection_consent (boolean)

7. Audit Log (optional)
   - log_id (UUID)
   - user_id (foreign key)
   - action (string)
   - details (string or JSON)
   - timestamp (timestamp)

Each of these tables corresponds to screens/components within the app:
- Profile, Settings, Dashboard, Reports, Admin panels, etc.

Ensure that sensitive information such as passwords is hashed and
that GDPR-style consent is recorded.
`;

  return (
    <motion.div
      className="w-full p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Panel>
        <pre className="whitespace-pre-wrap text-sm font-mono">
          {schemaText}
        </pre>
      </Panel>
    </motion.div>
  );
}
