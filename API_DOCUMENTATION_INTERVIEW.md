# CurationAI Query API - Frontend Interview Task

## Overview

Build a chat interface that connects to the CurationAI Query API. The API provides investment insights based on investor community discussions.

---

## Endpoint

```
POST https://gcor4a6ukb.execute-api.eu-west-2.amazonaws.com/query
```

**Content-Type:** `application/json`

---

## Request Format

```json
{
  "message": "string (required) - The user's question",
  "conversation_id": "string | null - Unique conversation identifier",
  "conversation_topic": "string | null - Topic/title of the conversation",
  "context": {
    "previous_messages": "array - Previous messages in conversation",
    "summary_checkpoint": "object | null - Summary of earlier messages"
  },
  "metadata": {
    "type": "string - 'new' or 'continuation'",
    "user_id": "string - User identifier",
    "session_id": "string - Session identifier",
    "timestamp": "string - ISO 8601 timestamp",
    "message_index": "number - Message number in conversation (1-based)"
  }
}
```

---

## Response Format

### Success Response

```json
{
  "status": "success",
  "conversation_id": "string | null",
  "conversation_topic": "string - Generated topic for the conversation",
  "message": {
    "message_id": "string - Unique response ID",
    "message_index": "number - Same as request",
    "role": "assistant",
    "content": "string - The generated answer",
    "timestamp": "string - ISO 8601 timestamp"
  },
  "analysis": {
    "tickers_mentioned": ["array of ticker symbols"],
    "themes_detected": ["array of themes"],
    "sentiment": "bullish | bearish | neutral | mixed",
    "confidence": "high | medium | low",
    "sources_count": "number"
  },
  "context_update": {
    "should_create_checkpoint": "boolean",
    "next_checkpoint": "number",
    "new_checkpoint": "object (only when should_create_checkpoint is true)"
  },
  "performance": {
    "response_time_ms": "number"
  }
}
```

### Blocked Response

Some queries may be blocked (off-topic, too short, etc.):

```json
{
  "status": "blocked",
  "error_code": "GUARDRAIL_VIOLATION",
  "error": "string - Reason for block",
  "message": {
    "message_id": "string",
    "message_index": "number",
    "role": "assistant",
    "content": "string - User-friendly message",
    "timestamp": "string"
  }
}
```

### Error Response

```json
{
  "status": "error",
  "error": "string - Error message",
  "timestamp": "string"
}
```

---

## Examples

### Example 1: New Conversation (First Message)

**Request:**
```json
{
  "message": "What are investors saying about Tesla?",
  "conversation_id": null,
  "conversation_topic": null,
  "context": {
    "previous_messages": [],
    "summary_checkpoint": null
  },
  "metadata": {
    "type": "new",
    "user_id": "user_12345",
    "session_id": "sess_abc123",
    "timestamp": "2026-01-20T15:00:00Z",
    "message_index": 1
  }
}
```

**Response:**
```json
{
  "status": "success",
  "conversation_id": null,
  "conversation_topic": "Tesla Investment Analysis",
  "message": {
    "message_id": "msg_response_abc123",
    "message_index": 1,
    "role": "assistant",
    "content": "### Summary\n\nInvestors have mixed views on Tesla...\n\n### Key Insights\n\n1. **Valuation Concerns**...",
    "timestamp": "2026-01-20T15:00:25Z"
  },
  "analysis": {
    "tickers_mentioned": ["TSLA"],
    "themes_detected": ["valuation", "competition", "growth"],
    "sentiment": "mixed",
    "confidence": "high",
    "sources_count": 10
  },
  "context_update": {
    "should_create_checkpoint": false,
    "next_checkpoint": 6
  },
  "performance": {
    "response_time_ms": 8500
  }
}
```

### Example 2: Follow-up Message

**Request:**
```json
{
  "message": "What about their competition from China?",
  "conversation_id": "conv_789xyz",
  "conversation_topic": "Tesla Investment Analysis",
  "context": {
    "previous_messages": [
      {
        "message_index": 1,
        "role": "user",
        "content": "What are investors saying about Tesla?",
        "timestamp": "2026-01-20T15:00:00Z"
      },
      {
        "message_index": 1,
        "role": "assistant",
        "content": "### Summary\n\nInvestors have mixed views on Tesla...",
        "timestamp": "2026-01-20T15:00:25Z"
      }
    ],
    "summary_checkpoint": null
  },
  "metadata": {
    "type": "continuation",
    "user_id": "user_12345",
    "session_id": "sess_abc123",
    "timestamp": "2026-01-20T15:01:00Z",
    "message_index": 2
  }
}
```

### Example 3: Blocked Query

**Request:**
```json
{
  "message": "hi",
  "conversation_id": null,
  "conversation_topic": null,
  "context": {
    "previous_messages": [],
    "summary_checkpoint": null
  },
  "metadata": {
    "type": "new",
    "user_id": "user_12345",
    "session_id": "sess_abc123",
    "timestamp": "2026-01-20T15:00:00Z",
    "message_index": 1
  }
}
```

**Response:**
```json
{
  "status": "blocked",
  "error_code": "GUARDRAIL_VIOLATION",
  "error": "Query too short",
  "message": {
    "message_id": "msg_blocked_xyz789",
    "message_index": 1,
    "role": "assistant",
    "content": "Could you provide more detail? I need a bit more context to help you.",
    "timestamp": "2026-01-20T15:00:01Z"
  }
}
```

---

## Checkpoint System (For Long Conversations)

At message 6, 11, 16, etc., the API returns a summary checkpoint. Your frontend should:

1. Store the `new_checkpoint` when `should_create_checkpoint` is true
2. On subsequent messages, send only messages after the checkpoint + the checkpoint summary

**Checkpoint Response (at message 6):**
```json
{
  "context_update": {
    "should_create_checkpoint": true,
    "new_checkpoint": {
      "checkpoint_index": 1,
      "covers_messages": { "from": 1, "to": 5 },
      "summary": "User explored Tesla risks, valuation concerns, and competition...",
      "replaces_previous_checkpoint": false
    },
    "next_checkpoint": 11
  }
}
```

**Subsequent Request (message 7+):**
```json
{
  "context": {
    "previous_messages": [
      // Only messages 6 onwards
    ],
    "summary_checkpoint": {
      "checkpoint_index": 1,
      "covers_messages": { "from": 1, "to": 5 },
      "summary": "User explored Tesla risks..."
    }
  }
}
```

---

## Sample Queries to Test

- "What are investors saying about NVDA?"
- "Compare Tesla vs Amazon"
- "What are the main risks for Apple stock?"
- "Give me a deep dive on Microsoft's AI strategy"
- "What's the bull case for Meta?"

---

## Notes

- Response times typically range from 2-15 seconds depending on query complexity
- The `content` field contains markdown-formatted text
- Handle all three response types: `success`, `blocked`, and `error`

---

## Task Requirements

Build a chat UI that:

1. Sends properly formatted requests to the API
2. Displays responses with markdown rendering
3. Handles `blocked` responses gracefully (show the friendly message)
4. Handles `error` responses with appropriate error UI
5. Maintains conversation context (previous_messages)
6. **Bonus:** Implement checkpoint handling for long conversations
7. **Bonus:** Display analysis metadata (tickers, sentiment, themes)

Good luck!
