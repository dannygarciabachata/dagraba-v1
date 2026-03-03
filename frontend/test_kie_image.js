require('dotenv').config({ path: '.env.local' });

async function main() {
  const KIE_KEY = process.env.KIE_API_KEY;
  if(!KIE_KEY) { console.log('no key'); return; }

  const body = {
    model: "google/nano-banana",
    input: {
      prompt: "A beautiful acoustic guitar on a beach",
      output_format: "png",
      image_size: "1:1"
    }
  };

  try {
    const res = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KIE_KEY}` },
      body: JSON.stringify(body)
    });
    
    const data = await res.json();
    console.log("Create Task:", data);
    
    if (data.code === 200 && data.data?.taskId) {
       const taskId = data.data.taskId;
       console.log("Polling for taskId:", taskId);
       for (let i=0; i<3; i++) {
          await new Promise(r => setTimeout(r, 6000));
          let q = await fetch(`https://api.kie.ai/api/v1/jobs/queryTask?taskId=${taskId}`, {
            headers: { 'Authorization': `Bearer ${KIE_KEY}` }
          });
          const d = await q.json();
          console.log("Query Results:", JSON.stringify(d, null, 2));
          if (d.data?.state === 'success' || d.data?.status === 'success') {
             break;
          }
       }
    }
  } catch(e) { console.error(e); }
}
main();
