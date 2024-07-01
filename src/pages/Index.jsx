import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyIds = await response.json();
  const stories = await Promise.all(
    storyIds.slice(0, 100).map(async (id) => {
      const storyResponse = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return storyResponse.json();
    })
  );
  return stories;
};

function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl text-center mb-4">Hacker News Top Stories</h1>
      <Input
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {isLoading ? (
        <div>
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} className="h-20 mb-4" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">Error fetching stories</div>
      ) : (
        <div className="grid gap-4">
          {filteredStories.map((story) => (
            <Card key={story.id}>
              <CardHeader>
                <CardTitle>
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {story.title}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{story.score} upvotes</p>
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Read more
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Index;