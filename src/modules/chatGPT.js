const apiUrl = 'https://api.openai.com/v1/chat/completions';
let apiKey = '';

chrome.storage.local.get('chatGPTSeecretApiKey').then(res => {
  apiKey = res.chatGPTSeecretApiKey;
});

chrome.storage.local.onChanged.addListener(changes => {
  if ('chatGPTSeecretApiKey' in changes) {
    apiKey = changes.chatGPTSeecretApiKey.newValue;
  }
});

export const chat = async (prompt) => {
  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result.choices[0].message.content);
    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching ChatGPT API:', error);
  }
}