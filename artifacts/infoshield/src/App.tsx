import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/auth";

import { Layout } from "@/components/layout";
import { Home } from "@/pages/home";
import { Learn } from "@/pages/learn";
import { ModuleDetail } from "@/pages/module";
import { LessonDetail } from "@/pages/lesson";
import { QuizHub } from "@/pages/quiz-hub";
import { QuizDetail } from "@/pages/quiz";
import { Dashboard } from "@/pages/dashboard";
import { Badges } from "@/pages/badges";
import { CaseStudies } from "@/pages/case-studies";
import { CaseStudyDetail } from "@/pages/case-study";
import { Forum } from "@/pages/forum";
import { ForumPostDetail } from "@/pages/forum-post";
import { PuzzlesPage } from "@/pages/puzzles";
import { Login } from "@/pages/login";

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 30, retry: 1 },
  },
});

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">Authenticating</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/learn" component={Learn} />
        <Route path="/learn/:moduleId" component={ModuleDetail} />
        <Route path="/learn/:moduleId/lesson/:lessonId" component={LessonDetail} />
        <Route path="/quiz" component={QuizHub} />
        <Route path="/quiz/:quizId" component={QuizDetail} />
        <Route path="/puzzles" component={PuzzlesPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/badges" component={Badges} />
        <Route path="/case-studies" component={CaseStudies} />
        <Route path="/case-studies/:slug" component={CaseStudyDetail} />
        <Route path="/forum" component={Forum} />
        <Route path="/forum/:postId" component={ForumPostDetail} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
