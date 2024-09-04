import React from "react";
import Link from "next/link";

interface Category {
  id: number;
  attributes: {
	name: string;
	slug: string;
	articles: {
	  data: Array<{}>;
	};
  };
}

interface Article {
  id: number;
  attributes: {
	title: string;
	slug: string;
  };
}

interface ArticleSelectProps {
	categories: Category[];
	articles: Article[];
	params: {
		slug: string;
		category: string;
	};
}

function selectedFilter(current: string, selected: string) {
  return `px-3 py-1 rounded-lg hover:underline ${current === selected ? "dark:bg-violet-700 dark:text-gray-100" : "dark:bg-violet-400 dark:text-gray-900"}`;
}

const ArticleSelect = ({
  categories,
  articles,
  params,
}: ArticleSelectProps) => {

  return (
	<div className="p-4 rounded-lg min-h-[365px] relative">
	  <h4 className="text-xl font-semibold">Browse By Category</h4>

	  <div>
		<div className="flex flex-wrap py-6 space-x-2 dark:border-gray-400">
		  {categories.map((category: Category) => {
			if (category.attributes.articles.data.length === 0) return null;
			return (
			  <Link
				key={category.id}
				href={`/${category.attributes.slug}`}
				className={selectedFilter(
				  category.attributes.slug,
				  params.category
				)}
			  >
				#{category.attributes.name}
			  </Link>
			);
		  })}
		  <Link href={"/"} className={selectedFilter("", "filter")}>
			#all
		  </Link>
		</div>

		<div className="space-y-2">
		  <h4 className="text-lg font-semibold">Other Posts You May Like</h4>
		  <ul className="ml-4 space-y-1 list-disc">
			{articles.map((article: Article) => {
			  return (
				<li key={`article-${article.id}`}>
				  <Link
				  	key={article.id}
					rel="noopener noreferrer"
					href={`/${params.category}/${article.attributes.slug}`}
					className={`${
					  params.slug === article.attributes.slug &&
					  "text-violet-400"
					}  hover:underline hover:text-violet-400 transition-colors duration-200`}
				  >
					{article.attributes.title}
				  </Link>
				</li>
			  );
			})}
		  </ul>
		</div>
	  </div>
	</div>
  );
}

export default ArticleSelect;