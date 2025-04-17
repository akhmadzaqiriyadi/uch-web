// app/dashboard/articles/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText, Plus, Edit, Trash2, Eye } from "lucide-react";
import type { Article, User } from "@/lib/types";

export const metadata = {
  title: "Articles - CMS Kampus",
  description: "Manage articles in CMS Kampus",
};

export default async function ArticlesPage() {
  const supabase = await createClient();

  // Get the current logged-in user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch articles with their authors
  const { data: articles, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      author:author_id(id, full_name, email)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
  }

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link
          href="/dashboard/articles/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Link>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Author
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles && articles.length > 0 ? (
                articles.map((article: Article & { author: User }) => {
                  // Check if the current user is the author of this article
                  const isAuthor = user?.id === article.author_id;
                  
                  return (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-3" />
                          <div className="text-sm font-medium text-gray-900">
                            {article.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {article.author?.full_name || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            article.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(article.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            href={`/articles/${article.slug}`}
                            className="text-indigo-600 hover:text-indigo-900"
                            target="_blank"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          
                          {/* Only show edit/delete buttons if user is the author */}
                          {isAuthor && (
                            <>
                              <Link
                                href={`/dashboard/articles/${article.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="h-5 w-5" />
                              </Link>
                              <Link
                                href={`/dashboard/articles/delete/${article.id}`}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </Link>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No articles found. Create your first article!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}