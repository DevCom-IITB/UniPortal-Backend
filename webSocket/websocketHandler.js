const axios=require('axios');

const handleWebSocketConnection=(ws)=>{
    console.log('WebSocket Client Connected');

    ws.on('message',async(message)=>{
        console.log(`Recieved message from client : ${message}`);
        try{
            const response = await axios.post('http://localhost:5001/recommend', { message });
            ws.send(JSON.stringify(response.data));
        } catch(error){
            console.error('Error fetching recommendations:', error);
            ws.send(JSON.stringify({error:'Error fetching recommendations'}));
        }
    });

    ws.on('close',()=>{
        console.log('WebSocket Client Disconnected')
    });
};

module.exports=handleWebSocketConnection;

