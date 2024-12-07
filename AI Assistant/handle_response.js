/* 
Checks if we can find an existing (assitant) thread for this conversation
*/

const threadIds = await ThreadsTable.findRecords({
    filter: { conversationId: event.conversationId },
    limit: 1
});

workflow.thread_id = threadIds[0]?.threadId
/* 
Creates a new thread if one wasn't found in the table
*/

if (!workflow.thread_id) {
    let data = JSON.stringify({})
  
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.openai.com/v1/threads',
      headers: {
        'OpenAI-Beta': 'assistants=v2',
        Authorization: 'Bearer ' + env.OPENAI_KEY,
        'Content-Type': 'application/json'
      },
      data: data
    }
  
    const response = await axios.request(config)
  
    workflow.thread_id = response.data.id
    await ThreadsTable.createRecord({
      threadId: workflow.thread_id,
      conversationId: event.conversationId
    })
  }
/*
Posts the user's message into the thread
*/

let data = JSON.stringify({
    role: 'user',
    content: event.preview
  })
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://api.openai.com/v1/threads/${workflow.thread_id}/messages`,
    headers: {
      'OpenAI-Beta': 'assistants=v2',
      Authorization: `Bearer ${env.OPENAI_KEY}`,
      'Content-Type': 'application/json'
    },
    data: data
  }
  
  await axios.request(config)
/* Create a run */

workflow.required_action = {};

const creationResponse = await axios.request({
  method: 'post',
  maxBodyLength: Infinity,
  url: `https://api.openai.com/v1/threads/${workflow.thread_id}/runs`,
  headers: {
    'OpenAI-Beta': 'assistants=v2',
    Authorization: `Bearer ${env.OPENAI_KEY}`,
    'Content-Type': 'application/json'
  },
  data: JSON.stringify({
    assistant_id: env.ASSISTANT_ID
  })
})

const runId = creationResponse.data.id
workflow.run_id = runId;
    