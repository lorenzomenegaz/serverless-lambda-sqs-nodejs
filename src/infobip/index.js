const https = require('follow-redirects').https;

const InfobipClient = {
  async sendMessage(params) {
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        hostname: process.env.BASE_INFOBIP_API,
        path: "/rcs/2/messages",
        headers: {
          Authorization:
            `App ${process.env.INFOBIP_API_KEY}`, // API KEY
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        maxRedirects: 20,
      };

      const req = https.request(options, (res) => {
        let chunks = [];

        res.on("data", (chunk) => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          const body = Buffer.concat(chunks).toString();
          console.log(body);

          try {
            const response = JSON.parse(body);
            console.log("bulkId:", response.bulkId);
            response.messages.forEach((message) => {
              console.log("messageId:", message.messageId);
              console.log("status:", message.status.name);
              // console.log("description:", message.status.description);
              console.log("destination:", message.destination);
              console.log("file:", message.file);
              console.log("thumbnail:", message.thumbnail)
            });

            resolve({
              statusCode: res.statusCode,
              body: JSON.stringify(response),
            });
          } catch (error) {
            console.error("Error parsing response:", error);
            reject({
              statusCode: 500,
              body: JSON.stringify(error),
            });
          }
        });

        res.on("error", (error) => {
          console.error(error);
          reject({
            statusCode: 500,
            body: JSON.stringify(error),
          });
        });
      });

      const postData = JSON.stringify({
        messages: [
          {
            sender: "441134960000",
            destinations: [
              {
                to: params.destination,
              },
            ],
            content: {
              file: {url: params.file},
              thumbnail: {url: params.thumbnail},
              // text: params.description,
              suggestions: [
                {
                  text: "Example text",
                  postbackData: "Example postback data",
                  type: "REPLY",
                },
              ],
              type: "FILE",
            },
            options: {
              smsFailover: {
                sender: "441134960000",
                text: "Failover text",
              },
            },
          },
        ],
      });
      
      console.log(postData);
      req.write(postData);
      req.end();
    });
  }
}

module.exports = InfobipClient;
