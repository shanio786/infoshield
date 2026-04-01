import { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetForumPost, getGetForumPostQueryKey, useCreateForumReply } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, User, Clock, MessageSquareQuote } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ForumPostDetail() {
  const params = useParams<{ postId: string }>();
  const postId = parseInt(params.postId || "0");
  const queryClient = useQueryClient();
  const [replyContent, setReplyContent] = useState("");

  const { data: post, isLoading } = useGetForumPost(postId, {
    query: { enabled: !!postId, queryKey: getGetForumPostQueryKey(postId) }
  });

  const replyMutation = useCreateForumReply();

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    replyMutation.mutate({
      postId,
      data: {
        content: replyContent,
        authorName: "Guest Analyst",
        userId: "guest-user"
      }
    }, {
      onSuccess: () => {
        setReplyContent("");
        queryClient.invalidateQueries({ queryKey: getGetForumPostQueryKey(postId) });
      }
    });
  };

  if (isLoading) return <div className="p-10 text-center animate-pulse">Decrypting thread...</div>;
  if (!post) return <div className="p-10 text-center text-destructive">Thread not found.</div>;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-center">
        <Link href="/forum" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forum
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Original Post */}
            <div className="bg-card border border-border rounded-xl p-8 mb-10 shadow-sm">
              <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground mb-8 pb-6 border-b border-border">
                <span className="flex items-center font-bold text-primary">
                  <User className="w-4 h-4 mr-2" />
                  {post.authorName}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* Replies */}
            <div className="space-y-6 mb-10 pl-6 border-l-2 border-secondary">
              <h3 className="text-lg font-serif font-bold flex items-center gap-2 mb-6">
                <MessageSquareQuote className="w-5 h-5 text-primary" />
                Replies ({post.replies.length})
              </h3>
              
              {post.replies.map((reply, idx) => (
                <div key={reply.id} className="bg-secondary/10 border border-border/50 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-foreground flex items-center">
                      <User className="w-3.5 h-3.5 mr-1.5 text-primary" />
                      {reply.authorName}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {formatDistanceToNow(new Date(reply.createdAt))} ago
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {reply.content}
                  </p>
                </div>
              ))}
              
              {post.replies.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No responses yet. Be the first to analyze this intel.</p>
              )}
            </div>

            {/* Add Reply */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-serif font-bold mb-4">Contribute to Analysis</h4>
              <form onSubmit={handleReply}>
                <Textarea 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Share your assessment..."
                  className="min-h-[120px] bg-background mb-4"
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={replyMutation.isPending || !replyContent.trim()}>
                    {replyMutation.isPending ? "Transmitting..." : "Submit Response"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
