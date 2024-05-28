import { NextApiRequest, NextApiResponse } from 'next';
import { saveTopicNameInUsersTable, createTopicName } from '../../../utils/db/relevance';
import { createTopicNameInGcloud } from '../../../utils/pubsub/pubsubClient';
import { DbUser, getUserById } from '../../../utils/db/users';
import rudderStackEvents from '../events';

const pubsubHandler = async (req: NextApiRequest, res: NextApiResponse) => { // To be removed, only used for testing the functions
	console.info("[pubsubHandler] pub sub setup info in db...");
	const jsonBody = req.body;

	if (!jsonBody.userId) {
		console.error("[pubsubHandler] Invalid request body");
		res.status(400).json({ "error": "Invalid request body" });
		const eventProperties = { response_status: 400 };
		rudderStackEvents.track("absent", "", 'dpu-pubsub', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
		return;
	}
	const userData: DbUser = await getUserById(jsonBody.userId);
	if (!userData) {
		console.error(`[pubsubHandler] cannot get userData`);
		res.status(500).json({ "error": "Internal server error" });
		const eventProperties = { response_status: 500 };
		rudderStackEvents.track(jsonBody.userId, "", 'dpu-pubsub', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
		return;
	}
	if (!userData.topic_name) {
		const generatedTopic = await createTopicName(jsonBody.userId);
		if (!generatedTopic) {
			console.error(`[pubsubHandler] error in creating topic name`);
			res.status(500).json({ "error": "Internal server error" });
			const eventProperties = { response_status: 500 };
			rudderStackEvents.track(jsonBody.userId, "", 'dpu-pubsub', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
			return;
		}
		const gcloudTopic = await createTopicNameInGcloud(generatedTopic)
		if (!gcloudTopic) {
			console.error(`[pubsubHandler] error in creating topic in google cloud`);
			res.status(500).json({ "error": "Internal server error" });
			const eventProperties = { response_status: 500 };
			rudderStackEvents.track(jsonBody.userId, "", 'dpu-pubsub', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
			return;
		}
		const eventProperties = { topic_name: generatedTopic };
		rudderStackEvents.track(jsonBody.userId, "", 'dpu-pubsub', { type: 'create-topic-in-gcloud', eventStatusFlag: 1, eventProperties });
		await saveTopicNameInUsersTable(jsonBody.userId, generatedTopic)
			.then(() => {
				console.info("[pubsubHandler] Topic saved in db");
				rudderStackEvents.track(jsonBody.userId, "", 'dpu-pubsub', { type: 'save-topic-in-db', eventStatusFlag: 1, eventProperties });
			})
			.catch((error) => {
				console.error("[pubsubHandler] Unable to save topic name in db, ", error);
				res.status(500).json({ "error": "Internal server error" });
				const event_properties = { ...eventProperties, response_status: 500 };
				rudderStackEvents.track(jsonBody.userId, "", 'dpu-pubsub', { type: 'save-topic-in-db', eventStatusFlag: 0, event_properties });
			})
		return;
	}
	const topicName = userData.topic_name;
	
	console.info("[pubsubHandler] topic name created successfully and saved in db: ", topicName);
	res.status(200).json({ "installId": topicName });
	
	const eventProperties = { topic_name: topicName, response_status: 200 };
	rudderStackEvents.track(jsonBody.userId, "", 'dpu-pubsub', { type: 'HTTP-200', eventStatusFlag: 1, eventProperties });
	return;
}

export default pubsubHandler;
