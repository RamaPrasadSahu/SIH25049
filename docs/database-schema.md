# Database Schema Document - Cloud Firestore

The application uses Cloud Firestore for user-isolated health document management.

## Collections Overview

### 1. `users/{userId}`
Stores user demographics and preferred Indian language.
```json
{
  "uid": "string",
  "name": "string",
  "email": "string",
  "preferredLanguage": "or-IN",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 2. `conversations/{conversationId}`
Stores active healthcare conversation sessions.
```json
{
  "userId": "string",
  "title": "string",
  "language": "or-IN",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 3. `conversations/{conversationId}/messages/{messageId}`
Subcollection storing chat message log history.
```json
{
  "conversationId": "string",
  "role": "user | assistant",
  "text": "string",
  "language": "or-IN",
  "mlRiskAssessment": {
    "prediction": "string",
    "confidence": "number",
    "riskLevel": "High | Moderate | Mild"
  },
  "createdAt": "timestamp"
}
```

### 4. `predictions/{predictionId}`
Stores in-house ML model prediction logs.
```json
{
  "userId": "string",
  "features": {},
  "prediction": "Malaria",
  "confidence": 0.82,
  "riskLevel": "High",
  "createdAt": "timestamp"
}
```
