import { NextApiRequest, NextApiResponse } from 'next';
import { getUserAliasesFromDb, saveUserAliasesToDb } from '../../../utils/db/aliases';

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
    console.info("[aliasesHandler] Saving git aliases to db...");
    const jsonBody = req.body;
    
    // Validate the JSON body
    if (!jsonBody || !jsonBody.repo_name || !jsonBody.repo_owner || !jsonBody.repo_provider
        || !Array.isArray(jsonBody.aliases)) {
        console.error("[aliasesHandler] Invalid request body", jsonBody);
        res.status(400).json({ "error": "Invalid request body" });
        return;
    }

    // Save users to the database
    await saveUserAliasesToDb(
        jsonBody.repo_name, jsonBody.repo_owner, jsonBody.repo_provider, jsonBody.aliases
    ).then(() => {
        console.info("[aliasesHandler] Aliases saved to DB successfully");
        res.status(200).send("OK");
        return;
    }).catch((error) => {
        console.error("[aliasesHandler] Unable to save aliases to DB, error: ", error);
        res.status(500).json({ "error": "Unable to save aliases to DB" });
        return;
    });
};

const aliasesGetHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info("[aliasesGetHandler] Retrieving aliases from DB...");

    // Extract query parameters
    const { repo_name, repo_owner, repo_provider } = req.query;

    // Validate query parameters
    if (!repo_name || !repo_owner || !repo_provider) {
        console.error("[aliasesGetHandler] Missing query parameters");
        res.status(400).json({ "error": "Missing query parameters" });
        return;
    }

    // Retrieve aliases from the database
    await getUserAliasesFromDb(
        repo_name as string, repo_owner as string, repo_provider as string
    ).then((aliases) => {
        console.info("[aliasesGetHandler] Aliases retrieved successfully");
        res.status(200).json({ aliases });
        return;
    })
    .catch((error) => {
        console.error("[aliasesGetHandler] Unable to retrieve aliases from DB, error: ", error);
        res.status(500).json({ "error": "Unable to retrieve aliases from DB" });
        return;
    });
};

export default aliasesHandler;