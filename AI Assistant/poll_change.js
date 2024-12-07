/* Poll for status changes and determine next step */

const waitTillRunComplete = async () => {
    let isComplete = false;
  
    while (!isComplete) {
      const statusResponse = await axios.get(`https://api.openai.com/v1/threads/${workflow.thread_id}/runs/${workflow.run_id}`, {
        headers: {
          'OpenAI-Beta': 'assistants=v2',
          Authorization: `Bearer ${env.OPENAI_KEY}`,
          'Content-Type': 'application/json'
        },
        maxBodyLength: Infinity
      });
  
      const { status, required_action } = statusResponse.data;
  
      console.log('The run status is:', status);
  
      if (['queued', 'in_progress'].includes(status)) {
        // Wait for 500ms before making the next check
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        if (status === 'requires_action') {
          workflow.required_action = required_action;
        } else {
          workflow.required_action = null;
        }
        
        isComplete = true;
      }
    }
  };
  
  await waitTillRunComplete()
  