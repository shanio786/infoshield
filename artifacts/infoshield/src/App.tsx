import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

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

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/learn" component={Learn} />
      <Route path="/learn/:moduleId" component={ModuleDetail} />
      <Route path="/learn/:moduleId/lesson/:lessonId" component={LessonDetail} />
      <Route path="/quiz" component={QuizHub} />
      <Route path="/quiz/:quizId" component={QuizDetail} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/badges" component={Badges} />
      <Route path="/case-studies" component={CaseStudies} />
      <Route path="/case-studies/:slug" component={CaseStudyDetail} />
      <Route path="/forum" component={Forum} />
      <Route path="/forum/:postId" component={ForumPostDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
