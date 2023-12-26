// @ts-nocheck
const instances = new Set();
let chatBotStatus = useStorage(STORAGE_KEY.CHAT_BOT_STATUS);

export class ChatBot {
  static botRegistry = {
    COMMON: {
      title: 'BOT_通用助手',
      initialPrompt: '请你扮演一个web开发助手'
    }
  };

  bot = null;
  conversationId = null;
  currentNode = null;
  messageMapping = null;
  ready;
  responding = false;
  pendingChatList = [];

  constructor(bot) {
    this.bot = bot || ChatBot.botRegistry.COMMON;
    this.update();
  }

  get messageList() {
    if (!this.currentNode || !this.messageMapping) return null;

    const list = [];
    const mapping = this.messageMapping;

    (function unshiftMsg(id) {
      const target = mapping[id];
      list.unshift(target);
      if (target.parent) {
        unshiftMsg(target.parent)
      }
    })(this.currentNode);
    
    return list;
  }

  async update() {
    this.ready = this.initConversation();
    this.ready.then(() => {
      chatBotStatus.then(v => {
        v.set({ready: true});
      })
    }).catch(err => {
      chatBotStatus.then(v => {
        v.set({ready: false, detail: err.message });
      })
    })
  }

  async initConversation() {
    const conversations = await queryConversations().then(res => res.json());
    const foundConv = conversations.items.find(v => v.title === this.bot.title);

    if (foundConv) {
      this.conversationId = foundConv.id;
    } else {
      const res = await postMessage(this.bot.initialPrompt);
      this.conversationId = res.data[res.data.length - 1].conversation_id;
      await renameConversation(this.conversationId, this.bot.title);
    }

    const convDetail = await queryConversation(this.conversationId).then(res => res.json());
    this.currentNode = convDetail['current_node'];
    this.messageMapping = convDetail['mapping'];
    return this;
  }
  
  /**
   * 发送消息
   * - 按调用顺序依次发送
   * @param {*} msg 
   * @param {*} onMessage 
   * @returns 
   */
  async chat(msg, onMessage) {
    await this.ready;

    const post = (reject, resolve) => {
      return postMessage(msg, onMessage, this.conversationId, this.currentNode)
        .then((res) => {
          const lastNode = res.data[res.data.length - 1];
          this.currentNode = lastNode['message_id'] || lastNode.message.id;
          resolve && resolve(res);
          return res;
        })
        .catch(err => {
          if (reject) {
            reject(err);
          } else {
            throw err;
          }
        })
        .finally(() => {
          if (this.pendingChatList?.length) {
            this.pendingChatList.shift()();
          } else {
            this.responding = false;
          }
        });
    }

    if (this.responding) {
      return new Promise((resolve, reject) => {
        this.pendingChatList.push(post.bind(this, resolve, reject));
      });
    }
    
    this.responding = true;
    return post();
  }
}