const AWS = require("@aws-sdk/client-sqs");
const sqs = new AWS.SQS({ region: process.env.AWS_REGION });
const QUEUE_URL = `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${process.env.ACCOUNT_ID}/SQSCampaignQueue`;

const rbmApiHelper = require("@google/rcsbusinessmessaging/src/rbm_api_helper");
const { RcsClient } = require("@/client");

const InfobipClient = require("@/infobip");
const rcsClient = new RcsClient({ client: InfobipClient });

if (process.env.CLIENT == "google") {
  rcsClient = new RcsClient({ client: rbmApiHelper });
}

module.exports.handler = async (event, context) => {
  const params = {
    QueueUrl: QUEUE_URL,
    MaxNumberOfMessages: 10,
  };

  try {
    const data = await sqs.receiveMessage(params);

    if (data.Messages) {
      for (const message of data.Messages) {
        const params = JSON.parse(message.Body);
        console.info(params)
        await rcsClient.perform({ params });

        await sqs
          .deleteMessage({
            QueueUrl: QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle,
          });
      }
    } else {
      console.info("Not found data in Queue");
    }
  } catch (error) {
    console.error("Erro ao processar campanhas:", error);
  }
};
