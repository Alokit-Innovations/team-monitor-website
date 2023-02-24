import MainAppBar from "../views/MainAppBar";
import conn from '../utils/db';
import { NextPage } from "next";
import { renderObjAsTable } from "../utils/data";
import { ContributorVector } from "../types/contributor";
import Contributors2DView, { getContri2DProps } from "../views/Dashboard/contri_2d";
import RepoList, { getRepoList } from "../views/RepoList";

const RepoProfile: NextPage<{
	repo_list?: string[],
	repo_name?: string,
	contributor_2d_data?: Array<ContributorVector>
}> = ({ repo_list, repo_name, contributor_2d_data }) => {
	return (
		<>
			<MainAppBar isLoggedIn={true} />
			{(repo_name && contributor_2d_data) ? (<>
				<p>Repository: {repo_name}</p>
				<div className="block w-96 h-96 mx-auto">
					<Contributors2DView repo_data={contributor_2d_data} />
				</div>
				<div dangerouslySetInnerHTML={{ __html: renderObjAsTable(contributor_2d_data) }}></div>
			</>) : (repo_list) ? (
				<div className="max-w-[80%] mx-auto">
					<RepoList repo_list={repo_list} />
				</div>
			) : (<p>Something went wrong</p>)}
		</>
	)
}

RepoProfile.getInitialProps = async ({ query }) => {
	if (query.repo_name) {
		const repo_name = Array.isArray(query.repo_name) ? query.repo_name[0] : query.repo_name;
		const contributor_vector: Array<ContributorVector> = await getContri2DProps(conn, repo_name);
		if (contributor_vector.length > 0)
			return {
				repo_name: repo_name,
				contributor_2d_data: contributor_vector
			}
		else
			console.warn(`No data found for repository named ${repo_name}`);
	} else {
		console.debug("No repo name received");
	}
	const repo_list = await getRepoList(conn);
	return {
		repo_list: repo_list
	}
}

export default RepoProfile;