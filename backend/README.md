### 1. Configure Frontend
/frontend/src/utils$ config.js -> SERVER_URI should be = ""

### 2. Build frontend app & copy to backend
/frontend$ npm run build  
/frontend$ mv public/ ../backend/  

### 3. Configure backend
/backend$ .env -> make sure it's setup properly
/backend/utils/discourse$ utils.js -> Update category to the right discourse category  

### 4. Run docker
<h5>Node app + mongo db runs inside of docker</h5>
/backend/$ sudo docker-compose up --build

### If running local
Do the same steps above. Skip #2, adjust #3.

/frontend/src/utils$ config.js -> SERVER_URI should be = "http://localhost:3005";  
/frontend$ npm run dev  
open brower @ localhost:8080  
