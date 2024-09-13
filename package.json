{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "dist": "npx tsc && npm run copy-mails",
    "start": "node dist/server.js",
    "watch": "tsc -w",
    "server": "nodemon dist/server.js",
    "dev": "concurrently \"npm run watch\" \"npm run server\"",
    "copy-mails": "copyfiles -u 1 src/mails/* dist/"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@prisma/client": "^5.19.1",
    "@types/cookie-parser": "^1.4.7",
    "@types/cors": "^2.8.17",
    "@types/dotenv": "^8.2.0",
    "@types/ejs": "^3.1.5",
    "@types/express": "^4.17.21",
    "@types/node": "^22.5.4",
    "@types/nodemailer": "^6.4.15",
    "bcryptjs": "^2.4.3",
    "cloudinary": "^2.4.0",
    "concurrently": "^9.0.0",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "ejs": "^3.1.10",
    "express": "^4.20.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.6.1",
    "nodemailer": "^6.9.15",
    "nodemon": "^3.1.4",
    "prisma": "^5.19.1",
    "razorpay": "^2.9.4",
    "typescript": "^5.6.2"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.6",
    "copyfiles": "^2.4.1"
  }
}
