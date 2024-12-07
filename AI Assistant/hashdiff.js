/* Calculated current hashdiff */

async function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

const hashdiffInput = env.ASSISTANT_ID + '||' + env.OPENAI_KEY;

workflow.currentConfigHashdiff = await hashString(hashdiffInput);