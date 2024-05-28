import { NextApiRequest, NextApiResponse } from 'next';
import { getUserAliasesFromRepo, saveUserAliasesToRepo } from '../../../utils/db/aliases';
import rudderStackEvents from '../events';

const aliasesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        // Handle GET request
        await aliasesGetHandler(req, res);
      } else if (req.method === 'POST') {
        // Handle POST request
        await aliasesPostHandler(req, res);
      } else {
        // Handle other request methods
        res.status(405).end(); // Method Not Allowed
      }
}

const aliasesPostHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info("[aliasesPostHandler] Saving git aliases to db...");
    const jsonBody = req.body;
    const { repo_name, repo_owner, repo_provider } = jsonBody;

    const event_properties = {
        repo_name: repo_name || "",
        repo_owner: repo_owner || "",
        repo_provider: repo_provider || "",
    };

    // Validate the JSON body
    if (!jsonBody || !jsonBody.repo_name || !jsonBody.repo_owner || !jsonBody.repo_provider
        || !Array.isArray(jsonBody.aliases)) {
        console.error("[aliasesPostHandler] Invalid request body", jsonBody);
        const eventProperties = { ...event_properties, response_status: 400 };
        rudderStackEvents.track("absent", "", 'dpu-post-aliases', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties }); //TODO: aliases endpoint - need to send topic name for getting user for auth
        res.status(400).json({ "error": "Invalid request body" });
        return;
    }
    
    // Save users to the database
    await saveUserAliasesToRepo(
        jsonBody.repo_name, jsonBody.repo_owner, jsonBody.repo_provider, jsonBody.aliases
    ).then(() => {
        console.info("[aliasesPostHandler] Aliases saved to DB successfully");
        const eventProperties = { ...event_properties, response_status: 200 };
		rudderStackEvents.track("absent", "", 'dpu-post-aliases', { type: 'HTTP-200', eventStatusFlag: 1, eventProperties });
        res.status(200).send("OK");
        return;
    }).catch((error) => {
        console.error("[aliasesPostHandler] Unable to save aliases to DB, error: ", error);
        const eventProperties = { ...event_properties, response_status: 500 };
		rudderStackEvents.track("absent", "", 'dpu-post-aliases', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
        res.status(500).json({ "error": "Unable to save aliases to DB" });
        return;
    });
};

const aliasesGetHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info("[aliasesGetHandler] Retrieving aliases from DB...");

    // Extract query parameters
    const { repo_name, repo_owner, repo_provider } = req.query;
    const event_properties = { repo_name, repo_owner, repo_provider };

    // Validate query parameters
    if (!repo_name || !repo_owner || !repo_provider) {
        console.error("[aliasesGetHandler] Missing query parameters");
        const eventProperties = { ...event_properties, response_status: 400 };
		rudderStackEvents.track("absent", "", 'dpu-get-aliases', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
        res.status(400).json({ "error": "Missing query parameters" });
        return;
    }

    // Retrieve aliases from the database
    await getUserAliasesFromRepo(
        repo_name as string, repo_owner as string, repo_provider as string
    ).then((aliases) => {
        console.info("[aliasesGetHandler] Aliases retrieved successfully");
        const eventProperties = { ...event_properties, response_status: 200 };
		rudderStackEvents.track("absent", "", 'dpu-get-aliases', { type: 'HTTP-200', eventStatusFlag: 1, eventProperties });
        res.status(200).json({ aliases });
        return;
    })
    .catch((error) => {
        console.error("[aliasesGetHandler] Unable to retrieve aliases from DB, error: ", error);
        const eventProperties = { ...event_properties, response_status: 500 };
		rudderStackEvents.track("absent", "", 'dpu-get-aliases', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
        res.status(500).json({ "error": "Unable to retrieve aliases from DB" });
        return;
    });
};

export default aliasesHandler;