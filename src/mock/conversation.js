// GET https://chat.openai.com/backend-api/conversations?offseet=0&limit=28&order=updated

const conversationList = {
  "items": [
    {
      "id": "f283136e-f417-46d4-9cde-34f4360af94b",
      "title": "New chat",
      "create_time": "2023-12-06T02:41:14.616844+00:00",
      "update_time": "2023-12-06T02:41:16.257054+00:00",
      "mapping": null,
      "current_node": null,
      "conversation_template_id": null,
      "gizmo_id": null
    },
    {
      "id": "36153432-03f1-4af8-8555-4567206c21d8",
      "title": "New chat",
      "create_time": "2023-12-06T02:37:58.959977+00:00",
      "update_time": "2023-12-06T02:37:59.911403+00:00",
      "mapping": null,
      "current_node": null,
      "conversation_template_id": null,
      "gizmo_id": null
    },
    {
      "id": "9a91f51c-c023-420b-a923-d20735d14937",
      "title": "New chat",
      "create_time": "2023-12-06T02:26:14.584960+00:00",
      "update_time": "2023-12-06T02:26:16.776078+00:00",
      "mapping": null,
      "current_node": null,
      "conversation_template_id": null,
      "gizmo_id": null
    },
    {
      "id": "2327c71d-f5e1-4cbe-a459-20895d69978e",
      "title": "前端开发助手支持",
      "create_time": "2023-12-04T03:06:54.687536+00:00",
      "update_time": "2023-12-04T04:26:10.223934+00:00",
      "mapping": null,
      "current_node": null,
      "conversation_template_id": null,
      "gizmo_id": null
    },
    {
      "id": "e6cadca9-bec2-43ac-b1b5-4c726925aea4",
      "title": "First talk",
      "create_time": "2023-02-16T12:35:51.864968+00:00",
      "update_time": "2023-04-18T16:11:00+00:00",
      "mapping": null,
      "current_node": null,
      "conversation_template_id": null,
      "gizmo_id": null
    }
  ],
  "total": 5,
  "limit": 28,
  "offset": 0,
  "has_missing_conversations": false
}

// GET https://chat.openai.com/backend-api/conversation/f283136e-f417-46d4-9cde-34f4360af94b
const conversationDetail = {
  "title": "New chat",
  "create_time": 1701830474.616844,
  "update_time": 1701830476.257054,
  "mapping": {
    "21120f16-0204-4b48-8634-840b4a7fa8c9": {
      "id": "21120f16-0204-4b48-8634-840b4a7fa8c9",
      "message": {
        "id": "21120f16-0204-4b48-8634-840b4a7fa8c9",
        "author": {
          "role": "system",
          "metadata": {}
        },
        "content": {
          "content_type": "text",
          "parts": [
            ""
          ]
        },
        "status": "finished_successfully",
        "end_turn": true,
        "weight": 0,
        "metadata": {},
        "recipient": "all"
      },
      "parent": "f42147a3-ed79-4a20-9fa0-cb806a50c2f6",
      "children": [
        "aaa2e2a4-671a-48f6-a996-3e5a7aae2528"
      ]
    },
    "f42147a3-ed79-4a20-9fa0-cb806a50c2f6": {
      "id": "f42147a3-ed79-4a20-9fa0-cb806a50c2f6",
      "children": [
        "21120f16-0204-4b48-8634-840b4a7fa8c9"
      ]
    },
    "aaa2e2a4-671a-48f6-a996-3e5a7aae2528": {
      "id": "aaa2e2a4-671a-48f6-a996-3e5a7aae2528",
      "message": {
        "id": "aaa2e2a4-671a-48f6-a996-3e5a7aae2528",
        "author": {
          "role": "user",
          "metadata": {}
        },
        "create_time": 1701830474.617395,
        "content": {
          "content_type": "text",
          "parts": [
            "请你扮演一个精通英语的前端开发者，为我提供翻译、函数命名、英文润色等帮助。"
          ]
        },
        "status": "finished_successfully",
        "weight": 1,
        "metadata": {
          "timestamp_": "absolute"
        },
        "recipient": "all"
      },
      "parent": "21120f16-0204-4b48-8634-840b4a7fa8c9",
      "children": [
        "91be2e50-7a5c-495a-9ca3-4eff32d746d0"
      ]
    },
    "91be2e50-7a5c-495a-9ca3-4eff32d746d0": {
      "id": "91be2e50-7a5c-495a-9ca3-4eff32d746d0",
      "message": {
        "id": "91be2e50-7a5c-495a-9ca3-4eff32d746d0",
        "author": {
          "role": "assistant",
          "metadata": {}
        },
        "create_time": 1701830476.255622,
        "content": {
          "content_type": "text",
          "parts": [
            "当然可以！请告诉我你需要帮助的具体内容，我将尽力提供翻译、函数命名和英文润色方面的支持。"
          ]
        },
        "status": "finished_successfully",
        "end_turn": true,
        "weight": 1,
        "metadata": {
          "finish_details": {
            "type": "stop",
            "stop_tokens": [
              100260
            ]
          },
          "is_complete": true,
          "model_slug": "text-davinci-002-render-sha",
          "parent_id": "aaa2e2a4-671a-48f6-a996-3e5a7aae2528",
          "timestamp_": "absolute"
        },
        "recipient": "all"
      },
      "parent": "aaa2e2a4-671a-48f6-a996-3e5a7aae2528",
      "children": []
    }
  },
  "moderation_results": [],
  "current_node": "91be2e50-7a5c-495a-9ca3-4eff32d746d0",
  "conversation_id": "f283136e-f417-46d4-9cde-34f4360af94b"
}

// POST https://chat.openai.com/backend-api/conversation
const payload = {
  "action": "next",
  "messages": [
    {
      "id": "aaa2e2a4-671a-48f6-a996-3e5a7aae2528",
      "author": {
        "role": "user"
      },
      "content": {
        "content_type": "text",
        "parts": [
          "请展示一下你的能力"
        ]
      },
      "metadata": {}
    }
  ],
  "conversation_id": "f283136e-f417-46d4-9cde-34f4360af94b",
  "parent_message_id": "91be2e50-7a5c-495a-9ca3-4eff32d746d0",
  "model": "text-davinci-002-render-sha",
  "timezone_offset_min": -480,
  "suggestions": [],
  "history_and_training_disabled": false,
  "arkose_token": null,
  "conversation_mode": {
    "kind": "primary_assistant"
  },
  "force_paragen": false,
  "force_rate_limit": false
}

const chatResults = [
  {
      "message": {
          "id": "2c33ab39-5aa7-47e9-b72a-8c9d8d512243",
          "author": {
              "role": "assistant",
              "name": null,
              "metadata": {}
          },
          "create_time": 1701830889.416883,
          "update_time": null,
          "content": {
              "content_type": "text",
              "parts": [
                  ""
              ]
          },
          "status": "in_progress",
          "end_turn": null,
          "weight": 1,
          "metadata": {
              "message_type": "next",
              "model_slug": "text-davinci-002-render-sha",
              "parent_id": "aaa2e2a4-671a-48f6-a996-3e5a7aae2528"
          },
          "recipient": "all"
      },
      "conversation_id": "f283136e-f417-46d4-9cde-34f4360af94b",
      "error": null
  },
  {
      "message": {
          "id": "2c33ab39-5aa7-47e9-b72a-8c9d8d512243",
          "author": {
              "role": "assistant",
              "name": null,
              "metadata": {}
          },
          "create_time": 1701830889.416883,
          "update_time": null,
          "content": {
              "content_type": "text",
              "parts": [
                  "当"
              ]
          },
          "status": "in_progress",
          "end_turn": null,
          "weight": 1,
          "metadata": {
              "message_type": "next",
              "model_slug": "text-davinci-002-render-sha",
              "parent_id": "aaa2e2a4-671a-48f6-a996-3e5a7aae2528"
          },
          "recipient": "all"
      },
      "conversation_id": "f283136e-f417-46d4-9cde-34f4360af94b",
      "error": null
  },
  {
      "message": {
          "id": "2c33ab39-5aa7-47e9-b72a-8c9d8d512243",
          "author": {
              "role": "assistant",
              "name": null,
              "metadata": {}
          },
          "create_time": 1701830891.390381,
          "update_time": null,
          "content": {
              "content_type": "text",
              "parts": [
                  "当然，请问有什么样的任务或问题我可以帮助您解决呢？我可以进行文本生成、回答问题、提供建议、编写代码、翻译语言等多种任务。请告诉我您需要什么样的帮助。"
              ]
          },
          "status": "finished_successfully",
          "end_turn": true,
          "weight": 1,
          "metadata": {
              "finish_details": {
                  "type": "stop",
                  "stop_tokens": [
                      100260
                  ]
              },
              "is_complete": true,
              "message_type": "next",
              "model_slug": "text-davinci-002-render-sha",
              "parent_id": "aaa2e2a4-671a-48f6-a996-3e5a7aae2528",
              "timestamp_": "absolute"
          },
          "recipient": "all"
      },
      "conversation_id": "f283136e-f417-46d4-9cde-34f4360af94b",
      "error": null
  },
  {
      "conversation_id": "f283136e-f417-46d4-9cde-34f4360af94b",
      "message_id": "2c33ab39-5aa7-47e9-b72a-8c9d8d512243",
      "is_completion": true,
      "moderation_response": {
          "flagged": false,
          "blocked": false,
          "moderation_id": "modr-8ScFH5gPtQ3DCXu2DcspkhjHxZg94"
      }
  }
]