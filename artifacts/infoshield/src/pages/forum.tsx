import { useState } from "react";
import { useListForumPosts, getListForumPostsQueryKey, useCreateForumPost } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { MessageSquare, Clock, Plus, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Forum() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: posts, isLoading } = useListForumPosts({}, {
    query: { queryKey: getListForumPostsQueryKey() }
  });

  const createPostMutation = useCreateForumPost();

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createPostMutation.mutate({
      data: {
        title,
        content,
        authorName: "Guest Analyst",
        userId: "guest-user"
      }
    }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setTitle("");
        setContent("");
        queryClient.invalidateQueries({ queryKey: getListForumPostsQueryKey() });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">Intel Forum</h1>
          <p className="text-muted-foreground text-lg">Discuss tactics, share findings, and collaborate with other analysts.</p>
        </motion.div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0 font-medium">
              <Plus className="w-4 h-4 mr-2" /> New Dispatch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] border-border bg-card">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Create New Dispatch</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePost} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">Subject</label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="E.g., Analysis of recent deepfake..." 
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">Intelligence</label>
                <Textarea 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="Share your findings..." 
                  className="bg-background border-border min-h-[150px]"
                />
              </div>
              <Button type="submit" disabled={createPostMutation.isPending} className="w-full">
                {createPostMutation.isPending ? "Transmitting..." : "Submit Dispatch"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-card/50 animate-pulse rounded-lg border border-border" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {posts?.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/forum/${post.id}`}>
                <div className="bg-card border border-border hover:border-primary/50 rounded-lg p-5 transition-all group cursor-pointer">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                        <span className="flex items-center">
                          <User className="w-3.5 h-3.5 mr-1.5" />
                          {post.authorName}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1.5" />
                          {formatDistanceToNow(new Date(post.createdAt))} ago
                        </span>
                      </div>
                    </div>
                    <div className="bg-secondary/50 px-3 py-1.5 rounded-md flex flex-col items-center justify-center min-w-[3rem]">
                      <MessageSquare className="w-4 h-4 text-primary mb-1" />
                      <span className="text-xs font-bold">{post.replyCount}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
