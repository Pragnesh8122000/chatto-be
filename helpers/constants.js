module.exports = {
    SOCKET: {
        EVENTS: {
            CONNECTION: "connection",
            DISCONNECT: "disconnect",
            MESSAGE: "message",
            CONVERSATION_LIST: "conversation-list",
            START_CONVERSATION: "start-conversation",
            GET_SINGLE_CONVERSATION_CHAT: "get-single-conversation-chat",
            ERROR: "error",
            CHAT_LIST: "chat-list",
            FRIENDS_COUNT: "friends-count",
            MESSAGE_NOTIFICATION : "message-notification",
            LAST_CHAT : "last-chat",
            READ_CHAT : "read-chat",
            ACTIVITY_CHANGE : "activity-changes"

        },
        ERROR_TYPE: {
            USER_ALREADY_EXIST: "user-exist-error",
            UNKNOWN_ERROR: "unknown-error",
            NAME_IS_REQUIRED: "name-required",
            SEND_MESSAGE_ERROR: "message-error",
            READ_SESSION_ERROR: "read-session-error",
            DISCONNECTION_ERROR: "disconnect-error",
            CONVERSATION_LIST_ERROR: "get-conversation-list-error",
            TOKEN_NOT_FOUND: "token-not-found",
            READ_MESSAGE_ERROR : "read-message-error"
        },
    },
    DATABASE: {
        TABLES_NAMES: {
            USER: "User",
            DEPARTMENT: "Department",
            CHAT: "Chat",
            CONVERSATION: "Conversation",
            PARTICIPANT: "Participant"
        },
        TABLE_ATTRIBUTES: {
            COMMON: {
                ID: "id",
                CREATED_AT: "createdAt",
                UPDATED_AT: "updatedAt",
            },
            USER: {
                FIRST_NAME: "first_name",
                LAST_NAME: "last_name",
                EMAIL: "email",
                DEPARTMENT_ID: "department_id",
                PASSWORD: "password",
                USER_CODE: "user_code",
                STATUS: "status",
            },
            DEPARTMENT: {
                DEPARTMENT_NAME: "department_name",
            },
            CHAT: {
                CONTENT: "content",
                SENDER_ID: "sender_id",
                CONVERSATION_ID: "conversation_id"
            },
            CONVERSATION: {
                CONVERSATION_NAME: "conversation_name",
                DESCRIPTION: "description",
                CONVERSATION_CREATOR_ID: "conversation_creator_id"
            },
            PARTICIPANT: {
                USER_ID: "user_id",
                CONVERSATION_ID: "conversation_id"
            },
            FRIENDS: {
                CONVERSATION_ID: "conversation_id",
                FROM_USER_ID: "from_user_id",
                TO_USER_ID: "to_user_id",
                STATUS: "status",
                REQ_OCCURRENCE_COUNT: "req_occurrence_count"
            },
            CHAT_READ: {
                CONVERSATION_ID: "conversation_id",
                CHAT_ID: "chat_id",
                USER_ID: "user_id",
                PARTICIPANT_ID: "participant_id",
                READ_TIMESTAMP: "read_timestamp"
            }
        },
        CONNECTION_REF: {
            CREATOR: "creator",
            CHATS: "chats",
            CONVERSATIONS: "conversations",
            SENDER: "sender",
            USERS: "users",
            PARTICIPANTS: "participants",
            DEPARTMENT: "department",
            USER: "user",
            PARTICIPANT_CHAT: "participant_chat",
            CHAT_BY_CONVERSATION_ID: "chat_by_conversation_id",
            REQ_FROM: "req_from",
            REQ_TO: "req_to",
            FRIENDS: "friends",
            CHAT_READ: "chat_read"
        },
        COMMON_QUERY: {
            ORDER: {
                ASC: "ASC",
                DESC: "DESC"
            }
        },
        ENUMS: {
            FRIEND_REQ_STATUS: {
                ACCEPTED: "accepted",
                PENDING: "pending",
                REJECTED: "rejected"
            },
            USER_STATUS : {
                ACTIVE : "active",
                INACTIVE : "inactive",
                DELETED : "deleted"
            }
        }
    }
}