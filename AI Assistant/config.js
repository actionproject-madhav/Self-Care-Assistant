workflow.warning = '';

try {
  const response = await axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.openai.com/v1/assistants/${env.ASSISTANT_ID}`,
    headers: {
      'OpenAI-Beta': 'assistants=v2',
      Authorization: `Bearer ${env.OPENAI_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  const functionTools = response.data.tools.filter(t => t.type == 'function')
  if (functionTools.length > 0) {
    const toolNames = functionTools.map(x => x.function.name).join(', ');
    workflow.warning = "Warning! This assistant defines some tools (functions) {" + toolNames + "} which you'll have to implement yourself!!"
  }
  
} catch (error) {
  workflow.errorMessage = error.message
}
